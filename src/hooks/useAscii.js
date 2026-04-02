import { useState, useRef } from "react";
import { generateASCII } from "../ascii/generateAscii";

export default function useAscii() {
  const [colors, setColors] = useState(4);
  const [width, setWidth] = useState(120);
  const [imageSrc, setImageSrc] = useState(null);

  const fileRef = useRef(null);

  const processImage = (file, newColors = colors, newWidth = width) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const result = generateASCII(img, newWidth, newColors);
      setImageSrc(result);
    };
  };

  const setFile = (file) => {
    if (!file) return;
    fileRef.current = file;
    processImage(file);
  };

  const updateColors = (val) => {
    setColors(val);
    if (fileRef.current) processImage(fileRef.current, val, width);
  };

  const updateWidth = (val) => {
    setWidth(val);
    if (fileRef.current) processImage(fileRef.current, colors, val);
  };

  return {
    colors,
    width,
    imageSrc,
    setFile,
    updateColors,
    updateWidth
  };
}