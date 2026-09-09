import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start HTTP listener
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] Iniyal's Bake House API running on port ${PORT} (MongoDB Cloud)`);
    });
  })
  .catch((err) => {
    console.error('[Server Start Error]', err);
    // Still listen so server stays alive and reports health or reconnects
    app.listen(PORT, () => {
      console.log(`[Server] Iniyal's Bake House API running on port ${PORT} (Connecting to DB in background...)`);
    });
  });
