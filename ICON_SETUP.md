# 📱 App Icon Setup Guide

## Icons Needed for Home Screen Installation

You need to create these icon sizes from your existing `image-640x886.png` logo:

### Required Icon Sizes:
1. **favicon-16x16.png** - 16x16 pixels (browser tab icon)
2. **favicon-32x32.png** - 32x32 pixels (browser tab icon)
3. **apple-touch-icon.png** - 180x180 pixels (iOS home screen)
4. **icon-192x192.png** - 192x192 pixels (Android home screen)
5. **icon-512x512.png** - 512x512 pixels (Android splash screen)

## How to Create These Icons:

### Option 1: Online Icon Generator (Easiest)
1. Go to **https://realfavicongenerator.net/**
2. Upload your `image-640x886.png` file
3. Follow the wizard to generate all sizes
4. Download the generated files
5. Replace the placeholder files in your `public` folder

### Option 2: Using Image Editing Software
1. Open `image-640x886.png` in Photoshop, GIMP, or similar
2. For each size needed:
   - Resize the image (keeping aspect ratio)
   - Crop to square if needed
   - Export as PNG
   - Save with the exact filename listed above

### Option 3: Using Online Resizer
1. Go to **https://www.iloveimg.com/resize-image**
2. Upload your logo
3. Resize to each required dimension
4. Download and rename files

## Important Notes:
- **Square Format**: Most icons should be square (1:1 ratio)
- **High Quality**: Use PNG format for transparency support
- **Clear Visibility**: Ensure the logo is clearly visible at small sizes
- **Consistent Branding**: Keep the same colors and design

## File Locations:
All icon files should be placed in the `public` folder:
```
public/
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── icon-192x192.png
├── icon-512x512.png
├── manifest.json (✅ already created)
└── image-640x886.png (✅ your original logo)
```

## Testing:
After creating the icons:
1. Deploy your app to Vercel
2. Open the app on your phone
3. Use "Add to Home Screen" (iOS) or "Install App" (Android)
4. Check that your custom icon appears on the home screen

## What This Enables:
- ✅ Custom app icon when saved to home screen
- ✅ Professional app appearance
- ✅ Better user experience
- ✅ PWA (Progressive Web App) capabilities
- ✅ Branded browser tabs

The Irish Golf Society logo will now appear as the app icon when users save your golf booking app to their phone's home screen! 