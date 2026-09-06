import express from 'express';
import db from '../db.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all branding (Public)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM branding').all();
  const branding = {};
  for (const row of rows) {
    branding[row.key] = row.value;
  }
  res.json({ branding });
});

// PUT Update branding (Protected)
router.put('/', verifyTokenMiddleware, (req, res) => {
  const updates = req.body;
  const stmt = db.prepare('INSERT OR REPLACE INTO branding (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

  const transaction = db.transaction((data) => {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        stmt.run(key, String(value));
      }
    }
  });

  transaction(updates);

  // Return updated
  const rows = db.prepare('SELECT key, value FROM branding').all();
  const branding = {};
  for (const row of rows) {
    branding[row.key] = row.value;
  }

  res.json({ message: 'Branding updated successfully', branding });
});

export default router;
