export default function ImagePreview({ imageData, mode }) {
  if (!imageData) {
    return (
      <div className="image-preview empty-state">
        <p>Generated image will appear here</p>
      </div>
    );
  }

  return (
    <div className="image-preview">
      <img src={imageData} alt="Generated from ASCII" />
    </div>
  );
}
