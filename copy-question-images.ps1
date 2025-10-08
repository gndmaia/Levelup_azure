# Copy Question Images Script
# This script helps you copy images from the SkillCertPro_files folder to the project

Write-Host "=== Question Image Copy Script ===" -ForegroundColor Cyan
Write-Host ""

# Images needed
$images = @(
    "word-image-23.webp",
    "word-image-24.webp",
    "word-image-232.webp",
    "word-image-233.webp"
)

# Target directory
$targetDir = Join-Path $PSScriptRoot "public\question-images"

Write-Host "Target directory: $targetDir" -ForegroundColor Yellow
Write-Host ""

# Ask user for source directory
Write-Host "Please enter the path to the SkillCertPro_files folder" -ForegroundColor Green
Write-Host "(Example: C:\Users\YourName\Downloads\AI-900 Microsoft Azure AI Fundamentals Exam Questions - Page 2 of 15 - SkillCertPro_files)"
Write-Host ""
$sourceDir = Read-Host "Source folder path"

if (-not (Test-Path $sourceDir)) {
    Write-Host "ERROR: Source directory not found: $sourceDir" -ForegroundColor Red
    Write-Host "Please check the path and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Copying images..." -ForegroundColor Cyan
$copied = 0
$missing = 0

foreach ($image in $images) {
    $sourcePath = Join-Path $sourceDir $image
    $targetPath = Join-Path $targetDir $image
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $targetPath -Force
        Write-Host "✓ Copied: $image" -ForegroundColor Green
        $copied++
    } else {
        Write-Host "✗ Missing: $image" -ForegroundColor Yellow
        $missing++
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Copied: $copied" -ForegroundColor Green
Write-Host "Missing: $missing" -ForegroundColor Yellow
Write-Host ""

if ($copied -gt 0) {
    Write-Host "Success! Images have been copied." -ForegroundColor Green
    Write-Host "Refresh your browser to see the images in questions." -ForegroundColor Green
} else {
    Write-Host "No images were copied. Please check the source folder path." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
