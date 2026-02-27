import { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function ImageUpload({ onImageProcessed, loading, error }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WebP image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/process-image`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        onImageProcessed(data.data);
      } else {
        alert(data.error || 'Failed to process image');
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="upload-section">
      <div
        className={`dropzone ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="icon">📁</div>
        <p>Drag and drop an image here, or click to select</p>
        <p style={{ fontSize: '12px', marginTop: '8px' }}>Supports: JPG, PNG, WebP (max 5MB)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading">Processing image...</p>}
    </div>
  );
}
