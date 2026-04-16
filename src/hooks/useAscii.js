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
    const [scale, setScale] = useState(1);

    const [overlays, setOverlays] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);

    const fileRef = useRef(null);
    const canvasRef = useRef(null);
    const debounceRef = useRef(null);

    const processImage = async (file, opts = {}) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        img.onload = async () => {
            URL.revokeObjectURL(objectUrl);

            const ascii = generateASCII(
                canvasRef.current,
                img,
                opts.width ?? width,
                opts.colors ?? colors,
                opts.charset ?? charset,
                opts.edgeThreshold ?? edgeThreshold,
                opts.brightness ?? brightness,
                opts.contrast ?? contrast,
                opts.scale ?? scale
            );

            if (!ascii) return;

            let finalImage = ascii;

            const activeOverlays = opts.overlays ?? overlays;

            for (const overlay of activeOverlays) {
                if (!overlay.text) continue;

                finalImage = await applyTextOverlay(
                    finalImage,
                    overlay.text,
                    overlay.position,
                    overlay.color,
                    opts.scale ?? scale
                );
            }

            setImageSrc(finalImage);
        };
    };

    const scheduleRender = (changes) => {
        if (!fileRef.current) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            processImage(fileRef.current, changes);
        }, 150);
    };

    const setFile = (file) => {
        if (!file) return;
        fileRef.current = file;
        processImage(file);
    };

    const updateColors = (v) => {
        setColors(v);
        scheduleRender({ colors: v });
    };

    const updateWidth = (v) => {
        setWidth(v);
        scheduleRender({ width: v });
    };

    const updateCharset = (v) => {
        setCharset(v);
        scheduleRender({ charset: v });
    };

    const updateEdge = (v) => {
        setEdgeThreshold(v);
        scheduleRender({ edgeThreshold: v });
    };

    const updateBrightness = (v) => {
        setBrightness(v);
        scheduleRender({ brightness: v });
    };

    const updateContrast = (v) => {
        setContrast(v);
        scheduleRender({ contrast: v });
    };

    const updateScale = (v) => {
        setScale(v);
        scheduleRender({ scale: v });
    };

    const addOverlay = () => {
        const newOverlays = [
            ...overlays,
            { id: Date.now(), text: "", position: "center", color: "#ffffff", expanded: true }
        ];
        setOverlays(newOverlays);
        scheduleRender({ overlays: newOverlays });
    };

    const updateOverlay = (index, updated) => {
        const newOverlays = [...overlays];
        newOverlays[index] = updated;
        setOverlays(newOverlays);
        scheduleRender({ overlays: newOverlays });
    };

    const removeOverlay = (index) => {
        const newOverlays = overlays.filter((_, i) => i !== index);
        setOverlays(newOverlays);
        scheduleRender({ overlays: newOverlays });
    };

    const saveImage = async () => {
        if (!imageSrc) return;

        const original = fileRef.current.name.replace(/\.[^.]+$/, "");
        const suggestedName = `${original}-ascii.png`;

        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName,
                    types: [{ description: "PNG Image", accept: { "image/png": [".png"] } }]
                });
                const blob = await (await fetch(imageSrc)).blob();
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
            } catch (err) {
                if (err.name !== "AbortError") console.error("Failed to save image:", err);
            }
        } else {
            const a = document.createElement("a");
            a.href = imageSrc;
            a.download = suggestedName;
            a.click();
        }
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
        scale,
        overlays,
        imageSrc,
        canvasRef,
        setFile,
        saveImage,
        updateColors,
        updateWidth,
        updateCharset,
        updateEdge,
        updateBrightness,
        updateContrast,
        updateScale,
        addOverlay,
        updateOverlay,
        removeOverlay,
        toggleOverlay
    };
}
