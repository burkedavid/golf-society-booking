#!/bin/bash

# Script to generate app icons from the Irish Golf Society logo
# Requires ImageMagick to be installed

echo "🏌️ Generating app icons for Irish Golf Society Scotland..."

# Source image
SOURCE="public/image-640x886.png"

# Check if source exists
if [ ! -f "$SOURCE" ]; then
    echo "❌ Source image not found: $SOURCE"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install ImageMagick first."
    echo "   Windows: Download from https://imagemagick.org/script/download.php#windows"
    echo "   Mac: brew install imagemagick"
    echo "   Linux: sudo apt-get install imagemagick"
    exit 1
fi

echo "📱 Creating app icons..."

# Create favicon sizes
convert "$SOURCE" -resize 16x16 -background none -gravity center -extent 16x16 public/favicon-16x16.png
convert "$SOURCE" -resize 32x32 -background none -gravity center -extent 32x32 public/favicon-32x32.png

# Create Apple touch icon (square, 180x180)
convert "$SOURCE" -resize 180x180 -background none -gravity center -extent 180x180 public/apple-touch-icon.png

# Create Android icons (square)
convert "$SOURCE" -resize 192x192 -background none -gravity center -extent 192x192 public/icon-192x192.png
convert "$SOURCE" -resize 512x512 -background none -gravity center -extent 512x512 public/icon-512x512.png

# Create ICO favicon
convert public/favicon-32x32.png public/favicon-16x16.png public/favicon.ico

echo "✅ App icons generated successfully!"
echo ""
echo "📁 Generated files:"
echo "   - favicon-16x16.png"
echo "   - favicon-32x32.png" 
echo "   - apple-touch-icon.png"
echo "   - icon-192x192.png"
echo "   - icon-512x512.png"
echo "   - favicon.ico"
echo ""
echo "🚀 Deploy to Vercel and test 'Add to Home Screen' on your phone!" 