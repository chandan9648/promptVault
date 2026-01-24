import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import promptRoutes from './routes/prompt.routes.js';
import communityRoutes from './routes/community.routes.js';
import exportRoutes from './routes/export.routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Base route
app.get('/', (req, res) => {
  res.send('PromptVault API');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/export', exportRoutes);

// Start server after DB connection
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promptvault';

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port:${PORT}`);
  });
});
