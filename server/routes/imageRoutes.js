import express from 'express';
import path from 'path';
import fs from 'fs';
import Image from '../models/Image.js';
import { upload, uploadDir } from '../upload.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all images
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    const images = await Image.find(filter).sort({ created_at: -1 });
    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST Upload Single Image (Protected)
router.post('/upload', verifyTokenMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const category = req.body.category || 'other';
    const alt_text = req.body.alt_text || req.file.originalname;
    const relativeUrl = `/uploads/${req.file.filename}`;

    const image = await Image.create({
      filename: req.file.filename,
      original_name: req.file.originalname,
      url: relativeUrl,
      category,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      alt_text
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      url: relativeUrl,
      image
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST Upload Multiple Images (Protected)
router.post('/upload-multiple', verifyTokenMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }

    const category = req.body.category || 'products';
    const docs = req.files.map(file => ({
      filename: file.filename,
      original_name: file.originalname,
      url: `/uploads/${file.filename}`,
      category,
      file_size: file.size,
      mime_type: file.mimetype,
      alt_text: file.originalname
    }));

    const uploaded = await Image.insertMany(docs);

    res.status(201).json({
      message: `${uploaded.length} images uploaded successfully`,
      images: uploaded
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE Image (Protected)
router.delete('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const img = await Image.findById(id);
    if (!img) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Attempt removing local file if it exists
    if (img.url.startsWith('/uploads/')) {
      const fileName = path.basename(img.url);
      const filePath = path.join(uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          // Continue
        }
      }
    }

    await Image.findByIdAndDelete(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
