import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Input, Tag } from '../components/ui';
import ExportBar from '../components/ExportBar';



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
  <div className="relative w-full rounded-lg p-4 pl-8 bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200 h-full border-l-4 border-t-2 border-gray-500 rounded-lg shadow-lg">
    {/* Select checkbox inside card */}
    <input
      type="checkbox"
      className="absolute top-3 left-3"
      checked={!!selected}
      onChange={(e) => onSelect?.(e.target.checked)}
    />

    <div className="flex items-start justify-between ">
      <div>
        <Link to={`/prompts/${p._id}`} className="font-semibold text-lg text-blue-600 underline">{p.title}</Link>
        {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}

           {/* ✅ Add Date & Time below description */}
        <div className="text-xs text-gray-500  mt-2 bg-gray-200 p-1 text-center rounded">
          <p> {formatDateTime(p.createdAt)}</p>

        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/prompts/${p._id}/edit`} className="text-blue-600 text-sm cursor-pointer">Edit</Link>
        <button onClick={() => onDelete(p)} className="text-red-600 text-sm cursor-pointer">Delete</button>
      </div>
    </div>
    <div className="mt-2 flex flex-wrap gap-1">
  {/* Tags hidden */}
      {p.category && <Tag>{p.category}</Tag>}
      {p.folder && <Tag>{p.folder}</Tag>}
    </div>
    <div className="mt-3">
      <Button className='cursor-pointer' variant="secondary" onClick={() => onPublishToggle(p)}>
        {p.isPublic ? 'Unpublish' : 'Publish'}
      </Button>
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
    <div className="max-w-6xl mx-auto p-4 overflow-x-hidden">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-2xl font-semibold ">My Prompts</h1>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
          <ExportBar selectedIds={Object.keys(selected).filter((k) => selected[k])} />
          <Button className='cursor-pointer shadow-sm' onClick={() => nav('/prompts/new')}>New Prompt</Button>
        </div>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        {uniqueTags.length > 0 && (
          <select className="shadow-sm rounded-md px-3" value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">All tags</option>
            {uniqueTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}
        <Button className='cursor-pointer shadow-sm' variant="secondary" onClick={load}>Apply</Button>
      </div>
      {loading ? (
        <div>Loading…</div>
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
        <div className="text-gray-600">No prompts yet.</div>
      )}
    </div>
  );
};

export default PromptsList;
