import express from 'express';
import { auth } from '../middlewares/auth.js';
import { createPrompt, listPrompts, getPrompt, updatePrompt, deletePrompt } from '../controllers/prompt.controller.js';

const router = express.Router();

// Create prompt with optional AI tagging
router.post('/', auth, createPrompt);

// List prompts for current user with filter/search
router.get('/', auth, listPrompts);

// Get one
router.get('/:id', auth, getPrompt);

// Update
router.put('/:id', auth, updatePrompt);

// Delete
router.delete('/:id', auth, deletePrompt);

export default router;
