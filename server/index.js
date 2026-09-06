import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandingRoutes from './routes/brandingRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite database and seed initial data
initDatabase();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads & images
const uploadsPath = path.resolve(__dirname, '..', 'public', 'uploads');
const imagesPath = path.resolve(__dirname, '..', 'public', 'images');
app.use('/uploads', express.static(uploadsPath));
app.use('/images', express.static(imagesPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: "Iniyal's Bake House API", time: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Iniyal's Bake House API running on http://localhost:${PORT}`);
});
