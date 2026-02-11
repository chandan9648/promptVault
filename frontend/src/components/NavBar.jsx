import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LogOut, Menu, Shield, User, X } from 'lucide-react';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;
  const mobileLinkCls = ({ isActive }) => `block ${linkCls({ isActive })}`;

  const initials = (value) => {
    const s = String(value || '').trim();
    if (!s) return '?';
    const [a, b] = s.split(/\s+/).filter(Boolean);
    return `${a?.[0] || '?'}${b?.[0] || ''}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between relative">
        <Link to="/" className="inline-flex items-center gap-2 font-semibold text-lg">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border">
            <Shield size={18} />
          </span>
          <span>PromptVault</span>
        </Link>
        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {user && (
            <>
              {isAdmin ? (
                <NavLink to="/admin" className={linkCls}>Admin</NavLink>
              ) : (
                <>
                  <NavLink to="/community" className={linkCls}>Community</NavLink>
                  <NavLink to="/prompts" className={linkCls}>My Prompts</NavLink>
                  <NavLink to="/prompts/new" className={linkCls}>New</NavLink>
                </>
              )}
            </>
          )}
          {!user && (
            <>
              <NavLink to="/community" className={linkCls}>Community</NavLink>
              <NavLink to="/login" className={linkCls}>Login</NavLink>
              <NavLink to="/register" className={linkCls}>Register</NavLink>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2 ml-2">
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-2.5 py-1 text-sm text-gray-700">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 text-green-600">
                  {initials(user.name)}
                </span>
                <span className="max-w-[140px] truncate text-green-600">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-300 cursor-pointer text-red-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile dropdown */}
        {open && (
          <div
            id="mobile-menu"
            className="absolute top-14 left-0 right-0 md:hidden bg-white border border-gray-200 rounded-xl shadow-sm p-2"
          >
            <div className="flex flex-col gap-1">
              {user && (
                <>
                  {isAdmin ? (
                    <NavLink to="/admin" className={mobileLinkCls} onClick={() => setOpen(false)}>Admin</NavLink>
                  ) : (
                    <>
      
                      <NavLink to="/community" className={mobileLinkCls} onClick={() => setOpen(false)}>Community</NavLink>
                       <NavLink to="/prompts" className={mobileLinkCls} onClick={() => setOpen(false)}>My Prompts</NavLink>
                      <NavLink to="/prompts/new" className={mobileLinkCls} onClick={() => setOpen(false)}>New</NavLink>
                    </>
                  )}
                </>
              )}
              {!user && (
                <>
                  <NavLink to="/community" className={mobileLinkCls} onClick={() => setOpen(false)}>Community</NavLink>
                  <NavLink to="/login" className={mobileLinkCls} onClick={() => setOpen(false)}>Login</NavLink>
                  <NavLink to="/register" className={mobileLinkCls} onClick={() => setOpen(false)}>Register</NavLink>
                </>
              )}
              {user && (
                <div className="mt-1 border-t pt-2">
                  <div className="px-3 py-2 text-sm text-gray-700 inline-flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="truncate text-green-600">{user.name}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border text-gray-700 hover:bg-red-200 cursor-pointer text-red-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
