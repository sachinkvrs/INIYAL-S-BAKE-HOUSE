import express from 'express';
import db from '../db.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// Helper to format slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET all products
// Public: returns active, non-deleted products ordered by display_order
// Admin with ?all=true: returns all non-deleted products
router.get('/', (req, res) => {
  const showAll = req.query.all === 'true';
  let query = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_deleted = 0
  `;

  if (!showAll) {
    query += ' AND p.available = 1';
  }
  query += ' ORDER BY p.display_order ASC, p.id ASC';

  const products = db.prepare(query).all();
  const parsed = products.map(prod => ({
    ...prod,
    gallery: prod.gallery ? JSON.parse(prod.gallery) : [],
    pricing: {
      '250g': { label: '250 g', price: prod.price_250g },
      '500g': { label: '500 g', price: prod.price_500g },
      '1kg': { label: '1 kg', price: prod.price_1kg },
    }
  }));

  res.json({ products: parsed });
});

// GET single product by ID or Slug
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const isNumeric = /^\d+$/.test(idOrSlug);
  
  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_deleted = 0 AND ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
  `;
  const product = db.prepare(query).get(idOrSlug);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({
    product: {
      ...product,
      gallery: product.gallery ? JSON.parse(product.gallery) : [],
      pricing: {
        '250g': { label: '250 g', price: product.price_250g },
        '500g': { label: '500 g', price: product.price_500g },
        '1kg': { label: '1 kg', price: product.price_1kg },
      }
    }
  });
});

// POST Create new product (Protected)
router.post('/', verifyTokenMiddleware, (req, res) => {
  const {
    name,
    description,
    short_description,
    category_id,
    image,
    gallery,
    price_250g,
    price_500g,
    price_1kg,
    available,
    featured,
    badge,
    display_order
  } = req.body;

  if (!name || !description || price_250g === undefined || price_500g === undefined || price_1kg === undefined) {
    return res.status(400).json({ error: 'Name, description, and prices for 250g, 500g, and 1kg are required.' });
  }

  const slug = slugify(name) + '-' + Math.floor(1000 + Math.random() * 9000);
  const galleryJson = Array.isArray(gallery) ? JSON.stringify(gallery) : '[]';

  const stmt = db.prepare(`
    INSERT INTO products (
      name, slug, description, short_description, category_id,
      image, gallery, price_250g, price_500g, price_1kg,
      available, featured, badge, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name.trim(),
    slug,
    description.trim(),
    short_description ? short_description.trim() : description.slice(0, 80),
    category_id ? Number(category_id) : null,
    image || '/images/fudgy-brownie.jpg',
    galleryJson,
    parseFloat(price_250g),
    parseFloat(price_500g),
    parseFloat(price_1kg),
    available !== undefined ? (available ? 1 : 0) : 1,
    featured !== undefined ? (featured ? 1 : 0) : 0,
    badge ? badge.trim() : null,
    display_order !== undefined ? Number(display_order) : 0
  );

  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ message: 'Product created successfully', product: created });
});

// PUT Update product (Protected)
router.put('/:id', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM products WHERE id = ? AND is_deleted = 0').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const {
    name,
    description,
    short_description,
    category_id,
    image,
    gallery,
    price_250g,
    price_500g,
    price_1kg,
    available,
    featured,
    badge,
    display_order
  } = req.body;

  const galleryJson = gallery !== undefined 
    ? (Array.isArray(gallery) ? JSON.stringify(gallery) : '[]')
    : existing.gallery;

  const stmt = db.prepare(`
    UPDATE products SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      short_description = COALESCE(?, short_description),
      category_id = COALESCE(?, category_id),
      image = COALESCE(?, image),
      gallery = ?,
      price_250g = COALESCE(?, price_250g),
      price_500g = COALESCE(?, price_500g),
      price_1kg = COALESCE(?, price_1kg),
      available = COALESCE(?, available),
      featured = COALESCE(?, featured),
      badge = ?,
      display_order = COALESCE(?, display_order),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(
    name !== undefined ? name.trim() : null,
    description !== undefined ? description.trim() : null,
    short_description !== undefined ? short_description.trim() : null,
    category_id !== undefined ? (category_id ? Number(category_id) : null) : null,
    image !== undefined ? image : null,
    galleryJson,
    price_250g !== undefined ? parseFloat(price_250g) : null,
    price_500g !== undefined ? parseFloat(price_500g) : null,
    price_1kg !== undefined ? parseFloat(price_1kg) : null,
    available !== undefined ? (available ? 1 : 0) : null,
    featured !== undefined ? (featured ? 1 : 0) : null,
    badge !== undefined ? (badge ? badge.trim() : null) : existing.badge,
    display_order !== undefined ? Number(display_order) : null,
    id
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json({ message: 'Product updated successfully', product: updated });
});

// PATCH Toggle Available (Protected)
router.patch('/:id/toggle-available', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const prod = db.prepare('SELECT available FROM products WHERE id = ? AND is_deleted = 0').get(id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });

  const newStatus = prod.available ? 0 : 1;
  db.prepare('UPDATE products SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);
  res.json({ message: `Product ${newStatus ? 'enabled' : 'disabled'} successfully`, available: newStatus });
});

// PATCH Toggle Featured (Protected)
router.patch('/:id/toggle-featured', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const prod = db.prepare('SELECT featured FROM products WHERE id = ? AND is_deleted = 0').get(id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });

  const newStatus = prod.featured ? 0 : 1;
  db.prepare('UPDATE products SET featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);
  res.json({ message: `Featured status updated`, featured: newStatus });
});

// POST Duplicate Product (Protected)
router.post('/:id/duplicate', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const original = db.prepare('SELECT * FROM products WHERE id = ? AND is_deleted = 0').get(id);
  if (!original) return res.status(404).json({ error: 'Product not found' });

  const duplicateName = `${original.name} (Copy)`;
  const newSlug = slugify(duplicateName) + '-' + Math.floor(1000 + Math.random() * 9000);

  const stmt = db.prepare(`
    INSERT INTO products (
      name, slug, description, short_description, category_id,
      image, gallery, price_250g, price_500g, price_1kg,
      available, featured, badge, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    duplicateName,
    newSlug,
    original.description,
    original.short_description,
    original.category_id,
    original.image,
    original.gallery,
    original.price_250g,
    original.price_500g,
    original.price_1kg,
    original.available,
    original.featured,
    original.badge,
    original.display_order + 1
  );

  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ message: 'Product duplicated successfully', product: created });
});

// DELETE Soft-delete product (Protected)
router.delete('/:id', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const result = db.prepare('UPDATE products SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
});

export default router;
