import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, Tag } from '../components/ui';
import CopyButton from '../components/HandleCopy';
import Loader from '../components/Loader';
import { ArrowLeft, Calendar, Pencil, Globe, GlobeLock, Clock } from 'lucide-react';


const PromptDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  // const [copied, setCopied] = useState(false);

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

  if (!p) return <div className="p-4">{error || <Loader />}</div>;


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
    <div className="max-w-3xl mx-auto px-4">
      <div className="rounded-2xl bg-white shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold truncate">{p.title}</h1>
              {p.description && <p className="text-gray-600 mt-1">{p.description}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                  <Calendar size={14} className="text-gray-500" />
                  Created {createdAt}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                  <Clock size={14} className="text-gray-500" />
                  Updated {updatedAt}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/prompts/${p._id}/edit`} className="inline-flex">
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <Pencil size={16} />
                  Edit
                </Button>
              </Link>
              <Button variant="outline" className="gap-2 cursor-pointer" onClick={() => nav('/prompts')}>
                <ArrowLeft size={16} />
                Back
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1 ">
            {p.category && <Tag>{p.category}</Tag>}
            {p.folder && <Tag>{p.folder}</Tag>}
            {p.isPublic && <Tag>Public</Tag>}
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="relative whitespace-pre-wrap rounded-xl bg-white p-5 text-gray-900 shadow-sm">
            <CopyButton textToCopy={p.text} />
            {p.text}
          </div>

          <div className="mt-4">
            <Button variant="secondary" className="gap-2 cursor-pointer" onClick={togglePub}>
              {p.isPublic ? <GlobeLock size={16} /> : <Globe size={16} />}
              {p.isPublic ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
