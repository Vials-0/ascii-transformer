export default function Controls({
    colors,
    width,
    onColorChange,
    onWidthChange
}) {
    return (
        <div className="controls">
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
        </div>
    );
}