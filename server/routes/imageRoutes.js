import express from 'express';
import Image from '../models/Image.js';
import { upload } from '../upload.js';
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

// GET raw image binary by ID
router.get('/raw/:id', async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ error: 'Image not found' });
    if (img.data && img.data.startsWith('data:')) {
      const parts = img.data.split(',');
      const buffer = Buffer.from(parts[1], 'base64');
      res.setHeader('Content-Type', img.mime_type || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(buffer);
    }
    return res.redirect(img.url);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load image' });
  }
});

// POST Upload Single Image (Protected) - Uses memory storage and saves Base64 data in MongoDB
router.post('/upload', verifyTokenMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const category = req.body.category || 'other';
    const alt_text = req.body.alt_text || req.file.originalname;

    // Convert in-memory buffer to base64 data URI
    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const filename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const image = await Image.create({
      filename,
      original_name: req.file.originalname,
      url: dataUrl,
      data: dataUrl,
      category,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      alt_text
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      url: dataUrl,
      image
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// POST Upload Multiple Images (Protected)
router.post('/upload-multiple', verifyTokenMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }

    const category = req.body.category || 'products';
    const docs = req.files.map(file => {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      return {
        filename,
        original_name: file.originalname,
        url: dataUrl,
        data: dataUrl,
        category,
        file_size: file.size,
        mime_type: file.mimetype,
        alt_text: file.originalname
      };
    });

    const uploaded = await Image.insertMany(docs);

    res.status(201).json({
      message: `${uploaded.length} images uploaded successfully`,
      images: uploaded
    });
  } catch (err) {
    console.error('Multiple image upload error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// DELETE Image (Protected)
router.delete('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Image.findByIdAndDelete(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
