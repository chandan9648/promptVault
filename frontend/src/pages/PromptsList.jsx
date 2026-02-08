import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Input, Tag, Select } from '../components/ui';
import ExportBar from '../components/ExportBar';
import CopyButton from '../components/HandleCopy';
import Loader from '../components/Loader';
import { FilePlus2, Pencil, Search, Trash2, Globe, GlobeLock } from 'lucide-react';



//  Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);

    // Format date: dd/mm/yy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    // Format time: hh:mm:ss (24-hour)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };


// Prompt card component
const PromptCard = ({ p, selected, onSelect, onDelete, onPublishToggle }) => (
  <div className="relative w-full rounded-2xl bg-white p-5 shadow-md hover:shadow-lg hover:bg-gray-50 transition-colors">
    <div className="absolute top-4 left-4">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300"
        checked={!!selected}
        onChange={(e) => onSelect?.(e.target.checked)}
        aria-label={`Select ${p.title}`}
      />
    </div>

    <div className="absolute top-3 right-3">
      <CopyButton textToCopy={p.text} />
    </div>

    <div className="pl-7 pr-12">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/prompts/${p._id}`} className="font-semibold text-lg text-gray-900 hover:underline">
            {p.title}
          </Link>
          {p.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>}
          <div className="mt-2 text-xs text-gray-500">{formatDateTime(p.createdAt)}</div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/prompts/${p._id}/edit`}
            className="inline-flex items-center justify-center rounded-lg border bg-white p-2 text-gray-700 hover:bg-gray-50"
            aria-label={`Edit ${p.title}`}
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(p)}
            className="inline-flex items-center justify-center rounded-lg border bg-white p-2 text-red-700 hover:bg-red-50"
            aria-label={`Delete ${p.title}`}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {p.category && <Tag>{p.category}</Tag>}
        {p.folder && <Tag>{p.folder}</Tag>}
        {p.isPublic && <Tag>Public</Tag>}
      </div>

      <div className="mt-4">
        <Button className="gap-2" variant="secondary" onClick={() => onPublishToggle(p)}>
          {p.isPublic ? <GlobeLock size={16} /> : <Globe size={16} />}
          {p.isPublic ? 'Unpublish' : 'Publish'}
        </Button>
      </div>
    </div>
  </div>
);





//MAIN COMPONENT
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

  // We only want to load once on mount; Apply button triggers subsequent loads.
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api.listPrompts({ q: '', tag: '' });
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
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

  const uniqueTags = useMemo(() => {
    const banned = new Set(['ai', 'prompt-engineering']);
    return Array.from(new Set(items.flatMap((i) => i.tags || [])))
      .filter((t) => !banned.has(String(t).toLowerCase()));
  }, [items]);


  //MY PROMPTS MAIN PAGE
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">My Prompts</h1>
          <p className="text-sm text-gray-600 mt-1">Create, edit, and publish prompts to the community.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExportBar selectedIds={Object.keys(selected).filter((k) => selected[k])} />
          <Button className="gap-2" onClick={() => nav('/prompts/new')}>
            <FilePlus2 size={16} />
            New Prompt
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select
            value={tag}
            onChange={setTag}
            options={[{ value: '', label: 'All tags' }, ...uniqueTags.map((t) => ({ value: t, label: t }))]}
          />
          <Button variant="secondary" className="gap-2" onClick={load}>
            <Search size={16} />
            Apply
          </Button>
        </div>
      </div>
      {loading ? (
        <div><Loader /></div>
      ) : items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((p) => (
            <PromptCard
              key={p._id}
              p={p}
              selected={!!selected[p._id]}
              onSelect={(checked) => setSelected((s) => ({ ...s, [p._id]: checked }))}
              onDelete={onDelete}
              onPublishToggle={onPublishToggle}
            />
          ))}
          
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-gray-700 shadow-md">
          <div className="font-medium">No prompts yet.</div>
          <div className="text-sm text-gray-600 mt-1">Create your first prompt to get started.</div>
          <div className="mt-4">
            <Button className="gap-2" onClick={() => nav('/prompts/new')}>
              <FilePlus2 size={16} />
              New Prompt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptsList;
