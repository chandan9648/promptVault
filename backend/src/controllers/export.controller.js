import Prompt from '../models/Prompt.js';
import PDFDocument from 'pdfkit';
import { exportPromptsToNotion } from '../services/notion.js';

export const exportJson = async (req, res) => {
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
};

export const exportPdf = async (req, res) => {
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
      const tags = Array.isArray(p.tags) ? p.tags : [];
      doc.moveDown().fontSize(10).text(`Tags: ${tags.join(', ')}`);
      if (p.category) doc.text(`Category: ${p.category}`);
      if (p.folder) doc.text(`Folder: ${p.folder}`);
      doc.moveDown().fontSize(12).text('Prompt:');
      doc.moveDown().font('Times-Roman').fontSize(12).text(p.text, { align: 'left' });
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to export PDF' });
  }
};

export const exportNotion = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'ids required' });
  try {
    const prompts = await Prompt.find({ _id: { $in: ids }, owner: req.user.id });
    const result = await exportPromptsToNotion(prompts);
    if (!result.ok) return res.status(400).json({ message: result.message });
    res.json({ success: true, exported: result.count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to export to Notion' });
  }
};
