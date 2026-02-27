import { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AsciiInput from './components/AsciiInput';
import Controls from './components/Controls';
import AsciiDisplay from './components/AsciiDisplay';
import ImagePreview from './components/ImagePreview';
import {
  convertToMonochrome,
  convertToColored,
  generateHtmlContent,
  calculateOutputWidth,
  getFilename,
  asciiToImage,
  getImageFilename
} from './utils/asciiConverter';

export default function App() {
  const [appMode, setAppMode] = useState('imageToAscii');
  const [imageData, setImageData] = useState(null);
  const [asciiText, setAsciiText] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [mode, setMode] = useState('colored');
  const [width, setWidth] = useState(100);
  const [fontSize, setFontSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const [monochromeAscii, setMonochromeAscii] = useState('');
  const [coloredAscii, setColoredAscii] = useState('');

  useEffect(() => {
    if (imageData?.pixels) {
      const outputWidth = calculateOutputWidth(imageData.originalWidth);
      setWidth(outputWidth);
    }
  }, [imageData]);

  useEffect(() => {
    if (imageData?.pixels && width) {
      const mono = convertToMonochrome(imageData.pixels, width);
      const color = convertToColored(imageData.pixels, width);
      setMonochromeAscii(mono);
      setColoredAscii(color);
    }
  }, [imageData, width]);

  useEffect(() => {
    if (asciiText && width) {
      const img = asciiToImage(asciiText, width, fontSize * 2);
      setGeneratedImage(img);
    } else {
      setGeneratedImage(null);
    }
  }, [asciiText, width, fontSize]);

  const handleImageProcessed = (data) => {
    setImageData(data);
    setError(null);
  };

  const currentAscii = mode === 'colored' ? coloredAscii : monochromeAscii;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(monochromeAscii);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = monochromeAscii;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([monochromeAscii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFilename('txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateHtmlContent(coloredAscii);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFilename('html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = (extension) => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = getImageFilename(extension);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="app">
      <Header />
      
      <div className="mode-selector">
        <button
          className={appMode === 'imageToAscii' ? 'active' : ''}
          onClick={() => setAppMode('imageToAscii')}
        >
          Image → ASCII
        </button>
        <button
          className={appMode === 'asciiToImage' ? 'active' : ''}
          onClick={() => setAppMode('asciiToImage')}
        >
          ASCII → Image
        </button>
      </div>

      {appMode === 'imageToAscii' ? (
        <>
          <ImageUpload
            onImageProcessed={handleImageProcessed}
            loading={loading}
            error={error}
          />
          <Controls
            mode={mode}
            setMode={setMode}
            width={width}
            setWidth={setWidth}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onCopy={handleCopy}
            onDownloadTxt={handleDownloadTxt}
            onDownloadHtml={handleDownloadHtml}
            hasResult={!!monochromeAscii}
            copySuccess={copySuccess}
            appMode={appMode}
          />
          <AsciiDisplay ascii={currentAscii} mode={mode} fontSize={fontSize} />
        </>
      ) : (
        <>
          <AsciiInput
            value={asciiText}
            onChange={setAsciiText}
            placeholder="Paste ASCII art here (uses 256-level grayscale characters)"
          />
          <div className="controls-section">
            <div className="control-group">
              <label>Output Width</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="100"
                  max="800"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
                <span>{width}px</span>
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
                className="btn primary"
                onClick={() => handleDownloadImage('png')}
                disabled={!generatedImage}
              >
                📥 Download PNG
              </button>
              <button
                className="btn"
                onClick={() => handleDownloadImage('jpg')}
                disabled={!generatedImage}
              >
                📥 Download JPG
              </button>
            </div>
          </div>
          <ImagePreview imageData={generatedImage} />
        </>
      )}
    </div>
  );
}
