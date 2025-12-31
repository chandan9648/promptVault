import React from 'react';
import { Button } from './ui';
import { api } from '../lib/api';

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

const ExportBar = ({ selectedIds = [] }) => {
  const disabled = selectedIds.length === 0;

  const exportJson = async () => {
    try {
      const data = await api.exportJson(selectedIds);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadBlob(blob, 'prompts.json');
    } catch (e) {
      const msg = e?.data?.message || e?.message || 'Failed to export JSON';
      alert(msg);
    }
  };

  const exportPdf = async () => {
    try {
      const res = await api.exportPdf(selectedIds);
      // When successful, res.data should be a Blob (application/pdf)
      // If server returns an error, our interceptor will normalize it and throw instead
      
      downloadBlob(res.data, 'prompts.pdf');
    } catch (e) {
      // If interceptor couldn't parse, try to read blob text fallback
      let msg = e?.data?.message || e?.message || 'Failed to export PDF';
      // Some servers return Blob error bodies
      if (!e?.data?.message && e?.data instanceof Blob) {
        try {
          const text = await e.data.text();
          const j = JSON.parse(text);
          msg = j?.message || msg;
        } catch {
          /* no-op */
        }
      }
      alert(msg);
    }
  };

  const exportNotion = async () => {
    try {
      await api.exportNotion(selectedIds);
      alert('Exported to Notion');
    } catch (e) {
      alert(e?.data?.message || 'Failed to export to Notion');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button className='cursor-pointer' variant="secondary" disabled={disabled} onClick={exportJson}>Export JSON</Button>
      <Button className='cursor-pointer' variant="secondary" disabled={disabled} onClick={exportPdf}>Export PDF</Button>
      <Button className='cursor-pointer' variant="secondary" disabled={disabled} onClick={exportNotion}>Export Notion</Button>
    </div>
  );
};

export default ExportBar;
