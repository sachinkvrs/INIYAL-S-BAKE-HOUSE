import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandingRoutes from './routes/brandingRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads & images
const uploadsPath = process.env.UPLOADS_DIR || path.resolve(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
  } catch (e) {
    // Ignore read-only fs on serverless
  }
}
const imagesPath = path.resolve(__dirname, '..', 'public', 'images');
app.use('/uploads', express.static(uploadsPath));
app.use('/images', express.static(imagesPath));

// Ensure DB connection before processing API routes
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Middleware Error]', err);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'mongodb-cloud' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', orderRoutes);

// Catch-all 404 for unhandled API endpoints
app.all('/api/{*path}', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve frontend in production (dist directory) when run standalone
const distPath = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('{*path}', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    const indexPath = path.resolve(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum allowed size is 10MB.' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
