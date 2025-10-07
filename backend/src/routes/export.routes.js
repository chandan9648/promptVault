import express from 'express';
import { auth } from '../middlewares/auth.js';
import { exportJson, exportPdf, exportNotion } from '../controllers/export.controller.js';

const router = express.Router();

// Export selected prompt IDs to JSON
router.post('/json', auth, exportJson);

// Export selected prompt IDs to a simple PDF
router.post('/pdf', auth, exportPdf);

router.post('/notion', auth, exportNotion);

export default router;
