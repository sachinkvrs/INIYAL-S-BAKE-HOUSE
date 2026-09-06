import express from 'express';
import db from '../db.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all orders (Protected)
router.get('/', verifyTokenMiddleware, (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM orders';
  const params = [];

  if (status && status !== 'All') {
    query += ' WHERE status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC';

  const orders = db.prepare(query).all(...params);
  const parsed = orders.map(ord => ({
    ...ord,
    products: ord.products_json ? JSON.parse(ord.products_json) : []
  }));

  res.json({ orders: parsed });
});

// GET single order by ID (Protected)
router.get('/:id', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({
    order: {
      ...order,
      products: order.products_json ? JSON.parse(order.products_json) : []
    }
  });
});

// POST Create new order (Public or Admin)
router.post('/', (req, res) => {
  const { customer_name, phone, products, quantity, total_amount, notes } = req.body;
  if (!customer_name || !phone) {
    return res.status(400).json({ error: 'Customer name and phone number are required' });
  }

  const order_number = 'IBH-' + Math.floor(1000 + Math.random() * 9000);
  const products_json = Array.isArray(products) ? JSON.stringify(products) : JSON.stringify([]);

  const stmt = db.prepare(`
    INSERT INTO orders (order_number, customer_name, phone, products_json, quantity, total_amount, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
  `);

  const result = stmt.run(
    order_number,
    customer_name.trim(),
    phone.trim(),
    products_json,
    quantity || '1 Order',
    total_amount || 0,
    notes ? notes.trim() : null
  );

  const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ message: 'Order created successfully', order: created });
});

// PATCH Update status (Protected)
router.patch('/:id/status', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const stmt = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  const result = stmt.run(status, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  res.json({ message: `Order status updated to ${status}`, order: updated });
});

// DELETE order (Protected)
router.delete('/:id', verifyTokenMiddleware, (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ message: 'Order deleted successfully' });
});

export default router;
