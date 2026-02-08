import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Input, Tag, Select } from '../components/ui';
import { useAuth } from '../context/useAuth';
import CopyButton from '../components/HandleCopy';
import Loader from '../components/Loader';
import { Flame, Heart, Search } from 'lucide-react';


const Community = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('trending');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const nav = useNavigate();

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
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Flame size={20} className="text-gray-700" />
            Community
          </h1>
          <p className="text-sm text-gray-600 mt-1">Browse public prompts and save your favorites.</p>
        </div>
      </div>
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
          <Button className='w-full md:w-auto gap-2' onClick={load}>
            <Search size={16} />
            Apply
          </Button>
        </div>
      </div>
      {loading ? (
        <div><Loader /></div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((p) => (
            <div
              key={p._id}
              className="relative rounded-2xl bg-white p-5 pr-14 shadow-md hover:shadow-lg hover:bg-gray-50 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => nav(`/community/${p._id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') nav(`/community/${p._id}`);
              }}
            >
              <CopyButton textToCopy={p.text} />
              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-lg text-gray-900 truncate">{p.title}</div>
                  {p.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className={`inline-flex items-center gap-1 rounded-full shadow-md px-3 py-1 text-xs font-semibold ${
                      p._liked ? 'text-pink-600 bg-pink-50 border-pink-200' : 'text-gray-700 bg-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(p);
                    }}
                    title={user ? 'Like' : 'Login to like'}
                  >
                    <Heart size={14} fill={p._liked ? 'currentColor' : 'none'} />
                    {p.likes || 0}
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
