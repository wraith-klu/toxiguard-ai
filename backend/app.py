"""
ToxiGuard AI — Hugging Face Space Entry Point (ZeroGPU + demo.launch())
========================================================================
Architecture:
  - ZeroGPU requires demo.launch() as the entrypoint (NOT gr.mount_gradio_app
    + uvicorn). The mount pattern bypasses ZeroGPU's post-startup scanner.
  - FastAPI routes are attached to Gradio's internal app (demo.app) AFTER
    the Blocks context, before launch. This preserves all API endpoints.
  - HF Spaces runs: python app.py  →  demo.launch() blocks the process.

ZeroGPU rules (never violate):
  1. `import spaces` unconditional at module level.
  2. `@spaces.GPU` literal decorator directly above the def.
  3. `import spaces` before `import torch` and all ML libs.
  4. analyze_toxicity bound DIRECTLY to btn.click(fn=analyze_toxicity).
  5. No `class spaces:` or `spaces = ...` after the import.
  6. `spaces` NOT in requirements.txt (HF pre-installs it).
  7. `torch` MUST be in requirements.txt.
"""

import os
import sys

# ZeroGPU requirement: import spaces FIRST, unconditionally.
# The static AST scanner and runtime hook both require this.
import spaces  # type: ignore  # pyrefly: ignore[missing-import]

# torch follows spaces (spaces monkey-patches torch.cuda for ZeroGPU)
try:
    import torch  # type: ignore  # pyrefly: ignore[missing-import]
except ImportError:
    pass  # ONNX-only path — torch not strictly required for inference

# Backend package root on sys.path so `from app.xxx import ...` works
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gradio as gr  # type: ignore  # pyrefly: ignore[missing-import]

from app.main import app as fastapi_app
from app.services.model_service import model_service


# ── @spaces.GPU inference function ──────────────────────────────────────────────
# MUST be the literal `@spaces.GPU` decorator directly above the def.
# ZeroGPU static AST scanner looks for exactly this pattern.
# Also registered directly in btn.click / txt_in.submit so the runtime
# Gradio-event-registry scanner finds it after startup.
@spaces.GPU
def analyze_toxicity(text: str):
    """ZeroGPU-accelerated toxicity analysis."""
    if not text or not text.strip():
        return {"error": "Please enter some text to analyse."}
    try:
        res = model_service.predict(text)
        if res is None:
            return {"error": "Model not ready — please try again shortly."}
        return {
            "is_toxic":         bool(res.get("toxic", res.get("is_toxic", False))),
            "confidence":       round(float(res.get("toxicity_probability", res.get("confidence", 0.0))), 4),
            "primary_category": res.get("category", res.get("primary_category", "none")),
            "severity":         res.get("severity", "none"),
            "model_used":       res.get("source", res.get("model_used", "onnx-deberta")),
            "scores":           {k: round(float(v), 4) for k, v in res.get("labels", res.get("scores", {})).items()},
        }
    except Exception as exc:
        return {"error": str(exc)}


# ── Gradio Blocks UI ─────────────────────────────────────────────────────────────
with gr.Blocks(title="ToxiGuard AI") as demo:
    gr.Markdown(
        "# 🛡️ ToxiGuard AI — Content Moderation\n\n"
        "**DeBERTa-v3 · ONNX Runtime · Real-time multi-label toxicity detection**\n\n"
        "🔗 **API Docs:** [/docs](/docs) · [/redoc](/redoc) · [/health](/health)"
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
    # Direct binding — ZeroGPU runtime scanner checks these registrations.
    btn.click(fn=analyze_toxicity, inputs=txt_in, outputs=out)
    txt_in.submit(fn=analyze_toxicity, inputs=txt_in, outputs=out)


# ── Attach FastAPI routes to Gradio's internal app ───────────────────────────────
# Mount the entire FastAPI app as a sub-application at "/api" on Gradio's
# internal Starlette app. All routes are accessible at /api/<route>.
# e.g. /api/predict, /api/health, /api/docs
demo.app.mount("/api", fastapi_app)


# ── HF Space entrypoint ──────────────────────────────────────────────────────────
# HF Spaces executes `python app.py`. demo.launch() is the correct entrypoint
# for ZeroGPU spaces — it registers the GPU function with the ZeroGPU daemon
# and keeps the process alive. gr.mount_gradio_app + uvicorn does NOT work
# because ZeroGPU's post-startup scanner cannot find @spaces.GPU functions
# registered through the mount pattern.
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(
        server_name="0.0.0.0",
        server_port=port,
        show_error=True,
        share=False,
    )
