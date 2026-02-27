export default function Controls({
  mode,
  setMode,
  width,
  setWidth,
  maxWidth,
  zoom,
  setZoom,
  onZoomIn,
  onZoomOut,
  converting,
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
        <label>Resolution (Width: {width})</label>
        <div className="slider-container">
          <input
            type="range"
            min="100"
            max={maxWidth || 1920}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="control-group">
        <label>Zoom</label>
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={onZoomOut}>−</button>
          <span className="zoom-level">{zoom}%</span>
          <button className="zoom-btn" onClick={onZoomIn}>+</button>
        </div>
      </div>

      <div className="action-buttons">
        {converting && (
          <button className="btn primary" disabled>
            ⏳ Converting...
          </button>
        )}
        <button
          className="btn"
          onClick={onCopy}
          disabled={!hasResult || converting}
        >
          📋 {copySuccess ? 'Copied!' : 'Copy'}
        </button>
        <button
          className="btn"
          onClick={onDownloadTxt}
          disabled={!hasResult || converting}
        >
          📄 .txt
        </button>
        <button
          className="btn"
          onClick={onDownloadHtml}
          disabled={!hasResult || converting}
        >
          🌈 .html
        </button>
      </div>
    </div>
  );
}
