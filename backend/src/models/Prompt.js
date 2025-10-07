import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    text: { type: String, required: true },
    tags: [{ type: String, index: true }],
    category: { type: String, index: true },
    folder: { type: String, index: true },
    isPublic: { type: Boolean, default: false, index: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Support text search on title/description/text
PromptSchema.index({ title: 'text', description: 'text', text: 'text' });

export default mongoose.model('Prompt', PromptSchema);
