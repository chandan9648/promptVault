import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Button, Input, Tag, Select } from '../components/ui';
import { useAuth } from '../context/useAuth';
import CopyButton from '../components/HandleCopy';
import Loader from '../components/Loader';


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

  useEffect(() => {
    load();
  }, []);

  const onLike = async (p) => {
    if (!user) return alert('Login to like');
    if (p._liked) {
      await api.unlikePrompt(p._id);
      setItems((prev) => prev.map((x) => x._id === p._id ? { ...x, _liked: false, likes: Math.max(0, (x.likes || 1) - 1) } : x));
    } else {
      await api.likePrompt(p._id);
      setItems((prev) => prev.map((x) => x._id === p._id ? { ...x, _liked: true, likes: (x.likes || 0) + 1 } : x));
    }
  };

  const uniqueTags = (() => {
    const banned = new Set(['ai', 'prompt-engineering']);
    return Array.from(new Set(items.flatMap((i) => i.tags || [])))
      .filter((t) => !banned.has(String(t).toLowerCase()));
  })();

  return (
    <div className="max-w-6xl mx-auto p-4 overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-4">Community</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4 overflow-hidden">
        <div className="min-w-0">
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="min-w-0">
          <Select
            value={tag}
            onChange={setTag}
            options={[{ value: '', label: 'All tags' }, ...uniqueTags.map((t) => ({ value: t, label: t }))]}
          />
        </div>
        <div className="min-w-0">
          <Select
            value={sort}
            onChange={setSort}
            options={[{ value: 'trending', label: 'Trending' }, { value: 'new', label: 'Newest' }]}
          />
        </div>
        <div className="min-w-0">
          <Button className='cursor-pointer w-full md:w-auto' onClick={load}>Apply</Button>
        </div>
      </div>
      {loading ? (
        <div><Loader /></div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <div key={p._id} className="relative rounded-lg p-4 bg-gray-100 shadow-sm border-l-4 border-t-2 border-gray-500  shadow-md hover:shadow-lg transition-all duration-200">
              <CopyButton textToCopy={p.text} />
              <div className="flex items-start justify-between">

                <div>
                  <div className="font-semibold text-lg">{p.title}</div>
                  {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                </div>
                <div className="flex items-center gap-2 pt-5">

                  <button className={`text-sm ${p._liked ? 'text-pink-600' : 'text-gray-600'} cursor-pointer`} onClick={() => onLike(p)}>
                    ♥ {p.likes || 0}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap">
                {/* Tags hidden */}
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
