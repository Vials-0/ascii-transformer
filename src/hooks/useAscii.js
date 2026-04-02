import { useState, useRef } from "react";
import { generateASCII } from "../ascii/generateAscii";

export default function useAscii() {
  const [colors, setColors] = useState(4);
  const [width, setWidth] = useState(120);
  const [charset, setCharset] = useState("standard");
  const [edgeThreshold, setEdgeThreshold] = useState(80);
  const [imageSrc, setImageSrc] = useState(null);

  const fileRef = useRef(null);

  const processImage = (
    file,
    newColors = colors,
    newWidth = width,
    newCharset = charset,
    newEdge = edgeThreshold
  ) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const result = generateASCII(
        img,
        newWidth,
        newColors,
        newCharset,
        newEdge
      );
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
    if (fileRef.current)
      processImage(fileRef.current, val, width, charset, edgeThreshold);
  };

  const updateWidth = (val) => {
    setWidth(val);
    if (fileRef.current)
      processImage(fileRef.current, colors, val, charset, edgeThreshold);
  };

  const updateCharset = (val) => {
    setCharset(val);
    if (fileRef.current)
      processImage(fileRef.current, colors, width, val, edgeThreshold);
  };

  const updateEdge = (val) => {
    setEdgeThreshold(val);
    if (fileRef.current)
      processImage(fileRef.current, colors, width, charset, val);
  };

  return {
    colors,
    width,
    charset,
    edgeThreshold,
    imageSrc,
    setFile,
    updateColors,
    updateWidth,
    updateCharset,
    updateEdge
  };
}