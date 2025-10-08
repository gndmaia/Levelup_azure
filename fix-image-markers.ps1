# Fix Image Markers Script
# Run this AFTER you've copied images to public/question-images/

Write-Host "=== Image Marker Fix Script ===" -ForegroundColor Cyan
Write-Host ""

# Backup first
$backupFile = "lib\seed-data-backup-before-image-fix-$(Get-Date -Format 'yyyyMMdd-HHmmss').ts"
Copy-Item "lib\seed-data.ts" $backupFile
Write-Host "Created backup: $backupFile" -ForegroundColor Green
Write-Host ""

# Read the file with proper encoding
$content = Get-Content "lib\seed-data.ts" -Raw -Encoding UTF8

# Find all image markers
$imageMatches = [regex]::Matches($content, '\[Image: ([^\]]+)\]')
$beforeCount = $imageMatches.Count
Write-Host "Found $beforeCount image markers to fix" -ForegroundColor Yellow
Write-Host ""

if ($beforeCount -gt 0) {
    Write-Host "Image files referenced:" -ForegroundColor Cyan
    foreach ($match in $imageMatches) {
        $filename = $match.Groups[1].Value
        Write-Host "  - $filename" -ForegroundColor White
    }
    Write-Host ""
}

# Fix the image markers - convert [Image: filename] to [IMAGE: /question-images/filename]
$updated = $content -replace '\[Image: ([a-zA-Z0-9\-\.]+)\]', '[IMAGE: /question-images/$1]'

# Count updated markers  
$afterCount = ([regex]::Matches($updated, '\[IMAGE: /question-images/[^\]]+\]')).Count

# Check for any images that weren't converted (invalid format)
$remainingOldFormat = ([regex]::Matches($updated, '\[Image: ([^\]]+)\]')).Count
if ($remainingOldFormat -gt 0) {
    Write-Host "WARNING: $remainingOldFormat image markers were skipped (unsupported filename format)" -ForegroundColor Red
    $skippedMatches = [regex]::Matches($updated, '\[Image: ([^\]]+)\]')
    Write-Host "Skipped images:" -ForegroundColor Yellow
    foreach ($match in $skippedMatches) {
        $filename = $match.Groups[1].Value
        Write-Host "  - $filename" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Save with UTF8 encoding without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\lib\seed-data.ts", $updated, $utf8NoBom)

Write-Host ""
Write-Host "=== Results ===" -ForegroundColor Cyan
Write-Host "Fixed $afterCount image markers" -ForegroundColor Green
Write-Host "Format: [IMAGE: /question-images/filename]" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure images are copied to public/question-images/" -ForegroundColor White
Write-Host "2. Refresh your browser to see images in questions" -ForegroundColor White
Write-Host ""
