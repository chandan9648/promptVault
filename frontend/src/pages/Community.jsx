import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Button, Input, Tag } from '../components/ui';
import { useAuth } from '../context/useAuth';

const Community = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('trending');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listPublic({ q, tag, sort });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, []);

  const onLike = async (p) => {
    if (!user) return alert('Login to like');
    if (p._liked) {
      await api.unlikePrompt(p._id);
      setItems((prev) => prev.map((x) => x._id === p._id ? { ...x, _liked: false, likes: Math.max(0, (x.likes||1)-1) } : x));
    } else {
      await api.likePrompt(p._id);
      setItems((prev) => prev.map((x) => x._id === p._id ? { ...x, _liked: true, likes: (x.likes||0)+1 } : x));
    }
  };

  const uniqueTags = Array.from(new Set(items.flatMap((i) => i.tags || [])));

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Community</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded-md px-3" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">All tags</option>
          {uniqueTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="border rounded-md px-3" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="trending">Trending</option>
          <option value="new">Newest</option>
        </select>
        <Button variant="secondary" onClick={load}>Apply</Button>
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <div key={p._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{p.title}</div>
                  {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button className={`text-sm ${p._liked ? 'text-pink-600' : 'text-gray-600'}`} onClick={() => onLike(p)}>
                    ♥ {p.likes || 0}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap">
                {p.tags?.map((t) => <Tag key={t}>{t}</Tag>)}
                {p.category && <Tag>{p.category}</Tag>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No public prompts.</div>
      )}
    </div>
  );
};

export default Community;
