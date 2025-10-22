import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Tag } from '../components/ui';

const PromptDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const d = await api.getPrompt(id);
      setP(d);
    } catch {
      setError('Not found');
    }
  }, [id]);

  useEffect(() => { load();
  }, [load]);

  const togglePub = async () => {
    if (!p) return;
    if (p.isPublic) await api.unpublishPrompt(p._id);
    else await api.publishPrompt(p._id);
    setP({ ...p, isPublic: !p.isPublic });
  };

  if (!p) return <div className="p-4">{error || 'Loading…'}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 overflow-x-hidden">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          {p.description && <p className="text-gray-600 mt-1">{p.description}</p>}
        </div>
        <div className="flex gap-4 ">
          <Link to={`/prompts/${p._id}/edit`} className="text-blue-600 mt-2">Edit</Link>
          <Button variant="secondary" onClick={() => nav('/prompts')}>Back</Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap">
  {/* Tags hidden */}
        {p.category && <Tag>{p.category}</Tag>}
        {p.folder && <Tag>{p.folder}</Tag>}
        {p.isPublic && <Tag>Public</Tag>}
      </div>
      <div className="mt-6 whitespace-pre-wrap bg-gray-100 p-6 rounded-lg shadow-sm">
        {p.text}
      </div>
      <div className="mt-4">
        <Button variant="secondary" onClick={togglePub}>{p.isPublic ? 'Unpublish' : 'Publish'}</Button>
      </div>
    </div>
  );
};

export default PromptDetail;
