<#
.SYNOPSIS
    Automated deployment script to push ToxiGuard AI backend to Hugging Face Spaces.
.DESCRIPTION
    Requires:
    1. Git installed with Git LFS (git lfs install)
    2. A Hugging Face account and an existing Blank Docker Space
#>

param (
    [Parameter(Mandatory=$true, HelpMessage="Your Hugging Face Space repository URL (e.g., https://huggingface.co/spaces/username/toxiguard-api)")]
    [string]$SpaceUrl
)

$ErrorActionPreference = "Stop"

Write-Host "`n🛡️ ToxiGuard AI - Hugging Face Spaces Deployment Helper`n" -ForegroundColor Cyan

# Check Git LFS
try {
    git lfs version | Out-Null
} catch {
    Write-Error "Git LFS is required for pushing ONNX model files. Please install Git LFS from https://git-lfs.com and run 'git lfs install'."
    exit 1
}

$BackendDir = $PSScriptRoot
$TempDeployDir = Join-Path $env:TEMP ("toxiguard_hf_" + [System.Guid]::NewGuid().ToString().Substring(0, 8))

Write-Host "📁 Cloning Space repo to temporary staging directory..." -ForegroundColor Yellow
git clone $SpaceUrl $TempDeployDir

Write-Host "📦 Staging backend files into Space..." -ForegroundColor Yellow
# Copy necessary backend files, ignoring virtual environments and logs
$ExcludeDirs = @("venv", ".venv", "__pycache__", ".pytest_cache", "tests")
Get-ChildItem -Path $BackendDir -Recurse | Where-Object {
    $item = $_
    -not ($ExcludeDirs | Where-Object { $item.FullName -match "\\$_(\\|$)" })
} | Copy-Item -Destination {
    $rel = $_.FullName.Substring($BackendDir.Length)
    Join-Path $TempDeployDir $rel
} -Force

Push-Location $TempDeployDir
try {
    Write-Host "⚙️ Initializing Git LFS in Space..." -ForegroundColor Yellow
    git lfs install
    git lfs track "*.onnx" "*.joblib" "*.model"

    Write-Host "🚀 Committing and pushing to Hugging Face..." -ForegroundColor Green
    git add .
    git commit -m "Deploy ToxiGuard backend to Hugging Face Spaces"
    git push origin main
    Write-Host "`n✅ Successfully deployed to Hugging Face Spaces!" -ForegroundColor Green
    Write-Host "Check build progress in your Space dashboard: $SpaceUrl`n" -ForegroundColor Cyan
} finally {
    Pop-Location
    Remove-Item -Recurse -Force $TempDeployDir -ErrorAction SilentlyContinue
}
