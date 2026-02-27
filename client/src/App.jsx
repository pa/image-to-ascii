import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AsciiInput from './components/AsciiInput';
import Controls from './components/Controls';
import AsciiDisplay from './components/AsciiDisplay';
import ImagePreview from './components/ImagePreview';
import ProgressBar from './components/ProgressBar';
import {
  generateHtmlContent,
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
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [monochromeAscii, setMonochromeAscii] = useState('');
  const [coloredAscii, setColoredAscii] = useState('');
  const workerRef = useRef(null);
  const debounceRef = useRef(null);

  const runConversion = useCallback((pixels, outputWidth) => {
    if (!pixels || !outputWidth) return;
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setConverting(true);
      setProgress(0);
      
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      
      workerRef.current = new Worker(
        new URL('./workers/asciiWorker.js', import.meta.url),
        { type: 'module' }
      );
      
      workerRef.current.onmessage = (e) => {
        if (e.data.type === 'progress') {
          setProgress(e.data.progress);
        } else if (e.data.type === 'complete') {
          setMonochromeAscii(e.data.monochrome);
          setColoredAscii(e.data.colored);
          setConverting(false);
          setProgress(100);
        } else if (e.data.error) {
          setConverting(false);
          setError(e.data.error);
        }
      };
      
      const safeWidth = Math.min(outputWidth, pixels[0]?.length || outputWidth);
      workerRef.current.postMessage({ pixels, width: safeWidth, numWorkers: 4 });
    }, 300);
  }, []);

  useEffect(() => {
    if (imageData?.pixels) {
      setWidth(imageData.originalWidth);
    }
  }, [imageData]);

  useEffect(() => {
    if (showControls && imageData?.pixels && width) {
      runConversion(imageData.pixels, width);
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [showControls, imageData, width, runConversion]);

  useEffect(() => {
    if (asciiText && width) {
      const img = asciiToImage(asciiText, width, 10);
      setGeneratedImage(img);
    } else {
      setGeneratedImage(null);
    }
  }, [asciiText, width]);

  const handleImageProcessed = (data) => {
    setImageData(data);
    setShowControls(true);
    setError(null);
  };

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
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
          {showControls && imageData && (
            <>
              <ProgressBar progress={progress} converting={converting} />
              <Controls
                mode={mode}
                setMode={setMode}
                width={width}
                setWidth={handleWidthChange}
                maxWidth={imageData.originalWidth}
                zoom={zoom}
                setZoom={setZoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                converting={converting}
                onCopy={handleCopy}
                onDownloadTxt={handleDownloadTxt}
                onDownloadHtml={handleDownloadHtml}
                hasResult={!!monochromeAscii}
                copySuccess={copySuccess}
              />
              <AsciiDisplay 
                ascii={currentAscii} 
                mode={mode} 
                zoom={zoom}
              />
            </>
          )}
        </>
      ) : (
        <>
          <AsciiInput
            value={asciiText}
            onChange={setAsciiText}
            placeholder="Paste ASCII art here (use characters: @%#*+=-:. )"
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
