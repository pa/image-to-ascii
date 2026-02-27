export default function ProgressBar({ progress, converting }) {
  if (!converting && progress === 0) {
    return null;
  }

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>Converting to ASCII...</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
