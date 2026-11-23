import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler.js';
import cafeRoutes           from './routes/cafeRoutes.js';
import promoRoutes          from './routes/promoRoutes.js';
import favoriteRoutes       from './routes/favoriteRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import { removeReview }     from './controllers/reviewController.js';

const app = express();

// ============================================================
// Middleware
// ============================================================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    /\.vercel\.app$/,          // izinkan semua subdomain Vercel
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
}));
app.use(express.json());

// ============================================================
// Routes
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data:    { status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' },
    message: 'NgopiKampus API berjalan normal',
  });
});

app.use('/api/cafes',           cafeRoutes);
app.use('/api/promos',          promoRoutes);
app.use('/api/favorites',       favoriteRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Standalone DELETE /api/reviews/:id
app.delete('/api/reviews/:id', removeReview);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, data: null, message: `Route ${req.method} ${req.path} tidak ditemukan` });
});

// Global error handler
app.use(errorHandler);

// ============================================================
// Start server (lokal) – di Vercel, app di-export
// ============================================================
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 NgopiKampus API berjalan di http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

export default app;
