"""
ToxiGuard AI — Hugging Face Space Entry Point (ZeroGPU + FastAPI)
==================================================================
Integration Architecture:
  1. `fastapi_app` is the primary ASGI application handling all REST endpoints:
     /predict, /predict/demo, /predict/ml, /health, /docs, /auth/*, /explain, etc.
  2. Gradio Blocks UI is mounted via `gr.mount_gradio_app(fastapi_app, demo, path="/")`
  3. ZeroGPU compatibility:
     - `import spaces` unconditionally at module top level.
     - `@spaces.GPU` decorated function `analyze_toxicity` bound to Gradio event handlers.
     - Explicit `spaces.zero.startup()` hook in __main__ tells the ZeroGPU broker
       that the custom ASGI server is initialized, preventing startup shutdown.
"""

import os
import sys

# Prevent port collision with Gradio's internal Node SSR proxy
os.environ["GRADIO_SSR_MODE"] = "false"

# ZeroGPU requirement: import spaces FIRST, unconditionally.
import spaces  # type: ignore  # pyrefly: ignore[missing-import]

# torch follows spaces (spaces monkey-patches torch.cuda for ZeroGPU)
try:
    import torch  # type: ignore  # pyrefly: ignore[missing-import]
except ImportError:
    pass

# Backend package root on sys.path so `from app.xxx import ...` works
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gradio as gr  # type: ignore  # pyrefly: ignore[missing-import]

from app.main import app as fastapi_app
from app.services.model_service import model_service


# ── @spaces.GPU inference function ──────────────────────────────────────────────
# Literal @spaces.GPU directly above def satisfies ZeroGPU's AST scanner and broker.
@spaces.GPU
def analyze_toxicity(text: str):
    """ZeroGPU-accelerated toxicity analysis for Gradio UI demo."""
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
        "🔗 **API Docs:** [/docs](/docs) · [/redoc](/redoc) · [/health](/health) · "
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
    # Direct binding for ZeroGPU handler scanner
    btn.click(fn=analyze_toxicity, inputs=txt_in, outputs=out)
    txt_in.submit(fn=analyze_toxicity, inputs=txt_in, outputs=out)


# ── Mount Gradio onto FastAPI ───────────────────────────────────────────────────
# Mounts Gradio UI at root path. All FastAPI endpoints (/predict, /health, /docs,
# /auth/*, etc.) are evaluated first by FastAPI, and unhandled paths fall through to Gradio.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")


# ── Entry Point ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Explicit ZeroGPU startup handshake for custom ASGI/FastAPI launchers
    try:
        if hasattr(spaces, "config") and getattr(spaces.config.Config, "zero_gpu", False):
            import spaces.zero  # type: ignore
            if hasattr(spaces.zero, "startup"):
                spaces.zero.startup()
                print("[ZeroGPU] spaces.zero.startup() sent to broker.", flush=True)
        elif hasattr(spaces, "zero") and hasattr(spaces.zero, "startup"):
            spaces.zero.startup()  # type: ignore
            print("[ZeroGPU] spaces.zero.startup() called directly.", flush=True)
    except Exception as _zg_err:
        print(f"[ZeroGPU] Startup hook notice: {_zg_err!r}", flush=True)

    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
