import { useState, useRef } from 'react';

export default function AsciiInput({ value, onChange, placeholder }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.asc')) {
        try {
          const text = await file.text();
          onChange(text);
        } catch (err) {
          console.error('Failed to read file:', err);
        }
      }
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      try {
        const text = await file.text();
        onChange(text);
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    }
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.asc,text/plain';
    input.onchange = handleFileSelect;
    input.click();
  };

  return (
    <div className="ascii-input-section">
      <label className="input-label">
        Paste ASCII Art or Drop a Text File
        <button 
          type="button" 
          className="file-btn"
          onClick={handleClick}
        >
          📂 Load from file
        </button>
      </label>
      <div
        className={`ascii-dropzone ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          ref={textareaRef}
          className="ascii-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Paste your ASCII art here..."}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
