const sharp = require('sharp');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function processImage(buffer, originalWidth, originalHeight) {
  const resized = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = [];
  const { data, info } = resized;

  for (let y = 0; y < info.height; y++) {
    const row = [];
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const pixel = {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2]
      };
      row.push(pixel);
    }
    pixels.push(row);
  }

  return {
    width: info.width,
    height: info.height,
    pixels
  };
}

async function getImageMetadata(buffer) {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format
  };
}

function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file uploaded' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP images only.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' };
  }

  return { valid: true };
}

module.exports = {
  processImage,
  getImageMetadata,
  validateFile,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
};
