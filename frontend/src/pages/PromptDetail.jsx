import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Tag } from '../components/ui';


const PromptDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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


   // Custom date and time formatting
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
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const createdAt = formatDateTime(p.createdAt);
  const updatedAt = formatDateTime(p.updatedAt);

  //INSIDE PROMPT DETAIL PAGE

  return (
    <div className="max-w-3xl mx-auto p-4 overflow-x-hidden border-l-4 border-t-2 border-gray-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          {p.description && <p className="text-gray-600 mt-1">{p.description}</p>}

            {/*  Date & Time Section */}
          <div className="text-sm text-gray-500 mt-2 bg-gray-200 p-2 rounded">
            <p>📅 Created: {createdAt}</p>
            <p>🕒 Last Updated: {updatedAt}</p>
          </div>
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
