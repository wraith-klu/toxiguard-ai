# ToxiGuard AI Deployment Helper
param (
    [Parameter(Mandatory=$true)]
    [string]$SpaceUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$Token
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ToxiGuard AI - Hugging Face Deployment Helper          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

try {
    git lfs version | Out-Null
} catch {
    Write-Error "Git LFS is required. Run: git lfs install"
    exit 1
}

$PushUrl = $SpaceUrl.Trim()
if ($Token -and $Token.Trim()) {
    $CleanToken = $Token.Trim()
    if ($SpaceUrl -match "huggingface\.co/spaces/([^/]+)/") {
        $HfUser = $matches[1]
        $PushUrl = $SpaceUrl -replace "https://", ("https://" + $HfUser + ":" + $CleanToken + "@")
    } else {
        $PushUrl = $SpaceUrl -replace "https://", ("https://" + $CleanToken + "@")
    }
}

$BackendDir = $PSScriptRoot
$TempDeployDir = Join-Path $env:TEMP ("toxiguard_hf_" + [System.Guid]::NewGuid().ToString().Substring(0, 8))

try {
    # Skip downloading the 738MB model back down (we already have it locally)
    $env:GIT_LFS_SKIP_SMUDGE = "1"
    Write-Host "[1/5] Cloning Space repository (instant clone)..." -ForegroundColor Yellow
    git clone $PushUrl $TempDeployDir
    $env:GIT_LFS_SKIP_SMUDGE = "0"

    if (-not (Test-Path $TempDeployDir)) {
        Write-Error "Failed to clone Space repository."
        exit 1
    }

    Write-Host "[2/5] Staging backend files into Space..." -ForegroundColor Yellow
    robocopy $BackendDir $TempDeployDir /E /XD venv .venv __pycache__ .pytest_cache tests .git /XF .env toxiguard.db *.log *.pyc train.csv test.csv deploy_hf.ps1 deploy_hf.sh deploy_oracle.sh | Out-Null
    if ($LASTEXITCODE -ge 8) {
        Write-Error ("Robocopy failed with code " + $LASTEXITCODE)
        exit 1
    }

    Push-Location $TempDeployDir

    Write-Host "[3/5] Configuring production dependencies and Space metadata..." -ForegroundColor Yellow
    Copy-Item -Path (Join-Path $TempDeployDir "requirements-prod.txt") -Destination (Join-Path $TempDeployDir "requirements.txt") -Force

    $emoji = [char]::ConvertFromUtf32(0x1F6E1)
    $lines = @(
        '---',
        'title: ToxiGuard AI Backend',
        ('emoji: ' + $emoji),
        'colorFrom: red',
        'colorTo: indigo',
        'sdk: gradio',
        'app_file: app.py',
        'pinned: false',
        '---',
        '',
        '# ToxiGuard AI - Content Moderation Platform',
        'Production FastAPI moderation backend powered by DeBERTa-v3 with ONNX Runtime.',
        '',
        '## API Documentation',
        '- Swagger UI: /docs',
        '- ReDoc: /redoc',
        '- Health: /health'
    )
    $HFReadme = $lines -join [System.Environment]::NewLine
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText((Join-Path $TempDeployDir "README.md"), $HFReadme, $utf8NoBom)

    Write-Host "[4/5] Initializing Git LFS tracking for ONNX and model weights..." -ForegroundColor Yellow
    git lfs install
    git lfs track "*.onnx" "*.joblib" "*.model"

    Write-Host "[5/5] Staging files, committing and pushing to Hugging Face..." -ForegroundColor Green
    Write-Host "      (Uploading updates, please wait...)" -ForegroundColor Cyan
    git add .
    git commit -m "Deploy ToxiGuard AI backend to Hugging Face Spaces"
    git branch -M main
    git push origin main --force
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Git push failed."
        exit 1
    }

    Write-Host ""
    Write-Host "SUCCESS: ToxiGuard AI backend successfully deployed to Hugging Face Spaces!" -ForegroundColor Green
    Write-Host ("View build and logs at: " + $SpaceUrl) -ForegroundColor Cyan
    Write-Host ""
} finally {
    Pop-Location
    Start-Sleep -Seconds 2
    Remove-Item -Recurse -Force $TempDeployDir -ErrorAction SilentlyContinue
}
