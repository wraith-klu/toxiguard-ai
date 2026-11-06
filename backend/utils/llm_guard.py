import json
import re
import os
import hashlib
import urllib.request
from collections import OrderedDict
from threading import Lock
from openai import OpenAI

from app.core.logger import logger
from app.core.config import settings

# ── OPENROUTER CLIENT ────────────────────────────────────────────────────────
def _get_openrouter_client() -> OpenAI | None:
    api_key = settings.openrouter_api_key or os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key:
        return None
    return OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        timeout=settings.llm_timeout,
    )

OPENROUTER_MODELS = [
    settings.openrouter_model or "liquid/lfm-2.5-2.6b:free",
    settings.openrouter_fallback_model or "nvidia/nemotron-3.5-lightning:free",
    "cohere/north-mini-code:free",
    "recursive/flint-v1.0:free",
]

# ── GEMINI REST CLIENT ────────────────────────────────────────────────────────
def _call_gemini_rest(messages: list[dict]) -> str | None:
    """Call Google Gemini via standard REST API without requiring external SDKs."""
    api_key = settings.gemini_api_key or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return None

    # Merge messages into single prompt
    system_text = next((m["content"] for m in messages if m.get("role") == "system"), "")
    user_text   = next((m["content"] for m in messages if m.get("role") == "user"),   "")
    full_prompt = f"{system_text}\n\nText to analyze:\n{user_text}"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": full_prompt}]}]
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode())
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as exc:
        logger.warning(f"[LLM] Gemini REST call failed: {exc}")
        return None

# LRU CACHE

_CACHE_MAX_SIZE = settings.llm_cache_size
_cache: OrderedDict = OrderedDict()
_cache_lock = Lock()


def _cache_key(text: str) -> str:
    """Generate a short hash key for cache lookup."""
    return hashlib.sha256(text.strip().lower().encode()).hexdigest()[:16]


def _cache_get(key: str) -> dict | None:
    """Thread-safe LRU cache get."""
    with _cache_lock:
        if key in _cache:
            _cache.move_to_end(key)
            return _cache[key]
    return None


def _cache_set(key: str, value: dict):
    """Thread-safe LRU cache set with eviction."""
    with _cache_lock:
        _cache[key] = value
        _cache.move_to_end(key)
        while len(_cache) > _CACHE_MAX_SIZE:
            _cache.popitem(last=False)


# SAFE JSON EXTRACTION

def _extract_json(text: str) -> dict:
    """Safely extract JSON from LLM response, handling extra text or reasoning blocks."""
    if not text:
        return {}
    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except Exception:
            pass

    return {}

# STRICT MODERATION PROMPT

SYSTEM_PROMPT = """
You are an advanced AI content moderation system.
Analyze the input text for toxicity and harmful content.

Return ONLY valid JSON with this schema:
{
  "toxic": true,
  "confidence": 0.95,
  "severity": "high",
  "category": "abusive",
  "detected_phrases": ["example"],
  "explanation": "Clear explanation of the toxicity..."
}

Allowed categories: sexual, abusive, harassment, hate, threat, violence, self_harm, spam, toxic, safe.
Return ONLY JSON. No extra text.
""".strip()

VALID_CATEGORIES = {
    "sexual", "abusive", "harassment", "hate",
    "threat", "violence", "self_harm",
    "spam", "toxic", "safe"
}


def _generate_fallback_explanation(text: str) -> dict:
    """
    Intelligent contextual fallback generator.
    Guarantees that a high-quality explanation is always provided to the dashboard
    even if external third-party LLM APIs are temporarily throttled or rate-limited.
    """
    from utils.abuse_words import detect_abusive_tokens, get_abuse_severity
    from utils.sentiment import analyze_sentiment

    abusive_hits = detect_abusive_tokens(text)
    sentiment = analyze_sentiment(text)
    has_abuse = len(abusive_hits) > 0

    if has_abuse:
        severity = get_abuse_severity(abusive_hits)
        words_str = ", ".join(f'"{w}"' for w in abusive_hits[:3])
        category = "harassment" if severity == "high" else "abusive"
        explanation = (
            f"The analyzed text contains explicit profanity and hostile language ({words_str}). "
            f"This constitutes direct interpersonal abuse or harassment, creating an unsafe and hostile "
            f"environment in violation of communication safety standards."
        )
        return {
            "toxic": True,
            "confidence": 0.95 if severity == "high" else 0.85,
            "severity": severity,
            "category": category,
            "detected_phrases": abusive_hits,
            "explanation": explanation,
        }
    else:
        return {
            "toxic": False,
            "confidence": 0.05,
            "severity": "low",
            "category": "safe",
            "detected_phrases": [],
            "explanation": (
                "The analyzed text does not exhibit indicators of abuse, hostility, or profanity. "
                "The content is categorized as neutral and compliant with safety guidelines."
            ),
        }


# MAIN FUNCTION

def analyze_toxicity_llm(text: str) -> dict:
    """
    Uses LLM to analyze toxicity with explainability.
    Falls back gracefully across multiple providers and deterministic rules
    so an insightful explanation is ALWAYS returned.
    """
    key = _cache_key(text)
    cached = _cache_get(key)
    if cached is not None:
        return cached

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": text}
    ]

    raw_text: str | None = None
    client = _get_openrouter_client()

    if client is not None:
        for model in OPENROUTER_MODELS:
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=settings.llm_temperature,
                    max_tokens=settings.llm_max_tokens,
                )
                choice = response.choices[0].message
                content = (choice.content or "").strip()
                if not content and hasattr(choice, "reasoning") and choice.reasoning:
                    content = choice.reasoning.strip()

                if content:
                    raw_text = content
                    logger.info(f"[LLM] Response obtained via OpenRouter model: {model}")
                    break
            except Exception as model_err:
                logger.warning(f"[LLM] Model {model} failed: {model_err}")

    # Fallback: Google Gemini
    if not raw_text:
        raw_text = _call_gemini_rest(messages)

    # Fallback: Intelligent Contextual Engine if all APIs are rate-limited
    if not raw_text:
        logger.info("[LLM] External providers unavailable — generating intelligent contextual explanation")
        result = _generate_fallback_explanation(text)
        _cache_set(key, result)
        return result

    parsed = _extract_json(raw_text)

    # Validate explanation
    explanation = str(parsed.get("explanation", "")).strip()
    if len(explanation) < 20:
        fallback = _generate_fallback_explanation(text)
        explanation = fallback["explanation"]

    cat = str(parsed.get("category", "safe")).lower()
    if cat not in VALID_CATEGORIES:
        cat = "toxic"

    is_toxic = bool(parsed.get("toxic", False))
    try:
        conf = float(parsed.get("confidence", 0.0))
    except (ValueError, TypeError):
        conf = 0.0

    if conf > 1.0:
        conf = conf / 100.0
    if is_toxic and conf < 0.5:
        conf = 0.85

    result = {
        "toxic": is_toxic,
        "confidence": round(conf, 4),
        "severity": str(parsed.get("severity", "low")).lower(),
        "category": cat,
        "detected_phrases": parsed.get("detected_phrases", []),
        "explanation": explanation,
    }

    _cache_set(key, result)
    return result
