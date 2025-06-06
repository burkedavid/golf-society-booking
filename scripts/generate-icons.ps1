# PowerShell script to generate app icons from the Irish Golf Society logo
# Requires ImageMagick to be installed

Write-Host "🏌️ Generating app icons for Irish Golf Society Scotland..." -ForegroundColor Green

# Source image
$SOURCE = "public/image-640x886.png"

# Check if source exists
if (-not (Test-Path $SOURCE)) {
    Write-Host "❌ Source image not found: $SOURCE" -ForegroundColor Red
    exit 1
}

# Check if ImageMagick is installed
try {
    $null = Get-Command magick -ErrorAction Stop
    $convertCmd = "magick"
} catch {
    try {
        $null = Get-Command convert -ErrorAction Stop
        $convertCmd = "convert"
    } catch {
        Write-Host "❌ ImageMagick not found. Please install ImageMagick first." -ForegroundColor Red
        Write-Host "   Download from: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "📱 Creating app icons..." -ForegroundColor Cyan

# Create favicon sizes
& $convertCmd $SOURCE -resize 16x16 -background none -gravity center -extent 16x16 public/favicon-16x16.png
& $convertCmd $SOURCE -resize 32x32 -background none -gravity center -extent 32x32 public/favicon-32x32.png

# Create Apple touch icon (square, 180x180)
& $convertCmd $SOURCE -resize 180x180 -background none -gravity center -extent 180x180 public/apple-touch-icon.png

# Create Android icons (square)
& $convertCmd $SOURCE -resize 192x192 -background none -gravity center -extent 192x192 public/icon-192x192.png
& $convertCmd $SOURCE -resize 512x512 -background none -gravity center -extent 512x512 public/icon-512x512.png

# Create ICO favicon
& $convertCmd public/favicon-32x32.png public/favicon-16x16.png public/favicon.ico

Write-Host "✅ App icons generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Generated files:" -ForegroundColor Cyan
Write-Host "   - favicon-16x16.png"
Write-Host "   - favicon-32x32.png" 
Write-Host "   - apple-touch-icon.png"
Write-Host "   - icon-192x192.png"
Write-Host "   - icon-512x512.png"
Write-Host "   - favicon.ico"
Write-Host ""
Write-Host "🚀 Deploy to Vercel and test 'Add to Home Screen' on your phone!" -ForegroundColor Yellow 