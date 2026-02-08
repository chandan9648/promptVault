import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiBarChart2,
  FiShield,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { api } from '../lib/api';
import { useAuth } from '../context/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.adminStats();
        if (mounted) setStats(data);
      } catch (e) {
        const message = e?.data?.message || 'Failed to load admin stats';
        if (mounted) setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const data = await api.adminUsersSummary();
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        const message = e?.data?.message || 'Failed to load users summary';
        if (mounted) setUsersError(message);
      } finally {
        if (mounted) setUsersLoading(false);
      }
    };

    if (user?.role === 'admin') {
      load();
      loadUsers();
    } else {
      setLoading(false);
      setUsersLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [user?.role]);

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
            <FiShield />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Please log in.</p>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-700">
            <FiAlertCircle />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">You don’t have access to this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <FiShield />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview only — no prompt details shown.</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          System Healthy
        </div>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="rounded-xl border bg-white p-4 text-gray-700 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
              Loading stats…
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            <div className="flex items-center gap-2">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Total Users</div>
                  <div className="mt-2 text-3xl font-semibold">{stats.userCount ?? 0}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <FiUsers size={20} />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Shared Prompts (Public)</div>
                  <div className="mt-2 text-3xl font-semibold">{stats.sharedPromptCount ?? 0}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <FiBarChart2 size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiUser className="text-gray-500" />
                Users
              </h2>
              <p className="text-sm text-gray-600 mt-1">Email + how many public prompts they shared.</p>
            </div>
            <div className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-600">
              {users.length} total
            </div>
          </div>

          {usersLoading && (
            <div className="mt-3 rounded-xl border bg-white p-4 text-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                Loading users…
              </div>
            </div>
          )}

          {!usersLoading && usersError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
              <div className="flex items-center gap-2">
                <FiAlertCircle />
                <span>{usersError}</span>
              </div>
            </div>
          )}

          {!usersLoading && !usersError && (
            <div className="mt-3 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left font-semibold uppercase tracking-wide text-xs px-4 py-3">Email</th>
                    <th className="text-left font-semibold uppercase tracking-wide text-xs px-4 py-3">Name</th>
                    <th className="text-right font-semibold uppercase tracking-wide text-xs px-4 py-3">Shared Prompts</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiAlertCircle />
                          <span>No users found.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id || u.email} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{u.email}</td>
                        <td className="px-4 py-3 text-gray-700">{u.name || '-'}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{u.sharedPromptCount ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;