export default function AsciiDisplay({ ascii, mode, fontSize }) {
  if (!ascii) {
    return (
      <div className="ascii-display">
        <div className="empty-state">
          <p>Upload an image to see the ASCII art here</p>
        </div>
      </div>
    );
  }

  const style = { fontSize: `${fontSize}px` };

  return (
    <div className={`ascii-display ${mode === 'colored' ? 'colored' : ''}`}>
      {mode === 'colored' ? (
        <pre style={style} dangerouslySetInnerHTML={{ __html: ascii }} />
      ) : (
        <pre style={style}>{ascii}</pre>
      )}
    </div>
  );
}
