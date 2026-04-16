# ASCII Art Generator

A browser-based tool that converts images into colored ASCII art. Upload any image and tune the output using a set of real-time controls.

## Features

### Image Input
Drop an image file onto the drop zone or click it to open a file picker. The output updates automatically whenever a new image is loaded or a control is changed.

### Character Sets
Choose how image regions are mapped to characters:

| Set | Characters used |
|---|---|
| **Standard** | `@%#*+=-:. ` |
| **Dense** | A wide range of characters for fine tonal gradation |
| **Minimal** | `@#:. ` — high contrast, sparse feel |
| **Blocks** | `█▓▒░ ` — solid block characters for a pixelated look |

### Edge Detection
The generator uses a Sobel operator to detect edges in the image and replace them with directional characters (`|`, `-`, `/`, `\`, `+`, etc.) that follow the edge's angle. The **Edge Sensitivity** slider controls how aggressively edges are detected — lower values produce more edge characters, higher values suppress them.

### Image Adjustments
- **Brightness** — shifts all pixel values lighter or darker before rendering
- **Contrast** — expands or compresses the tonal range around mid-grey
- **Color Levels** — quantizes the color palette from 2 to 16 levels, giving a posterized or full-color result

### Resolution
Controls how many character columns wide the output is (50–300). Higher values produce more detail; lower values give a coarser, more abstract look.

### Scale
Upscales the final rendered image by 1×, 2×, 3×, or 4× using nearest-neighbor scaling to keep characters sharp.

### Text Overlays
Add one or more text labels burned directly into the output image. Each overlay has:
- **Text content** — multi-line text input
- **Color** — a color picker for the text color
- **Position** — top-left, top-right, bottom-left, bottom-right, or center

Overlays can be collapsed to a preview row and re-edited or removed at any time.

## Tech Stack

- [React](https://react.dev) — UI and state management
- [Vite](https://vitejs.dev) — development server and build tool
- Canvas API — image processing and ASCII rendering

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```

The production output is written to `dist/`.
