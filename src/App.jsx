import useAscii from "./hooks/useAscii";
import Controls from "./components/Controls";
import DropZone from "./components/DropZone";
import ImagePreview from "./components/ImagePreview";

export default function App() {
  const {
    colors,
    width,
    charset,
    edgeThreshold,
    brightness,
    contrast,
    imageSrc,
    setFile,
    updateColors,
    updateWidth,
    updateCharset,
    updateEdge,
    updateBrightness,
    updateContrast
  } = useAscii();

  return (
    <div className="app layout">
      <div className="sidebar">
        <h1>ASCII Generator</h1>

        <Controls
          colors={colors}
          width={width}
          charset={charset}
          edgeThreshold={edgeThreshold}
          brightness={brightness}
          contrast={contrast}
          onColorChange={updateColors}
          onWidthChange={updateWidth}
          onCharsetChange={updateCharset}
          onEdgeChange={updateEdge}
          onBrightnessChange={updateBrightness}
          onContrastChange={updateContrast}
        />

        <DropZone onFile={setFile} />
      </div>

      <div className="preview">
        <ImagePreview src={imageSrc} />
      </div>
    </div>
  );
}