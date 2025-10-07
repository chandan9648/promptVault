import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import promptRoutes from './routes/prompt.routes.js';
import communityRoutes from './routes/community.routes.js';
import exportRoutes from './routes/export.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));
app.use(helmet());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/export', exportRoutes);

export default app;





