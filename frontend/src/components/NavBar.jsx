import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const NavBar = () => {
  const { user, logout } = useAuth();
  const linkCls = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`;
  return (
    <header className="border-b bg-white sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">PromptVault</Link>
        <nav className="flex items-center gap-2">
          {user && (
            <>
              <NavLink to="/prompts" className={linkCls}>My Prompts</NavLink>
              <NavLink to="/community" className={linkCls}>Community</NavLink>
              <NavLink to="/prompts/new" className={linkCls}>New</NavLink>
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
              <span className="text-sm text-gray-600">{user.name}</span>
              <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
