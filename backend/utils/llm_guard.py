import json
import re
import hashlib
from collections import OrderedDict
from threading import Lock
from openai import OpenAI

from app.core.logger import logger
from app.core.config import settings

# ── OPENROUTER CLIENT ────────────────────────────────────────────────────────
if not settings.openrouter_api_key:
    logger.warning("[LLM] OPENROUTER_API_KEY not set — OpenRouter calls will be skipped")
    client = None
else:
    client = OpenAI(
        api_key=settings.openrouter_api_key,
        base_url="https://openrouter.ai/api/v1",
        timeout=settings.llm_timeout
    )

OPENROUTER_MODEL = settings.openrouter_model
OPENROUTER_FALLBACK_MODEL = settings.openrouter_fallback_model

# ── GEMINI CLIENT (lazy) ──────────────────────────────────────────────────────
# Loaded on first use to avoid import errors if the package is not installed.
GEMINI_MODEL = settings.gemini_model
GEMINI_API_KEY = settings.gemini_api_key


def _call_gemini(messages: list[dict]) -> str:
    """Call Google Gemini and return the raw text response."""
    from google import genai  # lazy import -- requires: pip install google-genai
    client_gemini = genai.Client(api_key=GEMINI_API_KEY)
    # Merge system + user messages into a single prompt for Gemini
    system_text = next((m["content"] for m in messages if m["role"] == "system"), "")
    user_text   = next((m["content"] for m in messages if m["role"] == "user"),   "")
    prompt = f"{system_text}\n\nText to analyse:\n{user_text}"
    resp = client_gemini.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    return resp.text or ""

# LRU CACHE (replaces naive cooldown)

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
    """Safely extract JSON from LLM response, handling extra text."""
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

Your task is to deeply analyze the input text and explain the reasoning.

Return ONLY valid JSON with this schema:

{
  "toxic": true,
  "confidence": 0.95,
  "severity": "high",
  "category": "hate",
  "detected_phrases": ["example word"],
  "explanation": "Clear explanation of the toxicity..."
}

Field requirements:
- "toxic": boolean (true/false)
- "confidence": float between 0.0 and 1.0
- "severity": string ("low", "medium", or "high")
- "category": string (must be one of the allowed categories)
- "detected_phrases": array of exact abusive words/phrases found
- "explanation": 2-4 clear sentences explaining why the content is toxic or safe

Rules:
- Explanation MUST clearly explain WHY the content is toxic or safe
- Mention specific words or phrases responsible
- Explain the intent or meaning (insult, sexual, threat, etc.)
- Describe potential harm or impact
- Use natural human-like reasoning (not robotic)
- Consider CONTEXT: "I hate rainy days" is NOT toxic. "I hate you, die" IS toxic.
- Words like "hate", "kill", "die" are only toxic when directed at people with harmful intent

Allowed categories:
sexual, abusive, harassment, hate, threat, violence, self_harm, spam, toxic, safe

Return ONLY JSON. No extra text.
""".strip()

# VALID CATEGORIES

VALID_CATEGORIES = {
    "sexual", "abusive", "harassment", "hate",
    "threat", "violence", "self_harm",
    "spam", "toxic", "safe"
}

# DEFAULT SAFE RESPONSE

DEFAULT_SAFE_RESPONSE = {
    "toxic": False,
    "confidence": 0.0,
    "severity": "low",
    "category": "safe",
    "detected_phrases": [],
    "explanation": "LLM unavailable or parsing failed"
}

# MAIN FUNCTION

def analyze_toxicity_llm(text: str) -> dict:
    """
    Uses LLM to analyze toxicity with explainability.
    Results are cached (LRU, 128 entries) to prevent redundant calls.
    Tries the primary model first, then falls back to a secondary model on failure.
    """

    # ---------- CACHE CHECK ----------
    key = _cache_key(text)
    cached = _cache_get(key)
    if cached is not None:
        return cached

    try:
        # ---------- BUILD PROMPT ----------
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ]

        # ---------- CALL MODEL ----------
        # Tier 1: OpenRouter primary
        raw_text: str | None = None

        if client is not None:
            try:
                response = client.chat.completions.create(
                    model=OPENROUTER_MODEL,
                    messages=messages,
                    temperature=settings.llm_temperature,
                    max_tokens=settings.llm_max_tokens
                )
                raw_text = (response.choices[0].message.content or "").strip()
            except Exception as primary_err:
                logger.warning(f"[LLM] Primary model error: {primary_err} — trying OpenRouter fallback")
                # Tier 2: OpenRouter fallback model
                try:
                    response = client.chat.completions.create(
                        model=OPENROUTER_FALLBACK_MODEL,
                        messages=messages,
                        temperature=settings.llm_temperature + 0.1,
                        max_tokens=settings.llm_max_tokens
                    )
                    raw_text = (response.choices[0].message.content or "").strip()
                except Exception as fallback_err:
                    logger.warning(f"[LLM] OpenRouter fallback error: {fallback_err} — trying Gemini")

        # Tier 3: Google Gemini (secondary fallback)
        if raw_text is None:
            if not GEMINI_API_KEY:
                logger.error("[LLM] All LLM providers exhausted and GEMINI_API_KEY is not set")
                return DEFAULT_SAFE_RESPONSE
            try:
                raw_text = _call_gemini(messages).strip()
                logger.info("[LLM] Response obtained via Gemini fallback")
            except Exception as gemini_err:
                logger.error(f"[LLM] Gemini fallback also failed: {gemini_err}")
                return DEFAULT_SAFE_RESPONSE

        parsed = _extract_json(raw_text)

        # ---------- VALIDATE EXPLANATION ----------
        explanation = str(parsed.get("explanation", "")).strip()
        if len(explanation) < 20:
            if parsed.get("detected_phrases"):
                explanation = (
                    f"The content contains potentially harmful language such as "
                    f"{', '.join(parsed.get('detected_phrases'))}. "
                    f"This indicates {parsed.get('category', 'toxic')} behavior "
                    f"which may negatively affect individuals or communities."
                )
            else:
                explanation = (
                    "The content appears to be safe with no strong "
                    "indicators of harmful or abusive intent."
                )

        # ---------- VALIDATE CATEGORY ----------
        cat = str(parsed.get("category", "safe")).lower()
        if cat not in VALID_CATEGORIES:
            cat = "toxic"

        is_toxic = bool(parsed.get("toxic", False))
        
        try:
            conf = float(parsed.get("confidence", 0.0))
        except (ValueError, TypeError):
            conf = 0.0
            
        # Handle cases where model outputs percentages (e.g. 95 instead of 0.95)
        if conf > 1.0:
            conf = conf / 100.0
            
        # Ensure confidence aligns with the toxic flag if the LLM hallucinated a 0 or missed the key
        if is_toxic and conf < 0.5:
            conf = 0.85

        result = {
            "toxic": is_toxic,
            "confidence": conf,
            "severity": parsed.get("severity", "low"),
            "category": cat,
            "detected_phrases": parsed.get("detected_phrases", []),
            "explanation": explanation
        }

        # ---------- CACHE RESULT ----------
        _cache_set(key, result)

        return result

    except Exception as e:
        logger.error(f"[LLM] Analysis failed: {e}")
        return DEFAULT_SAFE_RESPONSE