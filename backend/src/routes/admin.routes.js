import express from 'express';
import User from '../models/User.js';
import Prompt from '../models/Prompt.js';
import { auth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin stats (counts only; no prompt details)
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const [userCount, sharedPromptCount] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Prompt.countDocuments({ isPublic: true }),
    ]);

    res.json({ userCount, sharedPromptCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load admin stats' });
  }
});

// Users summary (email + number of shared/public prompts)
router.get('/users/summary', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $project: { email: 1, name: 1 } },
      {
        $lookup: {
          from: 'prompts',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$owner', '$$userId'] },
                    { $eq: ['$isPublic', true] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'shared',
        },
      },
      {
        $addFields: {
          sharedPromptCount: {
            $ifNull: [{ $arrayElemAt: ['$shared.count', 0] }, 0],
          },
        },
      },
      { $project: { email: 1, name: 1, sharedPromptCount: 1 } },
      { $sort: { sharedPromptCount: -1, email: 1 } },
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load users summary' });
  }
});

// Delete a user (admin only). Also deletes the user's prompts.
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin')
      return res.status(400).json({ message: 'Cannot delete an admin user' });

    // Remove likes by this user from other prompts and keep likes in sync.
    await Prompt.updateMany(
      { likedBy: user._id },
      [
        { $set: { likedBy: { $setDifference: ['$likedBy', [user._id]] } } },
        { $set: { likes: { $size: '$likedBy' } } },
      ]
    );

    // Delete prompts owned by the user.
    await Prompt.deleteMany({ owner: user._id });

    // Finally delete the user.
    await User.deleteOne({ _id: user._id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
