import useAscii from "./hooks/useAscii";
import Controls from "./components/Controls";
import DropZone from "./components/DropZone";
import ImagePreview from "./components/ImagePreview";

export default function App() {
  const {
    colors,
    width,
    imageSrc,
    canvasRef,
    setFile,
    updateColors,
    updateWidth
  } = useAscii();

  return (
    <div className="app">
      <h1>ASCII Generator</h1>
      <Controls
        colors={colors}
        width={width}
        onColorChange={updateColors}
        onWidthChange={updateWidth}
      />
      <DropZone onFile={setFile} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <ImagePreview src={imageSrc} />
    </div>
  );
}