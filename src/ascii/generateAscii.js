const CHARSETS = {
    standard: "@%#*+=-:. ",
    dense: "@$B%8&WM#*oahkbdpqwmZ0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
    blocks: "█▓▒░ ",
    minimal: "@#:. "
};

const EDGE_CHARS = "@#%*+=";

const DIRECTIONAL_SETS = {
    horizontal: ["@", "=", "-"],
    vertical: ["@", "|", "!"],
    diag1: ["@", "/", "x"],
    diag2: ["@", "\\", "x"],
    corner: ["@", "+", "*"]
};

const charWidth = 8;
const charHeight = 12;

function quantize(value, levels) {
    const step = 256 / levels;
    return Math.floor(value / step) * step;
}

function getBrightness(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function computeGrayscale(data, width, height) {
    const gray = new Array(width * height);
    for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        gray[i] = getBrightness(data[idx], data[idx + 1], data[idx + 2]);
    }
    return gray;
}

function sobel(gray, width, height) {
    const edges = new Array(width * height).fill(0);
    const angles = new Array(width * height).fill(0);

    const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let sumX = 0;
            let sumY = 0;

            let k = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const val = gray[(y + ky) * width + (x + kx)];
                    sumX += val * gx[k];
                    sumY += val * gy[k];
                    k++;
                }
            }

            const index = y * width + x;
            edges[index] = Math.sqrt(sumX * sumX + sumY * sumY);
            angles[index] = Math.atan2(sumY, sumX);
        }
    }

    return { edges, angles };
}

function safeChar(str, index) {
    if (!str || str.length === 0) return "@";
    if (!Number.isFinite(index)) return str[0];
    return str[Math.max(0, Math.min(str.length - 1, index))];
}

function pickFromSet(set, brightness) {
    if (brightness < 40) return "@";
    const index = Math.floor((brightness / 255) * (set.length - 1));
    return safeChar(set, index);
}

function getDirectionalChar(angle, brightness) {
    const deg = angle * (180 / Math.PI);

    if (deg > -22.5 && deg <= 22.5) return pickFromSet(DIRECTIONAL_SETS.horizontal, brightness);
    if (deg > 22.5 && deg <= 67.5) return pickFromSet(DIRECTIONAL_SETS.diag1, brightness);
    if (deg > 67.5 || deg <= -67.5) return pickFromSet(DIRECTIONAL_SETS.vertical, brightness);
    if (deg > -67.5 && deg <= -22.5) return pickFromSet(DIRECTIONAL_SETS.diag2, brightness);

    return pickFromSet(DIRECTIONAL_SETS.corner, brightness);
}

export function generateASCII(
    canvas,
    img,
    width,
    colors,
    charsetKey,
    edgeThreshold,
    brightnessAdjust,
    contrastAdjust,
    scale = 1
) {
    if (!canvas || !img || !img.width || !img.height) return null;

    const ASCII_CHARS = CHARSETS[charsetKey] || CHARSETS.standard;

    const safeWidth = Math.max(1, Number(width) || 100);
    const aspect = img.height / img.width || 1;
    const height = Math.max(1, Math.floor(safeWidth * aspect));

    const tempCanvas = document.createElement("canvas");
    const tctx = tempCanvas.getContext("2d");

    tempCanvas.width = safeWidth;
    tempCanvas.height = height;

    tctx.drawImage(img, 0, 0, safeWidth, height);

    const imageData = tctx.getImageData(0, 0, safeWidth, height).data;

    const gray = computeGrayscale(imageData, safeWidth, height);
    const { edges, angles } = sobel(gray, safeWidth, height);

    const aspectCorrection = charHeight / charWidth;

    const baseWidth = safeWidth * charWidth;
    const baseHeight = height * charHeight / aspectCorrection;

    const renderCanvas = document.createElement("canvas");
    const rctx = renderCanvas.getContext("2d");

    renderCanvas.width = baseWidth;
    renderCanvas.height = baseHeight;

    rctx.fillStyle = "black";
    rctx.fillRect(0, 0, baseWidth, baseHeight);

    rctx.font = `${charHeight}px monospace`;
    rctx.textBaseline = "top";

    const strongEdgeThreshold = edgeThreshold * 1.8;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < safeWidth; x++) {
            const idx = (y * safeWidth + x) * 4;

            let r = imageData[idx];
            let g = imageData[idx + 1];
            let b = imageData[idx + 2];

            r = quantize(r, colors);
            g = quantize(g, colors);
            b = quantize(b, colors);

            r = Math.min(255, Math.max(0, r + brightnessAdjust));
            g = Math.min(255, Math.max(0, g + brightnessAdjust));
            b = Math.min(255, Math.max(0, b + brightnessAdjust));

            r = ((r - 128) * (1 + contrastAdjust / 100)) + 128;
            g = ((g - 128) * (1 + contrastAdjust / 100)) + 128;
            b = ((b - 128) * (1 + contrastAdjust / 100)) + 128;

            const brightness = getBrightness(r, g, b);

            let char;

            if (brightness < 30) {
                char = "@";
            } else {
                const edgeVal = edges[y * safeWidth + x];
                const angle = angles[y * safeWidth + x];

                if (edgeVal > strongEdgeThreshold) {
                    char = getDirectionalChar(angle, brightness);
                } else if (edgeVal > edgeThreshold) {
                    const edgeIndex = Math.floor((brightness / 255) * (EDGE_CHARS.length - 1));
                    char = safeChar(EDGE_CHARS, edgeIndex);
                } else {
                    const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
                    char = safeChar(ASCII_CHARS, charIndex);
                }
            }

            if (!char) char = "@";

            rctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

            rctx.fillText(
                char,
                x * charWidth,
                y * (charHeight / aspectCorrection)
            );
        }
    }

    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        renderCanvas,
        0,
        0,
        baseWidth,
        baseHeight,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas.toDataURL();
}