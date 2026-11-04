"""
ToxiGuard AI — Hugging Face Space Application Entry Point
Mounts FastAPI backend onto Gradio so the space serves both:
1. The interactive testing interface in the Hugging Face Space tab
2. All production REST API endpoints: /docs, /redoc, /health, /predict, /chat/moderate, etc.
"""
import os
import sys

# Ensure backend root is in Python module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Handle Hugging Face ZeroGPU environment if active
try:
    import spaces
    gpu_decorator = spaces.GPU
except Exception:
    def gpu_decorator(fn):
        return fn

import gradio as gr
from app.main import app as fastapi_app
from app.services.model_service import model_service


@gpu_decorator
def analyze_toxicity(text: str):
    """Interactive demo function for the Gradio UI."""
    if not text or not text.strip():
        return {
            "status": "error",
            "message": "Please enter text to analyze."
        }
    
    try:
        result = model_service.predict(text)
        return {
            "is_toxic": bool(result.get("is_toxic", False)),
            "confidence": round(float(result.get("confidence", 0.0)), 4),
            "primary_category": result.get("primary_category", "none"),
            "severity": result.get("severity", "none"),
            "model_used": result.get("model_used", "onnx-deberta"),
            "scores": {k: round(float(v), 4) for k, v in result.get("scores", {}).items()}
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
)

# Mount Gradio onto the existing FastAPI application
# FastAPI's routes (/docs, /health, /predict, etc.) take precedence.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
