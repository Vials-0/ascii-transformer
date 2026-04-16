export default function TextOverlayControls({
    overlays,
    onAddOverlay,
    onUpdateOverlay,
    onRemoveOverlay,
    onToggleOverlay
}) {
    return (
        <div className="control-group">
            <div className="control-header">
                <span>Text Overlays</span>
                <button className="add-btn" onClick={onAddOverlay}>+</button>
            </div>

            {overlays.map((overlay, index) => (
                <div key={overlay.id} className="overlay-item">
                    {overlay.expanded ? (
                        <>
                            <textarea
                                className="text-area"
                                value={overlay.text}
                                placeholder="Enter text..."
                                onChange={(e) =>
                                    onUpdateOverlay(index, {
                                        ...overlay,
                                        text: e.target.value
                                    })
                                }
                            />

                            <div className="overlay-row">
                                <label className="color-label">Color</label>
                                <input
                                    type="color"
                                    value={overlay.color}
                                    className="color-picker"
                                    onChange={(e) =>
                                        onUpdateOverlay(index, {
                                            ...overlay,
                                            color: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="button-group">
                                {["top-left", "top-right", "bottom-left", "bottom-right", "center"].map(
                                    (pos) => (
                                        <button
                                            key={pos}
                                            className={`toggle-btn ${overlay.position === pos ? "active" : ""}`}
                                            onClick={() =>
                                                onUpdateOverlay(index, {
                                                    ...overlay,
                                                    position: pos
                                                })
                                            }
                                        >
                                            {pos}
                                        </button>
                                    )
                                )}
                            </div>

                            <div className="overlay-actions">
                                <button
                                    className="done-btn"
                                    onClick={() => onToggleOverlay(index, false)}
                                >
                                    Done
                                </button>

                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveOverlay(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="overlay-preview">
                            <span className="overlay-text">
                                {overlay.text || "Empty text"}
                            </span>

                            <div
                                className="color-indicator"
                                style={{ background: overlay.color }}
                            />

                            <div className="overlay-preview-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => onToggleOverlay(index, true)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveOverlay(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
