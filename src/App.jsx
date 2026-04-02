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
    imageSrc,
    setFile,
    updateColors,
    updateWidth,
    updateCharset,
    updateEdge
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
          onColorChange={updateColors}
          onWidthChange={updateWidth}
          onCharsetChange={updateCharset}
          onEdgeChange={updateEdge}
        />

        <DropZone onFile={setFile} />
      </div>

      <div className="preview">
        <ImagePreview src={imageSrc} />
      </div>
    </div>
  );
}