import express from 'express';
import Setting from '../models/Setting.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all settings (Public)
router.get('/', async (req, res) => {
  try {
    const docs = await Setting.find();
    const settings = {};
    for (const doc of docs) {
      settings[doc.key] = doc.value;
    }
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT Update settings (Protected)
router.put('/', verifyTokenMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null) {
        await Setting.findOneAndUpdate(
          { key },
          { key, value: String(value), updated_at: new Date() },
          { upsert: true }
        );
      }
    }

    const docs = await Setting.find();
    const settings = {};
    for (const doc of docs) {
      settings[doc.key] = doc.value;
    }

    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
