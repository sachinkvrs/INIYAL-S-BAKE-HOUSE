import express from 'express';
import Content from '../models/Content.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all website content (Public)
router.get('/', async (req, res) => {
  try {
    const docs = await Content.find();
    const content = {};
    for (const doc of docs) {
      content[doc.key] = doc.value;
    }
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET content for specific section
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const doc = await Content.findOne({ key: section });
    if (!doc) {
      return res.status(404).json({ error: 'Section content not found' });
    }
    res.json({ section, data: doc.value });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT Update section content (Protected)
router.put('/:section', verifyTokenMiddleware, async (req, res) => {
  try {
    const { section } = req.params;
    const contentData = req.body;

    await Content.findOneAndUpdate(
      { key: section },
      { key: section, section, value: contentData, updated_at: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: `${section} content updated successfully`, data: contentData });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
