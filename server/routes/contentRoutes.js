import express from 'express';
import db from '../db.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all website content (Public)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, section, value_json FROM website_content').all();
  const content = {};
  for (const row of rows) {
    try {
      content[row.key] = JSON.parse(row.value_json);
    } catch (e) {
      content[row.key] = row.value_json;
    }
  }
  res.json({ content });
});

// GET content for specific section
router.get('/:section', (req, res) => {
  const { section } = req.params;
  const row = db.prepare('SELECT value_json FROM website_content WHERE key = ?').get(section);
  if (!row) {
    return res.status(404).json({ error: 'Section content not found' });
  }

  let data;
  try {
    data = JSON.parse(row.value_json);
  } catch (e) {
    data = row.value_json;
  }

  res.json({ section, data });
});

// PUT Update section content (Protected)
router.put('/:section', verifyTokenMiddleware, (req, res) => {
  const { section } = req.params;
  const contentData = req.body;

  const valueJson = JSON.stringify(contentData);
  db.prepare(`
    INSERT INTO website_content (key, section, value_json, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value_json = excluded.value_json,
      updated_at = CURRENT_TIMESTAMP
  `).run(section, section, valueJson);

  res.json({ message: `${section} content updated successfully`, data: contentData });
});

export default router;
