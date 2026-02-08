import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={(e) => {
          e.stopPropagation?.();
          handleCopy();
        }}
        className="inline-flex items-center justify-center rounded-lg border bg-white/90 p-2 text-gray-700 shadow-sm hover:bg-gray-50"
        aria-label={copied ? 'Copied' : 'Copy'}
      >
        {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
      </button>
    </div>
  );
};

export default CopyButton;
