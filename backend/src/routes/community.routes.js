import express from 'express';
import { auth } from '../middlewares/auth.js';
import { publishPrompt, unpublishPrompt, listPublic, likePrompt, unlikePrompt } from '../controllers/community.controller.js';

const router = express.Router();

// Publish/unpublish
router.post('/:id/publish', auth, publishPrompt);

router.post('/:id/unpublish', auth, unpublishPrompt);

// Public listing with search and trending
router.get('/public', listPublic);

// Like/unlike
router.post('/:id/like', auth, likePrompt);

router.post('/:id/unlike', auth, unlikePrompt);

export default router;
