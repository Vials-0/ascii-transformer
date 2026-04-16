const CHARSET_OPTIONS = [
    { key: "standard", label: "Standard" },
    { key: "dense", label: "Dense" },
    { key: "minimal", label: "Minimal" },
    { key: "blocks", label: "Blocks" }
];

export default function Controls({
    colors,
    width,
    charset,
    edgeThreshold,
    brightness,
    contrast,
    scale,
    onColorChange,
    onWidthChange,
    onCharsetChange,
    onEdgeChange,
    onBrightnessChange,
    onContrastChange,
    onScaleChange
}) {
    return (
        <div className="controls">
            <div className="control-group">
                <div className="control-header">
                    <span>Character Set</span>
                </div>
                <div className="button-group">
                    {CHARSET_OPTIONS.map((opt) => (
                        <button
                            key={opt.key}
                            className={`toggle-btn ${charset === opt.key ? "active" : ""}`}
                            onClick={() => onCharsetChange(opt.key)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="control-group">
                <div className="control-header">
                    <span>Edge Sensitivity</span>
                    <span className="value">{edgeThreshold}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="200"
                    value={edgeThreshold}
                    onChange={(e) => onEdgeChange(parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <div className="control-header">
                    <span>Brightness</span>
                    <span className="value">{brightness}</span>
                </div>
                <input
                    type="range"
                    min="-100"
                    max="100"
                    value={brightness}
                    onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <div className="control-header">
                    <span>Contrast</span>
                    <span className="value">{contrast}</span>
                </div>
                <input
                    type="range"
                    min="-100"
                    max="100"
                    value={contrast}
                    onChange={(e) => onContrastChange(parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <div className="control-header">
                    <span>Color Levels</span>
                    <span className="value">{colors}</span>
                </div>
                <input
                    type="range"
                    min="2"
                    max="16"
                    value={colors}
                    onChange={(e) => onColorChange(parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <div className="control-header">
                    <span>Resolution</span>
                    <span className="value">{width}</span>
                </div>
                <input
                    type="range"
                    min="50"
                    max="300"
                    value={width}
                    onChange={(e) => onWidthChange(parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <div className="control-header">
                    <span>Scale</span>
                    <span className="value">{scale}x</span>
                </div>
                <div className="button-group">
                    {[1, 2, 3, 4].map((s) => (
                        <button
                            key={s}
                            className={`toggle-btn ${scale === s ? "active" : ""}`}
                            onClick={() => onScaleChange(s)}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
