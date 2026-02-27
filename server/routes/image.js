const express = require('express');
const multer = require('multer');
const { processImage, getImageMetadata, validateFile } = require('../utils/imageProcessor');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/process-image', upload.single('file'), async (req, res) => {
  try {
    const validation = validateFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const metadata = await getImageMetadata(req.file.buffer);

    const result = await processImage(req.file.buffer, metadata.width, metadata.height);

    res.json({
      success: true,
      data: {
        originalWidth: metadata.width,
        originalHeight: metadata.height,
        ...result
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ success: false, error: 'Failed to process image. Please try again.' });
  }
});

module.exports = router;
