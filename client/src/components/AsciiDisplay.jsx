export default function AsciiDisplay({ ascii, mode, zoom = 100 }) {
  if (!ascii) {
    return (
      <div className="ascii-display">
        <div className="empty-state">
          <p>Upload an image to see the ASCII art here</p>
        </div>
      </div>
    );
  }

  const scale = zoom / 100;
  const style = { 
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    fontSize: '6px',
    lineHeight: 1,
    whiteSpace: 'pre'
  };

  const containerStyle = {
    overflow: 'auto',
    maxHeight: 'calc(100vh - 400px)',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`
  };

  return (
    <div className="ascii-display">
      <div style={containerStyle}>
        {mode === 'colored' ? (
          <pre style={style} dangerouslySetInnerHTML={{ __html: ascii }} />
        ) : (
          <pre style={style}>{ascii}</pre>
        )}
      </div>
    </div>
  );
}
