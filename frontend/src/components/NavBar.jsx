import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const linkCls = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`;
  const mobileLinkCls = ({ isActive }) => `block ${linkCls({ isActive })}`;
  return (
    <header className=" shadow-sm bg-gray- sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between relative">
        <Link to="/" className="font-semibold text-lg"><span className='bg-gray-500 p-1 rounded-md text-white text-center pt-0 pr-1 pl-1 mr-1'> P </span> PromptVault</Link>
        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          {/* Icon: hamburger / close */}
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
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
            <div className="flex items-center gap-3 ml-2">
              <span className="text-bold  text-green-600">👋{user.name}</span>
              <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium bg-red-400 hover:bg-red-500 cursor-pointer">Logout</button>

            </div>
          )}
        </nav>

        {/* Mobile dropdown */}
        {open && (
          <div
            id="mobile-menu"
            className="absolute top-14 left-0 right-0 md:hidden bg-white border border-gray-200 rounded-md shadow-lg p-2"
          >
            <div className="flex flex-col gap-1">
              {user && (
                <>
                  {isAdmin ? (
                    <NavLink to="/admin" className={mobileLinkCls} onClick={() => setOpen(false)}>Admin</NavLink>
                  ) : (
                    <>
                      <NavLink to="/prompts" className={mobileLinkCls} onClick={() => setOpen(false)}>My Prompts</NavLink>
                      <NavLink to="/community" className={mobileLinkCls} onClick={() => setOpen(false)}>Community</NavLink>
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
                  <div className="px-3 py-2 text-sm text-gray-700">👋 {user.name}</div>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-red-400 hover:bg-red-500 text-white"
                  >
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
