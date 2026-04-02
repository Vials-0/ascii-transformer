const ASCII_CHARS = "@%#*+=-:. ";

const charWidth = 8;
const charHeight = 12;

function quantize(value, levels) {
  const step = 256 / levels;
  return Math.floor(value / step) * step;
}

function getBrightness(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function generateASCII(canvas, img, width, colors) {
  const aspect = img.height / img.width;
  const height = Math.floor(width * aspect);

  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  tempCanvas.width = width;
  tempCanvas.height = height;

  tctx.drawImage(img, 0, 0, width, height);

  const imageData = tctx.getImageData(0, 0, width, height).data;

  const aspectCorrection = charHeight / charWidth;

  canvas.width = width * charWidth;
  canvas.height = height * charHeight / aspectCorrection;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${charHeight}px monospace`;
  ctx.textBaseline = "top";

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

      const charIndex = Math.floor(
        (brightness / 255) * (ASCII_CHARS.length - 1)
      );

      const char = ASCII_CHARS[charIndex];

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