import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Tag } from '../components/ui';
import CopyButton from '../components/HandleCopy';
import Loader from '../components/Loader';
import { useAuth } from '../context/useAuth';

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
    <div className="max-w-3xl mx-auto p-4 overflow-x-hidden border-l-4 border-t-2 border-gray-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          {p.description && <p className="text-gray-600 mt-1">{p.description}</p>}
        </div>

        <div className="flex gap-3 items-center">
          <button
            className={`text-sm ${p._liked ? 'text-pink-600' : 'text-gray-600'} cursor-pointer`}
            onClick={onLike}
            disabled={busy}
            title={user ? 'Like' : 'Login to like'}
          >
            ♥ {p.likes || 0}
          </button>
          <Button variant="secondary" onClick={() => nav('/community')}>Back</Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap">
        {p.category && <Tag>{p.category}</Tag>}
      </div>

      <div className="mt-6 whitespace-pre-wrap bg-gray-100 p-6 rounded-lg shadow-sm relative">
        <CopyButton textToCopy={p.text} />
        {p.text}
      </div>
    </div>
  );
};

export default CommunityPromptDetail;