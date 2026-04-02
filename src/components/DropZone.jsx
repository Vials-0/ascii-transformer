export default function DropZone({ onFile }) {
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        onFile(file);
    };

    return (
        <div
            className="drop"
            onClick={() => document.getElementById("fileInput").click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            Drop image or click
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onFile(e.target.files[0])}
            />
        </div>
    );
}