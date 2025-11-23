import express from 'express';
import { body, validationResult } from 'express-validator';
import Prompt from '../models/Prompt.js';
import { auth } from '../middleware/auth.js';
import { suggestTags } from '../services/aiTagging.js';

const router = express.Router();

// Create prompt with optional AI tagging
router.post(
  '/',
  auth,
  [
    body('title').isString().isLength({ min: 2 }),
    body('text').isString().isLength({ min: 5 }),
    body('description').optional().isString(),
    body('tags').optional().isArray(),
    body('category').optional().isString(),
    body('folder').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, description, text, tags = [], category, folder } = req.body;
    try {
      let finalTags = tags;
      if (!tags.length) {
        finalTags = await suggestTags(text);
      }
      const prompt = await Prompt.create({
        owner: req.user.id,
        title,
        description,
        text,
        tags: finalTags,
        category,
        folder,
      });
      res.status(201).json(prompt);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create prompt' });
    }
  }
);

// List prompts for current user with filter/search
router.get('/', auth, async (req, res) => {
  const { q, tag, folder, category } = req.query;
  const query = { owner: req.user.id };
  if (tag) query.tags = tag;
  if (folder) query.folder = folder;
  if (category) query.category = category;
  if (q) query.$text = { $search: q };
  try {
    const prompts = await Prompt.find(query).sort({ updatedAt: -1 });
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch prompts' });
  }
});

// Get one
router.get('/:id', auth, async (req, res) => {
  try {
    const p = await Prompt.findOne({ _id: req.params.id, owner: req.user.id });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(404).json({ message: 'Not found' });
  }
});

// Update
router.put(
  '/:id',
  auth,
  [
    body('title').optional().isString(),
    body('text').optional().isString(),
    body('description').optional().isString(),
    body('tags').optional().isArray(),
    body('category').optional().isString(),
    body('folder').optional().isString(),
    body('isPublic').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const update = { ...req.body };
      const p = await Prompt.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        update,
        { new: true }
      );
      if (!p) return res.status(404).json({ message: 'Not found' });
      res.json(p);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update prompt' });
    }
  }
);

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const p = await Prompt.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete prompt' });
  }
});

export default router;
