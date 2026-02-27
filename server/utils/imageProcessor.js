const sharp = require('sharp');
const path = require('path');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 300;

async function processImage(buffer, originalWidth, originalHeight) {
  const targetWidth = Math.min(MAX_WIDTH, originalWidth);
  const targetHeight = Math.round((originalHeight / originalWidth) * targetWidth);

  const resized = await sharp(buffer)
    .resize(targetWidth, targetHeight, { fit: 'inside' })
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
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }

  return { valid: true };
}

module.exports = {
  processImage,
  getImageMetadata,
  validateFile,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_WIDTH
};
