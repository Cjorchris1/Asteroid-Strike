# Game Icons Directory

This directory contains all the game icons and UI elements.

## Directory Structure

```
icons/
├── game/              # In-game UI icons
│   ├── pause.png     # Pause button icon
│   ├── resume.png    # Resume button icon
│   ├── sound-on.png  # Sound on icon
│   └── sound-off.png # Sound off icon
├── menu/              # Menu UI icons
│   ├── play.png      # Play button icon
│   ├── share.png     # Share button icon
│   └── rate.png      # Rate button icon
└── app/               # App icons
    ├── icon.png              # Main app icon (1024x1024)
    ├── icon@2x.png          # High-res app icon
    ├── icon@3x.png          # Extra high-res app icon
    ├── adaptive-icon.png    # Android adaptive icon
    └── favicon.png          # Web favicon
```

## Icon Specifications

### App Icons
- Main app icon (icon.png): 1024x1024 px, PNG format
- High-res variants: Use @2x and @3x suffixes
- Android adaptive icon: 108x108 dp foreground layer
- Favicon: 32x32 px

### Game UI Icons
- Recommended size: 64x64 px
- Format: PNG with transparency
- Style: Consistent with game theme

### Menu Icons
- Recommended size: 48x48 px
- Format: PNG with transparency
- Style: Match menu theme

## Adding New Icons

1. Choose the appropriate subdirectory (game/, menu/, or app/)
2. Name your icon descriptively
3. Ensure it matches the size specifications
4. Use PNG format with transparency where needed
5. Update this README if adding new categories

## Usage in Code

```typescript
// Example of loading an icon
const iconSource = new ImageSource("~/assets/icons/game/pause.png");
```