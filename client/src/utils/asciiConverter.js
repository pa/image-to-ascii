const DENSITY = '█▓▒░ ░▒▓█';  // Legacy fallback

const DENSITY_CHARS = [
  '█', '▓', '▒', '░', '▎', '▍', '▌', '▋', '▊', '▉', '▅', '▄', '▃', '▂', '▁',
  '$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm',
  'Z', 'O', '0', 'Q', 'L', 'C', 'J', 'U', 'Y', 'X', 'z', 'c', 'v', 'u', 'n', 'x', 'r', 'j', 'f', 't',
  '/', '\\', '|', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '=', '~', '<', '>',
  'i', '!', 'l', 'I', ';', ':', ',', '"', '^', '`', '\'', '.', ' '
];

function mapBrightnessToChar(brightness) {
  const index = Math.floor((brightness / 255) * (DENSITY_CHARS.length - 1));
  return DENSITY_CHARS[index];
}

export function convertToMonochrome(pixels, width) {
  const rows = pixels.length;
  let result = '';

  for (let y = 0; y < rows; y++) {
    let row = '';
    for (let x = 0; x < width; x++) {
      const pixel = pixels[y][x];
      const brightness = calculateBrightness(pixel.r, pixel.g, pixel.b);
      row += mapBrightnessToChar(brightness);
    }
    result += row + '\n';
  }

  return result;
}

export function convertToColored(pixels, width) {
  const rows = pixels.length;
  let result = '';

  for (let y = 0; y < rows; y++) {
    let row = '';
    for (let x = 0; x < width; x++) {
      const pixel = pixels[y][x];
      const brightness = calculateBrightness(pixel.r, pixel.g, pixel.b);
      const char = mapBrightnessToChar(brightness);
      row += `<span style="color: rgb(${pixel.r},${pixel.g},${pixel.b})">${char}</span>`;
    }
    result += row + '\n';
  }

  return result;
}

export function generateHtmlContent(coloredAscii) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASCII Art - Image to ASCII</title>
  <style>
    body {
      background-color: #0d1117;
      margin: 0;
      padding: 20px;
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      line-height: 1;
      overflow-x: auto;
    }
    pre {
      margin: 0;
      font-size: 10px;
      line-height: 1;
      white-space: pre;
    }
  </style>
</head>
<body>
  <pre>${coloredAscii}</pre>
</body>
</html>`;
}

export function calculateOutputWidth(originalWidth) {
  const calculated = Math.floor(originalWidth / 2);
  return Math.min(200, Math.max(50, calculated));
}

export function getFilename(extension) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${date}-${hours}${minutes}-image-to-ascii.${extension}`;
}

function charToBrightness(char) {
  const index = DENSITY_CHARS.indexOf(char);
  if (index === -1) return 128;
  return Math.floor((index / (DENSITY_CHARS.length - 1)) * 255);
}

export function asciiToImage(asciiText, outputWidth = 200, fontSize = 8) {
  const lines = asciiText.split('\n').filter(line => line.length > 0);
  const height = lines.length;
  const width = lines.reduce((max, line) => Math.max(max, line.length), 0);

  const canvas = document.createElement('canvas');
  const scale = outputWidth / width;
  canvas.width = outputWidth;
  canvas.height = Math.floor(height * scale);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', 'Consolas', monospace`;
  ctx.textBaseline = 'top';

  for (let y = 0; y < height; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      const brightness = charToBrightness(char);
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      const scaledX = (x / width) * outputWidth;
      const scaledY = (y / height) * canvas.height;
      ctx.fillText(char, scaledX, scaledY);
    }
  }

  return canvas.toDataURL('image/png');
}

export function getImageFilename(extension) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${date}-${hours}${minutes}-ascii-to-image.${extension}`;
}

export { DENSITY_CHARS as DENSITY };
