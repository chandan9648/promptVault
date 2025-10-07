import Prompt from '../models/Prompt.js';

export const publishPrompt = async (req, res) => {
  try {
    const p = await Prompt.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { isPublic: true },
      { new: true }
    );
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: 'Failed to publish' });
  }
};

export const unpublishPrompt = async (req, res) => {
  try {
    const p = await Prompt.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { isPublic: false },
      { new: true }
    );
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: 'Failed to unpublish' });
  }
};

export const listPublic = async (req, res) => {
  const { q, tag, sort = 'trending' } = req.query;
  const query = { isPublic: true };
  if (tag) query.tags = tag;
  if (q) query.$text = { $search: q };
  const sortBy = sort === 'new' ? { createdAt: -1 } : { likes: -1, updatedAt: -1 };
  try {
    const prompts = await Prompt.find(query).sort(sortBy).limit(50);
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public prompts' });
  }
};

// Like prompt
export const likePrompt = async (req, res) => {
  try {
    const p = await Prompt.findOne({ _id: req.params.id, isPublic: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    const userId = req.user.id;
    const hasLiked = p.likedBy.some((id) => id.toString() === userId);
    if (hasLiked) return res.status(400).json({ message: 'Already liked' });
    p.likedBy.push(userId);
    p.likes = p.likedBy.length;
    await p.save();
    res.json({ likes: p.likes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to like' });
  }
};

// Unlike prompt
export const unlikePrompt = async (req, res) => {
  try {
    const p = await Prompt.findOne({ _id: req.params.id, isPublic: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    const userId = req.user.id;
    p.likedBy = p.likedBy.filter((id) => id.toString() !== userId);
    p.likes = p.likedBy.length;
    await p.save();
    res.json({ likes: p.likes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unlike' });
  }
};
