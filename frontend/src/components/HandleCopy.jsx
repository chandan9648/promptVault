import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={handleCopy}
        className="text-gray-600 hover:text-black transition flex items-center cursor-pointer "
        
      >
        <FiCopy size={20} />
      </button>

      {copied && (
        <span className="absolute -top-7 -right-4 text-xs text-green-600 font-medium">
          Copied!
        </span>
      )}
    </div>
  );
};

export default CopyButton;
