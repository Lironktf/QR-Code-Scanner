# PWA Icons Setup

The app requires two icon files for Progressive Web App functionality:

## Required Icons

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

## How to Create Icons

### Option 1: Use RealFaviconGenerator (Recommended)

1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload your logo or design
3. Configure settings for Android/iOS
4. Generate and download
5. Place `icon-192.png` and `icon-512.png` in `frontend/public/`

### Option 2: Use Figma/Canva

1. Create a 512x512 design
2. Export as PNG (512x512)
3. Resize to 192x192 for the smaller version
4. Save both files in `frontend/public/`

### Option 3: Quick Placeholder

For testing purposes, you can use a simple colored square:

1. Use any image editor
2. Create 512x512 solid color image with your app initials "QR"
3. Create 192x192 version
4. Save in `frontend/public/`

## Design Tips

- Use simple, recognizable design
- Ensure good contrast
- Avoid thin lines (may not scale well)
- Consider rounded corners
- Test on both light and dark backgrounds

## Current Status

The placeholder files are currently text files. Replace them with actual PNG images before deploying to production.
