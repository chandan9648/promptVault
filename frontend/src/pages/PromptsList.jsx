import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Input, Tag } from '../components/ui';
import ExportBar from '../components/ExportBar';

const PromptCard = ({ p, onDelete, onPublishToggle }) => (
  <div className="border rounded-lg p-4 bg-white shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <Link to={`/prompts/${p._id}`} className="font-semibold text-lg hover:underline">{p.title}</Link>
        {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/prompts/${p._id}/edit`} className="text-blue-600 text-sm">Edit</Link>
        <button onClick={() => onDelete(p)} className="text-red-600 text-sm">Delete</button>
      </div>
    </div>
    <div className="mt-2 flex flex-wrap">
      {p.tags?.map((t) => <Tag key={t}>{t}</Tag>)}
      {p.category && <Tag>{p.category}</Tag>}
      {p.folder && <Tag>{p.folder}</Tag>}
    </div>
    <div className="mt-3">
      <Button variant="secondary" onClick={() => onPublishToggle(p)}>
        {p.isPublic ? 'Unpublish' : 'Publish'}
      </Button>
    </div>
  </div>
);

const PromptsList = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listPrompts({ q, tag });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (p) => {
    if (!confirm('Delete this prompt?')) return;
    await api.deletePrompt(p._id);
    setItems((prev) => prev.filter((x) => x._id !== p._id));
  };

  const onPublishToggle = async (p) => {
    if (p.isPublic) await api.unpublishPrompt(p._id);
    else await api.publishPrompt(p._id);
    setItems((prev) => prev.map((x) => (x._id === p._id ? { ...x, isPublic: !x.isPublic } : x)));
  };

  const uniqueTags = useMemo(() => Array.from(new Set(items.flatMap((i) => i.tags || []))), [items]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Prompts</h1>
        <div className="flex items-center gap-2">
          <ExportBar selectedIds={Object.keys(selected).filter((k) => selected[k])} />
          <Button onClick={() => nav('/prompts/new')}>New Prompt</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded-md px-3" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">All tags</option>
          {uniqueTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <Button variant="secondary" onClick={load}>Apply</Button>
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <div key={p._id} className="flex items-start gap-3">
              <input type="checkbox" className="mt-2" checked={!!selected[p._id]} onChange={(e) => setSelected((s) => ({ ...s, [p._id]: e.target.checked }))} />
              <PromptCard p={p} onDelete={onDelete} onPublishToggle={onPublishToggle} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No prompts yet.</div>
      )}
    </div>
  );
};

export default PromptsList;
