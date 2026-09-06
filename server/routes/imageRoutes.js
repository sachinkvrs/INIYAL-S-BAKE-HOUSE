import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { upload } from '../upload.js';
import { verifyTokenMiddleware } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// GET all images
router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM images';
  const params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }
  query += ' ORDER BY created_at DESC';

  const images = db.prepare(query).all(...params);
  res.json({ images });
});

// POST Upload Single Image (Protected)
router.post('/upload', verifyTokenMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const category = req.body.category || 'other';
  const alt_text = req.body.alt_text || req.file.originalname;
  const relativeUrl = `/uploads/${req.file.filename}`;

  const stmt = db.prepare(`
    INSERT INTO images (filename, original_name, url, category, file_size, mime_type, alt_text)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    req.file.filename,
    req.file.originalname,
    relativeUrl,
    category,
    req.file.size,
    req.file.mimetype,
    alt_text
  );

  const created = db.prepare('SELECT * FROM images WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    message: 'Image uploaded successfully',
    url: relativeUrl,
    image: created
  });
});

// POST Upload Multiple Images (Protected)
router.post('/upload-multiple', verifyTokenMiddleware, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded' });
  }

  const category = req.body.category || 'products';
  const stmt = db.prepare(`
    INSERT INTO images (filename, original_name, url, category, file_size, mime_type, alt_text)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const uploaded = [];
  for (const file of req.files) {
    const relativeUrl = `/uploads/${file.filename}`;
    const result = stmt.run(
      file.filename,
      file.originalname,
      relativeUrl,
      category,
      file.size,
      file.mimetype,
      file.originalname
    );
    uploaded.push(db.prepare('SELECT * FROM images WHERE id = ?').get(result.lastInsertRowid));
  }

  res.status(201).json({
    message: `${uploaded.length} images uploaded successfully`,
    images: uploaded
  });
});

// DELETE Image (Protected)
router.delete('/:id', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const img = db.prepare('SELECT * FROM images WHERE id = ?').get(id);
  if (!img) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // If in uploads, attempt removing file from disk
  if (img.url.startsWith('/uploads/')) {
    const filePath = path.resolve(__dirname, '..', '..', 'public', img.url.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }

  db.prepare('DELETE FROM images WHERE id = ?').run(id);
  res.json({ message: 'Image deleted successfully' });
});

export default router;
