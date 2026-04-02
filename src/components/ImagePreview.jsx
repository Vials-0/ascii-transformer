export default function ImagePreview({ src }) {
    if (!src) return null;
    return <img src={src} alt="result" />;
}