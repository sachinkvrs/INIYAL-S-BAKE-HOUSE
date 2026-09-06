import express from 'express';
import db from '../db.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET all categories
router.get('/', (req, res) => {
  const categories = db.prepare(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_deleted = 0
    GROUP BY c.id
    ORDER BY c.display_order ASC, c.name ASC
  `).all();
  res.json({ categories });
});

// POST Create category (Protected)
router.post('/', verifyTokenMiddleware, (req, res) => {
  const { name, display_order } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug = slugify(name);
  const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
  if (existing) {
    return res.status(400).json({ error: 'A category with this name already exists' });
  }

  const stmt = db.prepare('INSERT INTO categories (name, slug, display_order) VALUES (?, ?, ?)');
  const result = stmt.run(name.trim(), slug, display_order !== undefined ? Number(display_order) : 0);
  const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ message: 'Category created successfully', category: created });
});

// PUT Update category (Protected)
router.put('/:id', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, display_order, enabled } = req.body;

  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const slug = name ? slugify(name) : existing.slug;
  const stmt = db.prepare(`
    UPDATE categories SET
      name = COALESCE(?, name),
      slug = ?,
      display_order = COALESCE(?, display_order),
      enabled = COALESCE(?, enabled)
    WHERE id = ?
  `);

  stmt.run(
    name ? name.trim() : null,
    slug,
    display_order !== undefined ? Number(display_order) : null,
    enabled !== undefined ? (enabled ? 1 : 0) : null,
    id
  );

  const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.json({ message: 'Category updated successfully', category: updated });
});

// DELETE Category (Protected)
router.delete('/:id', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Unlink products
  db.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').run(id);
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);

  res.json({ message: 'Category deleted successfully' });
});

export default router;
