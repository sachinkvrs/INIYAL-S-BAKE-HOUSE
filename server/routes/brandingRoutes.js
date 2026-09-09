import express from 'express';
import Branding from '../models/Branding.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all branding (Public)
router.get('/', async (req, res) => {
  try {
    const docs = await Branding.find();
    const branding = {};
    for (const doc of docs) {
      branding[doc.key] = doc.value;
    }
    res.json({ branding });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT Update branding (Protected)
router.put('/', verifyTokenMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null) {
        await Branding.findOneAndUpdate(
          { key },
          { key, value: String(value), updated_at: new Date() },
          { upsert: true }
        );
      }
    }

    const docs = await Branding.find();
    const branding = {};
    for (const doc of docs) {
      branding[doc.key] = doc.value;
    }

    res.json({ message: 'Branding updated successfully', branding });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
