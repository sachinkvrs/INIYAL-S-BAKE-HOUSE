import express from 'express';
import Order from '../models/Order.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

// GET all orders (Protected)
router.get('/', verifyTokenMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ created_at: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET single order by ID (Protected)
router.get('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST Create new order (Public or Admin)
router.post('/', async (req, res) => {
  try {
    const { customer_name, phone, products, quantity, total_amount, notes } = req.body;
    if (!customer_name || !phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    const order_number = 'IBH-' + Math.floor(1000 + Math.random() * 9000);

    const order = await Order.create({
      order_number,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      products: Array.isArray(products) ? products : [],
      quantity: quantity || '1 Order',
      total_amount: total_amount || 0,
      notes: notes ? notes.trim() : ''
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH Update status (Protected)
router.patch('/:id/status', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.updated_at = new Date();
    await order.save();

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE order (Protected)
router.delete('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
