import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => (
  <label className="block">
    {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
    <input className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />
    {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
  </label>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
  <label className="block">
    {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
    <textarea className={`w-full rounded-md border border-gray-300 px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />
    {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
  </label>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${variants[variant] || ''} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Tag = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 mr-1 mb-1">{children}</span>
);

// Lightweight custom Select to avoid native dropdown overflow on mobile
export const Select = ({ value, onChange, options = [], placeholder = 'Select…', className = '' }) => {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value)?.label || placeholder;
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="block truncate">{selected}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {options.map((o) => (
            <li
              key={o.value ?? o.label}
              role="option"
              aria-selected={o.value === value}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${o.value === value ? 'bg-blue-50' : ''}`}
              onClick={() => { onChange?.(o.value); setOpen(false); }}
            >
              <span className="block truncate">{o.label}</span>
            </li>
          ))}
        </ul>
      )}
      {open && (
        <button aria-label="Close" className="fixed inset-0 z-20 cursor-default" onClick={() => setOpen(false)} />
      )}
    </div>
  );
};
