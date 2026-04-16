import { useRef } from "react";

export default function DropZone({ onFile }) {
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        onFile(file);
    };

    return (
        <div
            className="drop"
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            Drop image or click
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onFile(e.target.files[0])}
            />
        </div>
    );
}
