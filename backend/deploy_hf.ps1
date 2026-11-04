<#
.SYNOPSIS
    Automated deployment script to push ToxiGuard AI backend to Hugging Face Spaces (Gradio Free Tier).
.DESCRIPTION
    Requires:
    1. Git installed with Git LFS (git lfs install)
    2. A Hugging Face account and an existing Space (https://huggingface.co/spaces/<user>/<space>)
#>

param (
    [Parameter(Mandatory=$true, HelpMessage="Your Hugging Face Space repository URL (e.g., https://huggingface.co/spaces/wraithklu/toxiguard-api)")]
    [string]$SpaceUrl,
    
    [Parameter(Mandatory=$false, HelpMessage="Your Hugging Face Access Token with Write permission (hf_...)")]
    [string]$Token
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ToxiGuard AI - Hugging Face Deployment Helper          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Git LFS
try {
    git lfs version | Out-Null
} catch {
    Write-Error "Git LFS is required. Please install Git LFS (https://git-lfs.com) and run 'git lfs install'."
    exit 1
}

# If token provided, inject it into SpaceUrl for automated authentication
$PushUrl = $SpaceUrl.Trim()
if ($Token -and $Token.Trim()) {
    $CleanToken = $Token.Trim()
    if ($SpaceUrl -match "huggingface\.co/spaces/([^/]+)/") {
        $HfUser = $matches[1]
        $PushUrl = $SpaceUrl -replace "https://", "https://${HfUser}:${CleanToken}@"
    } else {
        $PushUrl = $SpaceUrl -replace "https://", "https://${CleanToken}@"
    }
}

$BackendDir = $PSScriptRoot
$TempDeployDir = Join-Path $env:TEMP ("toxiguard_hf_" + [System.Guid]::NewGuid().ToString().Substring(0, 8))

try {
    Write-Host "[1/5] Cloning Space repository..." -ForegroundColor Yellow
    git clone $PushUrl $TempDeployDir
    if (-not (Test-Path $TempDeployDir)) {
        Write-Error "Failed to clone Space repository."
        exit 1
    }

    Write-Host "[2/5] Staging backend files into Space..." -ForegroundColor Yellow
    # Robocopy excludes virtual envs, local db, local secrets, and deployment scripts
    robocopy $BackendDir $TempDeployDir /E /XD venv .venv __pycache__ .pytest_cache tests .git /XF .env toxiguard.db *.log *.pyc deploy_hf.ps1 deploy_hf.sh deploy_oracle.sh | Out-Null
    if ($LASTEXITCODE -ge 8) {
        Write-Error "Robocopy failed with error code $LASTEXITCODE"
        exit 1
    }

    Push-Location $TempDeployDir

    Write-Host "[3/5] Configuring production dependencies and Space metadata..." -ForegroundColor Yellow
    # Ensure requirements.txt uses production lightweight dependencies
    Copy-Item -Path (Join-Path $TempDeployDir "requirements-prod.txt") -Destination (Join-Path $TempDeployDir "requirements.txt") -Force

    # Generate Space metadata README.md
    $HFReadme = @"
---
title: ToxiGuard AI Backend
emoji: 🛡️
colorFrom: red
colorTo: indigo
sdk: gradio
app_file: app.py
pinned: false
---

# ToxiGuard AI — Content Moderation Platform
Production FastAPI moderation backend powered by DeBERTa-v3 with ONNX Runtime.

## API Documentation
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- Health: `/health`
"@
    [System.IO.File]::WriteAllText((Join-Path $TempDeployDir "README.md"), $HFReadme, [System.Text.Encoding]::UTF8)

    Write-Host "[4/5] Initializing Git LFS tracking for ONNX and model weights..." -ForegroundColor Yellow
    git lfs install
    git lfs track "*.onnx" "*.joblib" "*.model"

    Write-Host "[5/5] Staging files, committing and pushing to Hugging Face..." -ForegroundColor Green
    Write-Host "      (Uploading 738 MB DeBERTa ONNX model via Git LFS, please wait...)" -ForegroundColor Cyan
    git add .
    git commit -m "Deploy ToxiGuard AI backend to Hugging Face Spaces"
    git branch -M main
    git push origin main --force

    Write-Host ""
    Write-Host "SUCCESS: ToxiGuard AI backend successfully deployed to Hugging Face Spaces!" -ForegroundColor Green
    Write-Host "View build and logs at: $SpaceUrl" -ForegroundColor Cyan
    Write-Host ""
} finally {
    Pop-Location
    Start-Sleep -Seconds 2
    Remove-Item -Recurse -Force $TempDeployDir -ErrorAction SilentlyContinue
}
