import { useState, useRef } from "react";

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

export default function App() {
  const [colors, setColors] = useState(4);
  const [width, setWidth] = useState(120);
  const [imageSrc, setImageSrc] = useState(null);

  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const processImage = (file) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const aspect = img.height / img.width;
      const height = Math.floor(width * aspect);

      const tempCanvas = document.createElement("canvas");
      const tctx = tempCanvas.getContext("2d");

      tempCanvas.width = width;
      tempCanvas.height = height;

      tctx.drawImage(img, 0, 0, width, height);

      const imageData = tctx.getImageData(0, 0, width, height).data;

      const aspectCorrection = charHeight / charWidth;

      const canvas = canvasRef.current;
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

      setImageSrc(canvas.toDataURL());
    };
  };

  const handleFile = (file) => {
    if (!file) return;
    processImage(file);
  };

  return (
    <div className="app">
      <h1>ASCII Generator</h1>

      <div className="controls">
        <div>
          <label>Color Levels: {colors}</label>
          <input
            type="range"
            min="2"
            max="16"
            value={colors}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setColors(val);
              if (fileRef.current) processImage(fileRef.current);
            }}
          />
        </div>

        <div>
          <label>Resolution: {width}</label>
          <input
            type="range"
            min="50"
            max="300"
            value={width}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setWidth(val);
              if (fileRef.current) processImage(fileRef.current);
            }}
          />
        </div>
      </div>

      <div
        className="drop"
        onClick={() => document.getElementById("fileInput").click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          fileRef.current = file;
          handleFile(file);
        }}
      >
        Drop image or click
      </div>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          fileRef.current = file;
          handleFile(file);
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {imageSrc && <img src={imageSrc} alt="result" />}
    </div>
  );
}