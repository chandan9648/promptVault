import React, { useEffect, useState } from 'react';
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
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Please log in.</p>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">You don’t have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview only — no prompt details shown.</p>
        </div>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="rounded-lg border bg-white p-4 text-gray-700">Loading stats…</div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-white p-5">
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="mt-2 text-3xl font-semibold">{stats.userCount ?? 0}</div>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <div className="text-sm text-gray-500">Shared Prompts (Public)</div>
              <div className="mt-2 text-3xl font-semibold">{stats.sharedPromptCount ?? 0}</div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-gray-600 mt-1">Email + how many public prompts they shared.</p>

          {usersLoading && (
            <div className="mt-3 rounded-lg border bg-white p-4 text-gray-700">Loading users…</div>
          )}

          {!usersLoading && usersError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {usersError}
            </div>
          )}

          {!usersLoading && !usersError && (
            <div className="mt-3 overflow-hidden rounded-lg border bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left font-medium px-4 py-3">Email</th>
                    <th className="text-left font-medium px-4 py-3">Name</th>
                    <th className="text-right font-medium px-4 py-3">Shared Prompts</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-gray-600">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id || u.email} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{u.email}</td>
                        <td className="px-4 py-3 text-gray-700">{u.name || '-'}</td>
                        <td className="px-4 py-3 text-right font-medium">{u.sharedPromptCount ?? 0}</td>
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