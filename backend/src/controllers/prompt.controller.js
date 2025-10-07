import Prompt from '../models/Prompt.js';
import { suggestTags } from '../services/aiTagging.js';

export const createPrompt = async (req, res) => {
  const { title, description, text, tags = [], category, folder } = req.body || {};
  if (!title || title.length < 2) return res.status(400).json({ message: 'Title required' });
  if (!text || text.length < 5) return res.status(400).json({ message: 'Text too short' });
  try {
    let finalTags = Array.isArray(tags) ? tags : [];
    if (!finalTags.length) finalTags = await suggestTags(text);
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
};

export const listPrompts = async (req, res) => {
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
};

export const getPrompt = async (req, res) => {
  try {
    const p = await Prompt.findOne({ _id: req.params.id, owner: req.user.id });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(404).json({ message: 'Not found' });
  }
};

export const updatePrompt = async (req, res) => {
  try {
    const update = { ...req.body };
    const p = await Prompt.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, update, {
      new: true,
    });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update prompt' });
  }
};

export const deletePrompt = async (req, res) => {
  try {
    const p = await Prompt.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete prompt' });
  }
};
