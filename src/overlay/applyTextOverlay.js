export function applyTextOverlay(imageSrc, text, position, color = "#ffffff", scale = 1) {
    if (!text) return imageSrc;

    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const baseFontSize = Math.floor(canvas.width / 15);
            const fontSize = baseFontSize;
            const padding = 20 * scale;

            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillStyle = color;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.textBaseline = "top";

            let x = padding;
            let y = padding;

            const textWidth = ctx.measureText(text).width;

            if (position.includes("right")) {
                x = canvas.width - textWidth - padding;
            }

            if (position.includes("bottom")) {
                y = canvas.height - fontSize - padding;
            }

            if (position === "center") {
                x = (canvas.width - textWidth) / 2;
                y = (canvas.height - fontSize) / 2;
            }

            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);

            resolve(canvas.toDataURL());
        };
    });
}