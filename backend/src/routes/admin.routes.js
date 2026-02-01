import express from 'express';
import User from '../models/User.js';
import Prompt from '../models/Prompt.js';
import { auth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin stats (counts only; no prompt details)
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const [userCount, sharedPromptCount] = await Promise.all([
      User.estimatedDocumentCount(),
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

export default router;
