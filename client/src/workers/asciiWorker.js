const DENSITY = '█▓▒░▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';

function calculateBrightness(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function mapBrightnessToChar(brightness) {
  const index = Math.floor((brightness / 255) * (DENSITY.length - 1));
  return DENSITY[index];
}

function convertChunkToMonochrome(pixels, startRow, endRow, width) {
  let result = '';
  const totalRows = endRow - startRow;
  
  for (let y = startRow; y < endRow; y++) {
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

function convertChunkToColored(pixels, startRow, endRow, width) {
  let result = '';
  
  for (let y = startRow; y < endRow; y++) {
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

async function convertParallel(pixels, width, numWorkers, onProgress) {
  const rows = pixels.length;
  const chunkSize = Math.ceil(rows / numWorkers);
  
  const monoPromises = [];
  const colorPromises = [];
  
  for (let i = 0; i < numWorkers; i++) {
    const startRow = i * chunkSize;
    const endRow = Math.min(startRow + chunkSize, rows);
    
    monoPromises.push(
      new Promise((resolve) => {
        const result = convertChunkToMonochrome(pixels, startRow, endRow, width);
        resolve({ index: i, result });
      })
    );
    
    colorPromises.push(
      new Promise((resolve) => {
        const result = convertChunkToColored(pixels, startRow, endRow, width);
        resolve({ index: i, result });
      })
    );
  }
  
  const monoChunks = await Promise.all(monoPromises);
  onProgress(50);
  
  const colorChunks = await Promise.all(colorPromises);
  onProgress(100);
  
  monoChunks.sort((a, b) => a.index - b.index);
  colorChunks.sort((a, b) => a.index - b.index);
  
  return {
    monochrome: monoChunks.map(c => c.result).join(''),
    colored: colorChunks.map(c => c.result).join('')
  };
}

self.onmessage = async function(e) {
  const { pixels, width, numWorkers = 4 } = e.data;
  
  try {
    self.postMessage({ type: 'progress', progress: 0 });
    
    const result = await convertParallel(pixels, width, numWorkers, (p) => {
      self.postMessage({ type: 'progress', progress: p });
    });
    
    self.postMessage({ 
      type: 'complete', 
      monochrome: result.monochrome, 
      colored: result.colored 
    });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};
