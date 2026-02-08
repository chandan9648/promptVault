import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiBarChart2,
  FiShield,
  FiTrash2,
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
  const [actionError, setActionError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const initialsFrom = (value) => {
    const source = String(value || '').trim();
    if (!source) return '?';
    const [first, second] = source
      .replace(/[^a-zA-Z0-9\s@._-]/g, '')
      .split(/\s+|\.|@|_/)
      .filter(Boolean);
    return `${(first || '?')[0]}${(second || '')[0] || ''}`.toUpperCase();
  };

  const handleDeleteUser = async (u) => {
    setActionError(null);
    const id = u?._id;
    if (!id) {
      setActionError('Missing user id; cannot delete.');
      return;
    }

    const sharedToRemove = Number.isFinite(Number(u?.sharedPromptCount))
      ? Number(u.sharedPromptCount)
      : 0;

    const ok = window.confirm(
      `Delete user ${u?.email || ''}?\n\nThis will permanently delete the user and all prompts they own.`
    );
    if (!ok) return;

    try {
      setDeletingUserId(id);
      await api.adminDeleteUser(id);
      setUsers((prev) => prev.filter((x) => x?._id !== id));
      setStats((prev) => {
        if (!prev) return prev;
        const nextUserCount = Math.max(0, (prev.userCount ?? 0) - 1);
        const nextShared = Math.max(0, (prev.sharedPromptCount ?? 0) - sharedToRemove);
        return { ...prev, userCount: nextUserCount, sharedPromptCount: nextShared };
      });
    } catch (e) {
      const message = e?.data?.message || 'Failed to delete user';
      setActionError(message);
    } finally {
      setDeletingUserId(null);
    }
  };

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
            <p className="text-gray-600 mt-1">
              Overview only — no prompt details shown.
              <span className="ml-2 text-gray-500">Signed in as {user?.email}</span>
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
          <FiShield className="text-gray-500" />
          Role: Admin
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
                  <div className="mt-1 text-xs text-gray-500">All registered accounts.</div>
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
                  <div className="mt-1 text-xs text-gray-500">Total public prompt shares.</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <FiBarChart2 size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiUser className="text-gray-500" />
                  Users
                </h2>
                <p className="text-sm text-gray-600 mt-1">Email + how many public prompts they shared.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                <FiUsers className="text-gray-500" />
                {usersLoading ? 'Loading…' : `${users.length} total`}
              </div>
            </div>

            {usersLoading && (
              <div className="px-5 py-5">
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gray-100" />
                        <div>
                          <div className="h-3 w-56 rounded bg-gray-100" />
                          <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
                        </div>
                      </div>
                      <div className="h-7 w-16 rounded-full bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!usersLoading && usersError && (
              <div className="px-5 py-5">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle />
                    <span>{usersError}</span>
                  </div>
                </div>
              </div>
            )}

            {!usersLoading && !usersError && (
              <div className="overflow-x-auto">
                {actionError && (
                  <div className="px-5 pt-5">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                      <div className="flex items-center gap-2">
                        <FiAlertCircle />
                        <span>{actionError}</span>
                      </div>
                    </div>
                  </div>
                )}
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left font-semibold uppercase tracking-wide text-xs px-5 py-3">User</th>
                      <th className="text-left font-semibold uppercase tracking-wide text-xs px-5 py-3">Name</th>
                      <th className="text-right font-semibold uppercase tracking-wide text-xs px-5 py-3">Shared</th>
                      <th className="text-right font-semibold uppercase tracking-wide text-xs px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-gray-600">
                          <div className="flex items-center justify-center gap-2">
                            <FiAlertCircle />
                            <span>No users found.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((u, idx) => (
                        <tr
                          key={u._id || u.email}
                          className={idx % 2 === 1 ? 'bg-gray-50/50 hover:bg-gray-50' : 'hover:bg-gray-50'}
                        >
                          <td className="px-5 py-3 text-gray-900">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                                {initialsFrom(u.name || u.email)}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-medium text-gray-900">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-700">{u.name || '-'}</td>
                          <td className="px-5 py-3 text-right">
                            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800">
                              {u.sharedPromptCount ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              disabled={deletingUserId === u._id}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                              aria-label={`Delete ${u.email}`}
                            >
                              <FiTrash2 />
                              {deletingUserId === u._id ? 'Deleting…' : 'Delete'}
                            </button>
                          </td>
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
    </div>
  );
};

export default AdminDashboard;