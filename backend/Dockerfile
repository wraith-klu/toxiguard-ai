FROM python:3.11-slim

# ─── Environment ─────────────────────────────────────────────────────────────
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    # Disable PyTorch fallback — inference runs via ONNX Runtime only.
    ONNX_ONLY=true \
    PORT=7860

# ─── System dependencies ──────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ─── Non-root user setup (Hugging Face Spaces UID 1000 requirement) ──────────
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# ─── Python dependencies (prod: no torch, ~2 GB lighter) ─────────────────────
COPY --chown=user:user requirements-prod.txt .
RUN pip install --no-cache-dir -r requirements-prod.txt

# ─── Application source ───────────────────────────────────────────────────────
COPY --chown=user:user . $HOME/app

# Switch to non-root user
USER user

# ─── Port ─────────────────────────────────────────────────────────────────────
EXPOSE 7860

# ─── Start server ─────────────────────────────────────────────────────────────
CMD ["sh", "-c", "gunicorn app.main:app -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:${PORT:-7860}"]
