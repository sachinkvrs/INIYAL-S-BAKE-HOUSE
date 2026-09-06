import express from 'express';
import db from '../db.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all settings (Public)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json({ settings });
});

// PUT Update settings (Protected)
router.put('/', verifyTokenMiddleware, (req, res) => {
  const updates = req.body;
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

  const transaction = db.transaction((data) => {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        stmt.run(key, String(value));
      }
    }
  });

  transaction(updates);

  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  res.json({ message: 'Settings updated successfully', settings });
});

export default router;
