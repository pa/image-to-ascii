export default function Controls({
  mode,
  setMode,
  width,
  setWidth,
  fontSize,
  setFontSize,
  onCopy,
  onDownloadTxt,
  onDownloadHtml,
  hasResult,
  copySuccess
}) {
  return (
    <div className="controls-section">
      <div className="control-group">
        <label>Mode</label>
        <div className="mode-toggle">
          <button
            className={mode === 'monochrome' ? 'active' : ''}
            onClick={() => setMode('monochrome')}
          >
            Monochrome
          </button>
          <button
            className={mode === 'colored' ? 'active' : ''}
            onClick={() => setMode('colored')}
          >
            Colored
          </button>
        </div>
      </div>

      <div className="control-group">
        <label>Resolution (Width)</label>
        <div className="slider-container">
          <input
            type="range"
            min="50"
            max="300"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
          <span>{width}</span>
        </div>
      </div>

      <div className="control-group">
        <label>Font Size</label>
        <div className="slider-container">
          <input
            type="range"
            min="4"
            max="16"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
          <span>{fontSize}px</span>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn"
          onClick={onCopy}
          disabled={!hasResult}
        >
          📋 {copySuccess ? 'Copied!' : 'Copy'}
        </button>
        <button
          className="btn"
          onClick={onDownloadTxt}
          disabled={!hasResult}
        >
          📄 Download .txt
        </button>
        <button
          className="btn"
          onClick={onDownloadHtml}
          disabled={!hasResult}
        >
          🌈 Download .html
        </button>
      </div>
    </div>
  );
}
