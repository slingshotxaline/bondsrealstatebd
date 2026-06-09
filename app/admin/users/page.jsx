'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Users, ShieldCheck, ShieldOff, Trash2,
  Mail, Phone, Calendar, ChevronDown, UserPlus,
} from 'lucide-react';
import { useToast } from '@/app/components/ui/Toast';
import { adminAPI } from '@/app/lib/api';
import { ConfirmDialog, Modal } from '@/app/components/ui/Modal';
import { useAuth } from '@/app/context/AuthContext';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import EmptyState from '@/app/components/ui/EmptyState';
import Pagination from '@/app/components/ui/Pagination';


const STATUS_TABS = ['All', 'active', 'suspended'];

// ── Create Admin Modal (superadmin only) ──────────────────────────────────────
function CreateAdminModal({ open, onClose, onCreated }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast('Name, email and password are required', 'error'); return;
    }
    setLoading(true);
    try {
      await adminAPI.createAdmin(form);
      toast('Admin created successfully');
      setForm({ name: '', email: '', password: '', phone: '' });
      onCreated();
      onClose();
    } catch (err) { toast(err.message || 'Failed', 'error'); }
    finally { setLoading(false); }
  };

  const inp = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all';

  return (
    <Modal open={open} onClose={onClose} title="Create Admin Account" maxWidth="max-w-sm">
      <div className="p-6 space-y-4">
        {[
          { label: 'Full Name',  key: 'name',     type: 'text',     ph: 'Admin name' },
          { label: 'Email',      key: 'email',    type: 'email',    ph: 'admin@bonds.com' },
          { label: 'Password',   key: 'password', type: 'password', ph: 'Min. 6 characters' },
          { label: 'Phone',      key: 'phone',    type: 'text',     ph: '+880... (optional)' },
        ].map(({ label, key, type, ph }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
            <input type={type} value={form[key]} onChange={set(key)} placeholder={ph} className={inp} />
          </div>
        ))}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleCreate} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#004835] text-white text-sm font-semibold hover:bg-[#003828] disabled:opacity-60 transition-colors">
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const toast = useToast();
  const { isSuperAdmin } = useAuth();

  const [users, setUsers]           = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [statusTab, setStatusTab]   = useState('All');
  const [loading, setLoading]       = useState(true);

  const [deleteId, setDeleteId]     = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (statusTab !== 'All') params.set('status', statusTab);
      if (search)              params.set('search', search);
      const data = await adminAPI.getUsers(params.toString());
      setUsers(data.data || []);
      setPagination(data.pagination || {});
    } catch { toast('Failed to load users', 'error'); }
    finally { setLoading(false); }
  }, [page, statusTab, search]);

  useEffect(() => { fetchUsers(); }, [page, statusTab]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await adminAPI.updateUserStatus(user._id, newStatus);
      toast(`User ${newStatus}`);
      setUsers(u => u.map(x => x._id === user._id ? { ...x, status: newStatus } : x));
    } catch { toast('Failed to update status', 'error'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteUser(deleteId);
      toast('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch (err) { toast(err.message || 'Failed', 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <DashboardLayout title="Users" subtitle="Manage registered user accounts">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
          />
        </div>

        {/* Status tabs */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => { setStatusTab(s); setPage(1); }}
              className={`px-3 py-2 text-xs font-semibold capitalize transition-colors border-r border-gray-200 last:border-0
                ${statusTab === s ? 'bg-[#004835] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Create admin (superadmin only) */}
        {isSuperAdmin && (
          <button
            onClick={() => setCreateAdminOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors whitespace-nowrap"
          >
            <UserPlus size={14} /> Add Admin
          </button>
        )}
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-gray-400 mb-4">{pagination.total || 0} user{pagination.total !== 1 ? 's' : ''} found</p>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              {['User', 'Email', 'Phone', 'Joined', 'Status', 'Actions'].map((h, i) => (
                <div key={h} className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest
                  ${i === 0 ? 'col-span-3' : i === 1 ? 'col-span-3' : i === 2 ? 'col-span-2' : i === 3 ? 'col-span-2' : 'col-span-1'}`}>
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {users.map((user, i) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors"
                >
                  {/* Avatar + name */}
                  <div className="sm:col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 sm:hidden truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-3 hidden sm:flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                    <Mail size={11} className="flex-shrink-0 text-gray-300" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2 hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone size={11} className="flex-shrink-0 text-gray-300" />
                    <span>{user.phone || '—'}</span>
                  </div>

                  {/* Joined */}
                  <div className="sm:col-span-2 hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={11} className="flex-shrink-0 text-gray-300" />
                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </div>

                  {/* Status badge */}
                  <div className="sm:col-span-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border
                      ${user.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-500 border-red-200'}`}>
                      {user.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="sm:col-span-1 flex items-center gap-1.5">
                    {/* Suspend / Activate */}
                    <button
                      onClick={() => handleToggleStatus(user)}
                      title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                      className={`p-2 rounded-xl transition-colors
                        ${user.status === 'active'
                          ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {user.status === 'active' ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(user._id)}
                      title="Delete user"
                      className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
        </>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message="This will permanently delete the user and all their data. This cannot be undone."
      />

      {/* Create admin modal */}
      <CreateAdminModal
        open={createAdminOpen}
        onClose={() => setCreateAdminOpen(false)}
        onCreated={fetchUsers}
      />
    </DashboardLayout>
  );
}