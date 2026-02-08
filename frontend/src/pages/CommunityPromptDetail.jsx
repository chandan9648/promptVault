import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Tag } from '../components/ui';
import CopyButton from '../components/HandleCopy';
import Loader from '../components/Loader';
import { useAuth } from '../context/useAuth';
import { ArrowLeft, Heart } from 'lucide-react';

const CommunityPromptDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const d = await api.getPublicPrompt(id);
      setP(d);
    } catch {
      setError('Not found');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onLike = async () => {
    if (!p) return;
    if (!user) return alert('Login to like');
    if (busy) return;

    setBusy(true);
    try {
      if (p._liked) {
        const res = await api.unlikePrompt(p._id);
        setP((prev) => ({
          ...prev,
          _liked: false,
          likes: typeof res?.likes === 'number' ? res.likes : Math.max(0, (prev.likes || 1) - 1),
        }));
      } else {
        const res = await api.likePrompt(p._id);
        setP((prev) => ({
          ...prev,
          _liked: true,
          likes: typeof res?.likes === 'number' ? res.likes : (prev.likes || 0) + 1,
        }));
      }
    } finally {
      setBusy(false);
    }
  };

  if (!p) return <div className="p-4">{error || <Loader />}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="rounded-2xl bg-white shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold truncate">{p.title}</h1>
              {p.description && <p className="text-gray-600 mt-1">{p.description}</p>}
              <div className="mt-4 flex flex-wrap gap-1">
                {p.category && <Tag>{p.category}</Tag>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-semibold ${
                  p._liked ? 'text-pink-600 bg-pink-50 border-pink-200' : 'text-gray-700 bg-white'
                } disabled:opacity-60`}
                onClick={onLike}
                disabled={busy}
                title={user ? 'Like' : 'Login to like'}
              >
                <Heart size={16} fill={p._liked ? 'currentColor' : 'none'} />
                {p.likes || 0}
              </button>
              <Button variant="outline" className="gap-2" onClick={() => nav('/community')}>
                <ArrowLeft size={16} />
                Back
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="relative whitespace-pre-wrap rounded-xl border bg-white p-5 text-gray-900">
            <CopyButton textToCopy={p.text} />
            {p.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPromptDetail;