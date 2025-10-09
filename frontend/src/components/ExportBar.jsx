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
    const data = await api.exportJson(selectedIds);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'prompts.json');
  };

  const exportPdf = async () => {
    const res = await api.exportPdf(selectedIds);
    downloadBlob(res.data, 'prompts.pdf');
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
    <div className="flex gap-2 items-center">
      <Button variant="secondary" disabled={disabled} onClick={exportJson}>Export JSON</Button>
      <Button variant="secondary" disabled={disabled} onClick={exportPdf}>Export PDF</Button>
      <Button variant="secondary" disabled={disabled} onClick={exportNotion}>Export Notion</Button>
    </div>
  );
};

export default ExportBar;
