import { useState, useRef } from "react";
import { generateASCII } from "../ascii/generateAscii";
import { applyTextOverlay } from "../overlay/applyTextOverlay";

export default function useAscii() {
  const [colors, setColors] = useState(4);
  const [width, setWidth] = useState(120);
  const [charset, setCharset] = useState("standard");
  const [edgeThreshold, setEdgeThreshold] = useState(100);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  const [overlays, setOverlays] = useState([]);

  const [imageSrc, setImageSrc] = useState(null);

  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const processImage = async (file, opts = {}) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const ascii = generateASCII(
        canvasRef.current,
        img,
        opts.width ?? width,
        opts.colors ?? colors,
        opts.charset ?? charset,
        opts.edgeThreshold ?? edgeThreshold,
        opts.brightness ?? brightness,
        opts.contrast ?? contrast
      );

      if (!ascii) return;

      let finalImage = ascii;

      const activeOverlays = opts.overlays ?? overlays;

      for (const overlay of activeOverlays) {
        if (!overlay.text) continue;

        finalImage = await applyTextOverlay(
          finalImage,
          overlay.text,
          overlay.position
        );
      }

      setImageSrc(finalImage);
    };
  };

  const setFile = (file) => {
    if (!file) return;
    fileRef.current = file;
    processImage(file);
  };

  const rerender = (changes) => {
    if (!fileRef.current) return;
    processImage(fileRef.current, changes);
  };

  const addOverlay = () => {
    const newOverlays = [
      ...overlays,
      { text: "", position: "center", expanded: true }
    ];
    setOverlays(newOverlays);
    rerender({ overlays: newOverlays });
  };

  const updateOverlay = (index, updated) => {
    const newOverlays = [...overlays];
    newOverlays[index] = updated;
    setOverlays(newOverlays);
    rerender({ overlays: newOverlays });
  };

  const removeOverlay = (index) => {
    const newOverlays = overlays.filter((_, i) => i !== index);
    setOverlays(newOverlays);
    rerender({ overlays: newOverlays });
  };

  const toggleOverlay = (index, expanded) => {
    const newOverlays = [...overlays];
    newOverlays[index] = {
      ...newOverlays[index],
      expanded
    };
    setOverlays(newOverlays);
  };

  return {
    colors,
    width,
    charset,
    edgeThreshold,
    brightness,
    contrast,
    overlays,
    imageSrc,
    canvasRef,
    setFile,

    updateColors: (v) => {
      setColors(v);
      rerender({ colors: v });
    },
    updateWidth: (v) => {
      setWidth(v);
      rerender({ width: v });
    },
    updateCharset: (v) => {
      setCharset(v);
      rerender({ charset: v });
    },
    updateEdge: (v) => {
      setEdgeThreshold(v);
      rerender({ edgeThreshold: v });
    },
    updateBrightness: (v) => {
      setBrightness(v);
      rerender({ brightness: v });
    },
    updateContrast: (v) => {
      setContrast(v);
      rerender({ contrast: v });
    },

    addOverlay,
    updateOverlay,
    removeOverlay,
    toggleOverlay
  };
}