import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Input, Textarea } from '../components/ui';
import { ArrowLeft, Save } from 'lucide-react';

const toArray = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);

const PromptEditor = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState({ title: '', description: '', text: '', tags: '', category: '', folder: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      if (!editing) return;
      const p = await api.getPrompt(id);
      const banned = new Set(['ai', 'prompt-engineering']);
      const filteredTags = (p.tags || []).filter((t) => !banned.has(String(t).toLowerCase()));
      setForm({
        title: p.title || '',
        description: p.description || '',
        text: p.text || '',
        // Hide default banned tags unless the user types them 
        tags: filteredTags.join(', '),
        category: p.category || '',
        folder: p.folder || '',
      });
    };
    run();
  }, [editing, id]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, tags: toArray(form.tags) };
      if (editing) await api.updatePrompt(id, payload);
      else await api.createPrompt(payload);
      nav('/prompts');
    } catch (e1) {
      setError(e1?.data?.message || 'Save failed');
    }
  };

  //EDIT PROMPT PAGE 
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{editing ? 'Edit' : 'New'} Prompt</h1>
          <p className="text-sm text-gray-600 mt-1">Keep titles short and prompts clear.</p>
        </div>
        <Button variant="outline" type="button" className="gap-2" onClick={() => nav(-1)}>
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-md">
        <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} required minLength={2} />
        <Input label="Description" value={form.description} onChange={(e) => update('description', e.target.value)} />
        <Textarea label="Prompt text" value={form.text} onChange={(e) => update('text', e.target.value)} required minLength={5} />
        <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => update('tags', e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Category" value={form.category} onChange={(e) => update('category', e.target.value)} />
          <Input label="Folder" value={form.folder} onChange={(e) => update('folder', e.target.value)} />
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="gap-2">
            <Save size={16} />
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={() => nav(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromptEditor;
