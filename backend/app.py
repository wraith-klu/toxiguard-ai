"""
ToxiGuard AI — Hugging Face Space Entry Point (ZeroGPU-compatible)
====================================================================
Key rules for ZeroGPU compatibility:
  1. `import spaces` at module level (unconditional) — AST scanner must see it.
  2. `@spaces.GPU` as the LITERAL decorator directly above analyze_toxicity.
  3. analyze_toxicity is bound directly to btn.click(fn=...) in gr.Blocks.
  4. No class/variable named `spaces` shadows the import.
  5. `import spaces` must come before `import torch` and all ML libs.
"""

import os
import sys

# Disable Gradio SSR proxy to prevent port 7860 collision with Gradio's
# internal Node.js server-side rendering process.
os.environ["GRADIO_SSR_MODE"] = "false"

# ZeroGPU requirement: import spaces before torch (and before all other ML libs).
# spaces monkey-patches torch.cuda so ZeroGPU can intercept GPU allocation.
# This import is intentionally UNCONDITIONAL so the ZeroGPU static AST scanner
# can find it at the module level.
import spaces  # type: ignore  # pyrefly: ignore[missing-import]

# torch import follows spaces (required by ZeroGPU architecture)
try:
    import torch  # type: ignore  # pyrefly: ignore[missing-import]
except ImportError:
    pass  # ONNX-only path; torch is not strictly required for inference

# Backend package root — enables `from app.xxx import ...`
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Framework imports
import gradio as gr  # type: ignore  # pyrefly: ignore[missing-import]

from app.main import app as fastapi_app
from app.services.model_service import model_service


# ── Toxicity inference function ─────────────────────────────────────────────────
# @spaces.GPU MUST be the literal decorator immediately above the def.
# ZeroGPU uses a static AST scanner — aliased decorators are not found.
# This function is also bound directly to the Gradio event handlers below
# so the runtime scanner (which checks registered Gradio handlers) finds it too.
@spaces.GPU
def analyze_toxicity(text: str):
    """ZeroGPU-accelerated toxicity analysis for the Gradio UI demo."""
    if not text or not text.strip():
        return {"error": "Please enter some text to analyse."}
    try:
        res = model_service.predict(text)
        if res is None:
            return {"error": "Model not ready — please try again shortly."}
        is_toxic   = bool(res.get("toxic", res.get("is_toxic", False)))
        confidence = float(res.get("toxicity_probability", res.get("confidence", 0.0)))
        category   = res.get("category", res.get("primary_category", "none"))
        severity   = res.get("severity", "none")
        source     = res.get("source", res.get("model_used", "onnx-deberta"))
        scores     = res.get("labels", res.get("scores", {}))
        return {
            "is_toxic":         is_toxic,
            "confidence":       round(confidence, 4),
            "primary_category": category,
            "severity":         severity,
            "model_used":       source,
            "scores":           {k: round(float(v), 4) for k, v in scores.items()},
        }
    except Exception as exc:
        return {"error": str(exc)}


# ── Gradio Blocks UI ────────────────────────────────────────────────────────────
with gr.Blocks(title="ToxiGuard AI") as demo:
    gr.Markdown(
        "# 🛡️ ToxiGuard AI — Content Moderation\n\n"
        "**DeBERTa-v3 · ONNX Runtime · Real-time multi-label toxicity detection**\n\n"
        "🔗 **API:** [/docs](/docs) · [/redoc](/redoc) · [/health](/health) · "
        "`POST /predict` · `POST /predict/demo`"
    )
    txt_in = gr.Textbox(
        lines=4,
        placeholder="Enter text to analyse for toxicity, harassment, threats…",
        label="Input Text",
    )
    btn = gr.Button("🔍 Analyse", variant="primary")
    out = gr.JSON(label="Result")
    gr.Examples(
        examples=[
            ["Thank you so much for your help! Have a wonderful day."],
            ["You are completely brainless and deserve to be banned."],
            ["Stop talking before I find where you live and hurt you."],
            ["I hate this policy, but I understand why it exists."],
        ],
        inputs=txt_in,
        cache_examples=False,
    )
    # Bind analyze_toxicity DIRECTLY to Gradio event handlers.
    # ZeroGPU's startup scanner inspects these registered handler bindings.
    btn.click(fn=analyze_toxicity, inputs=txt_in, outputs=out)
    txt_in.submit(fn=analyze_toxicity, inputs=txt_in, outputs=out)


# ── Mount Gradio UI onto FastAPI ─────────────────────────────────────────────────
# gr.mount_gradio_app(fastapi_app, demo, path="/") mounts the Gradio Blocks UI
# at "/" on the FastAPI application. All FastAPI routes (/docs, /health,
# /predict, /auth/*, etc.) remain accessible at their original paths.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")


# ── Local development entry point ────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
