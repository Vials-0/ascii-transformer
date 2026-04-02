export default function Controls({
    colors,
    width,
    onColorChange,
    onWidthChange
}) {
    return (
        <div className="controls">
            <div>
                <label>Color Levels: {colors}</label>
                <input
                    type="range"
                    min="2"
                    max="16"
                    value={colors}
                    onChange={(e) => onColorChange(parseInt(e.target.value))}
                />
            </div>

            <div>
                <label>Resolution: {width}</label>
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