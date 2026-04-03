import useAscii from "./hooks/useAscii";
import Controls from "./components/Controls";
import DropZone from "./components/DropZone";
import ImagePreview from "./components/ImagePreview";
import TextOverlayControls from "./components/TextOverlayControls";

export default function App() {
  const {
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
    updateColors,
    updateWidth,
    updateCharset,
    updateEdge,
    updateBrightness,
    updateContrast,
    addOverlay,
    updateOverlay,
    removeOverlay,
    toggleOverlay
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

        <TextOverlayControls
          overlays={overlays}
          onAddOverlay={addOverlay}
          onUpdateOverlay={updateOverlay}
          onRemoveOverlay={removeOverlay}
          onToggleOverlay={toggleOverlay}
        />

        <DropZone onFile={setFile} />
      </div>

      <div className="preview">
        <ImagePreview src={imageSrc} />
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}