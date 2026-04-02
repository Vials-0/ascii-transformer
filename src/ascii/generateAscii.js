const ASCII_CHARS = "@%#*+=-:. ";
const EDGE_CHARS = "@#%";

const charWidth = 8;
const charHeight = 12;

function quantize(value, levels) {
  const step = 256 / levels;
  return Math.floor(value / step) * step;
}

function getBrightness(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function computeGrayscale(data, width, height) {
  const gray = new Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = getBrightness(
      data[idx],
      data[idx + 1],
      data[idx + 2]
    );
  }

  return gray;
}

function sobel(gray, width, height) {
  const edges = new Array(width * height).fill(0);

  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sumX = 0;
      let sumY = 0;

      let k = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const val = gray[(y + ky) * width + (x + kx)];
          sumX += val * gx[k];
          sumY += val * gy[k];
          k++;
        }
      }

      const magnitude = Math.sqrt(sumX * sumX + sumY * sumY);
      edges[y * width + x] = magnitude;
    }
  }

  return edges;
}

export function generateASCII(img, width, colors) {
  const aspect = img.height / img.width;
  const height = Math.floor(width * aspect);

  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  tempCanvas.width = width;
  tempCanvas.height = height;

  tctx.drawImage(img, 0, 0, width, height);

  const imageData = tctx.getImageData(0, 0, width, height).data;

  const gray = computeGrayscale(imageData, width, height);
  const edges = sobel(gray, width, height);

  const aspectCorrection = charHeight / charWidth;

  const canvas = document.createElement("canvas");
  canvas.width = width * charWidth;
  canvas.height = height * charHeight / aspectCorrection;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${charHeight}px monospace`;
  ctx.textBaseline = "top";

  const edgeThreshold = 80;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      let r = imageData[idx];
      let g = imageData[idx + 1];
      let b = imageData[idx + 2];

      r = quantize(r, colors);
      g = quantize(g, colors);
      b = quantize(b, colors);

      const brightness = getBrightness(r, g, b);
      const edgeVal = edges[y * width + x];

      let char;

      if (edgeVal > edgeThreshold) {
        const edgeIndex = Math.floor(
          (brightness / 255) * (EDGE_CHARS.length - 1)
        );
        char = EDGE_CHARS[edgeIndex];
      } else {
        const charIndex = Math.floor(
          (brightness / 255) * (ASCII_CHARS.length - 1)
        );
        char = ASCII_CHARS[charIndex];
      }

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      ctx.fillText(
        char,
        x * charWidth,
        y * (charHeight / aspectCorrection)
      );
    }
  }

  return canvas.toDataURL();
}