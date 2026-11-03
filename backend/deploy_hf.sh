#!/usr/bin/env bash
# ==============================================================================
# ToxiGuard AI — Hugging Face Spaces Deployment Helper
# ==============================================================================

set -e

if [ -z "$1" ]; then
    echo "Usage: ./deploy_hf.sh https://huggingface.co/spaces/<username>/<space-name>"
    exit 1
fi

SPACE_URL="$1"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TEMP_DIR=$(mktemp -d)

echo "🛡️ Deploying ToxiGuard AI Backend to Hugging Face Spaces..."

# 1. Check Git LFS
if ! command -v git-lfs &> /dev/null; then
    echo "⚠️ git-lfs not found. Please install git-lfs (https://git-lfs.com) to push model files."
    exit 1
fi

# 2. Clone Space
echo "📁 Cloning Space repository..."
git clone "$SPACE_URL" "$TEMP_DIR"

# 3. Sync backend files
echo "📦 Staging backend files into Space..."
rsync -av --progress "$SCRIPT_DIR/" "$TEMP_DIR/" \
    --exclude="venv" \
    --exclude=".venv" \
    --exclude="__pycache__" \
    --exclude=".pytest_cache" \
    --exclude="tests" \
    --exclude="toxiguard.db" \
    --exclude="*.log"

# 4. Push to HF
cd "$TEMP_DIR"
git lfs install
git lfs track "*.onnx" "*.joblib" "*.model"
git add .
git commit -m "Deploy ToxiGuard backend to Hugging Face Spaces" || echo "No changes to commit."
git push origin main

# Cleanup
rm -rf "$TEMP_DIR"
echo "✅ Push complete! Check build progress on Hugging Face: $SPACE_URL"
