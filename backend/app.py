"""
ToxiGuard AI — Hugging Face Space Application Entry Point
Mounts FastAPI backend onto Gradio so the space serves both:
1. The interactive testing interface in the Hugging Face Space tab
2. All production REST API endpoints: /docs, /redoc, /health, /predict, /chat/moderate, etc.
"""
import os
import sys

# 1. Disable Gradio SSR Node proxy (prevents Errno 98 port 7860 collision)
os.environ["GRADIO_SSR_MODE"] = "false"

# 2. Hugging Face ZeroGPU initialization
try:
    import spaces  # pyrefly: ignore[missing-import] # type: ignore
except ImportError:
    class spaces:  # type: ignore
        @staticmethod
        def GPU(fn=None, **kwargs):
            if fn is not None:
                return fn
            def decorator(f):
                return f
            return decorator

# Ensure backend root is in Python module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gradio as gr  # pyrefly: ignore[missing-import] # type: ignore
from app.main import app as fastapi_app
from app.services.model_service import model_service


# Literal @spaces.GPU decorator required for ZeroGPU static AST scanner
@spaces.GPU
def analyze_toxicity(text: str):
    """Interactive demo function for the Gradio UI."""
    if not text or not text.strip():
        return {"error": "Please enter text to analyze."}
    try:
        res = model_service.predict(text)
        return {
            "is_toxic": bool(res.get("is_toxic", False)),
            "confidence": round(float(res.get("confidence", 0.0)), 4),
            "primary_category": res.get("primary_category", "none"),
            "severity": res.get("severity", "none"),
            "model_used": res.get("model_used", "onnx-deberta"),
            "scores": {k: round(float(v), 4) for k, v in res.get("scores", {}).items()}
        }
    except Exception as e:
        return {"error": str(e)}


# ─── Gradio Interface for the Space page ─────────────────────────────────────
demo = gr.Interface(
    fn=analyze_toxicity,
    inputs=gr.Textbox(
        lines=3,
        placeholder="Enter text to analyze for toxicity, harassment, abuse...",
        label="Input Content"
    ),
    outputs=gr.JSON(label="Analysis Result"),
    title="🛡️ ToxiGuard AI — Content Moderation Platform",
    description=(
        "**Real-time multi-label toxicity detection engine powered by DeBERTa-v3 & ONNX Runtime.**\n\n"
        "### 🔗 Developer API Access:\n"
        "- 📖 **Interactive Swagger UI**: [/docs](/docs)\n"
        "- 📑 **ReDoc Documentation**: [/redoc](/redoc)\n"
        "- 💓 **Health & Model Status**: [/health](/health)\n"
        "- 🚀 **Prediction Endpoint**: `POST /predict` or `POST /predict/demo`"
    ),
    examples=[
        ["Thank you so much for your assistance! Have a wonderful day."],
        ["You are completely brainless and deserve to be banned forever."],
        ["Stop talking before I find where you live and hurt you."],
        ["I hate this stupid policy, but I understand why it was made."]
    ],
    cache_examples=False,
)

# Mount Gradio onto the existing FastAPI application
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
