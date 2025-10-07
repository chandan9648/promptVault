import express from 'express';
import { auth } from '../middleware/auth.js';
import Prompt from '../models/Prompt.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Export selected prompt IDs to JSON
router.post('/json', auth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'ids required' });
  try {
    const prompts = await Prompt.find({ _id: { $in: ids }, owner: req.user.id });
    res.setHeader('Content-Disposition', 'attachment; filename=prompts.json');
    res.json(
      prompts.map((p) => ({
        id: p._id,
        title: p.title,
        description: p.description,
        text: p.text,
        tags: p.tags,
        category: p.category,
        folder: p.folder,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: 'Failed to export JSON' });
  }
});

// Export selected prompt IDs to a simple PDF
router.post('/pdf', auth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'ids required' });
  try {
    const prompts = await Prompt.find({ _id: { $in: ids }, owner: req.user.id });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=prompts.pdf');

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    prompts.forEach((p, idx) => {
      if (idx) doc.addPage();
      doc.fontSize(18).text(p.title, { underline: true });
      if (p.description) doc.moveDown().fontSize(12).text(p.description);
      doc.moveDown().fontSize(10).text(`Tags: ${p.tags.join(', ')}`);
      if (p.category) doc.text(`Category: ${p.category}`);
      if (p.folder) doc.text(`Folder: ${p.folder}`);
      doc.moveDown().fontSize(12).text('Prompt:');
      doc.moveDown().font('Times-Roman').fontSize(12).text(p.text, { align: 'left' });
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to export PDF' });
  }
});

export default router;
