'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Trash2, Pencil, Eye, EyeOff,
  X, Upload, Loader2, ChevronUp, ChevronDown,
} from 'lucide-react';
import { useToast } from '@/app/components/ui/Toast';
import { ConfirmDialog } from '@/app/components/ui/Modal';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { Modal } from './../../components/ui/Modal';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bonds_token');
  const res   = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const PALETTES = [
  { id: 1, label: 'Dark Green',  bg: '#0d3d2f', fig: '#004835' },
  { id: 2, label: 'Purple',      bg: '#2d1b4e', fig: '#c084fc' },
  { id: 3, label: 'Blue',        bg: '#0a2540', fig: '#60a5fa' },
  { id: 4, label: 'Pink',        bg: '#3b1f2b', fig: '#f9a8d4' },
  { id: 5, label: 'Light Green', bg: '#1a2e1a', fig: '#86efac' },
  { id: 6, label: 'Amber',       bg: '#1a1a2e', fig: '#f59e0b' },
  { id: 7, label: 'Red',         bg: '#2d1515', fig: '#f87171' },
  { id: 8, label: 'Cyan',        bg: '#0f2027', fig: '#67e8f9' },
];

const EMPTY_FORM = {
  name: '', designation: '', quote: '', gender: 'male',
  paletteId: 1, isVisible: true, order: 0,
};

function MiniSilhouette({ bg, fig }) {
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <rect width="200" height="220" fill={bg} />
      <circle cx="100" cy="76" r="38" fill={fig} opacity="0.85" />
      <ellipse cx="100" cy="185" rx="66" ry="48" fill={fig} opacity="0.85" />
    </svg>
  );
}

function TagsEditor({ tags, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const t = input.trim();
    if (!t || tags.includes(t)) return;
    onChange([...tags, t]);
    setInput('');
  };
  const remove = (t) => onChange(tags.filter(x => x !== t));

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
        Profile Tags
      </label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#004835]/8 text-[#004835] text-xs font-semibold border border-[#004835]/15">
            {t}
            <button onClick={() => remove(t)} className="hover:text-red-500 transition-colors">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Type tag and press Enter"
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
        />
        <button
          onClick={add}
          className="px-3 py-2 bg-[#004835] text-white text-xs font-semibold rounded-xl hover:bg-[#003828] transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function MemberFormModal({ open, onClose, onSaved, editMember }) {
  const toast    = useToast();
  const photoRef = useRef();

  const [form,         setForm]         = useState(EMPTY_FORM);
  const [tags,         setTags]         = useState(['Leadership', 'Strategy', 'Impact', 'Enterprise']);
  const [photo,        setPhoto]        = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [removePhoto,  setRemovePhoto]  = useState(false);
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    if (editMember) {
      setForm({
        name:        editMember.name        || '',
        designation: editMember.designation || '',
        quote:       editMember.quote       || '',
        gender:      editMember.gender      || 'male',
        paletteId:   editMember.paletteId   || 1,
        isVisible:   editMember.isVisible   ?? true,
        order:       editMember.order       || 0,
      });
      setTags(editMember.tags || ['Leadership', 'Strategy', 'Impact', 'Enterprise']);
      setPhotoPreview(editMember.photo?.url || null);
      setRemovePhoto(false);
    } else {
      setForm(EMPTY_FORM);
      setTags(['Leadership', 'Strategy', 'Impact', 'Enterprise']);
      setPhoto(null);
      setPhotoPreview(null);
      setRemovePhoto(false);
    }
  }, [editMember, open]);

  const set      = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setCheck = k => e => setForm(f => ({ ...f, [k]: e.target.checked }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setRemovePhoto(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast('Name is required', 'error'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('tags', JSON.stringify(tags));
      if (removePhoto) fd.append('removePhoto', 'true');
      if (photo)       fd.append('photo', photo);

      if (editMember) {
        await authFetch(`/admin/team/${editMember._id}`, { method: 'PUT', body: fd });
        toast('Team member updated');
      } else {
        await authFetch('/admin/team', { method: 'POST', body: fd });
        toast('Team member added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast(err.message || 'Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedPalette = PALETTES.find(p => p.id === Number(form.paletteId)) || PALETTES[0];

  const Inp = ({ label, ...props }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
      />
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={editMember ? 'Edit Team Member' : 'Add Team Member'} maxWidth="max-w-2xl">
      <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">

        {/* Name + Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Inp label="Full Name *" value={form.name} onChange={set('name')} placeholder="e.g. Mr. Mahfuzul Haq" />
          <Inp label="Designation" value={form.designation} onChange={set('designation')} placeholder="e.g. Chairman" />
        </div>

        {/* Quote / Bio */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Bio / Quote</label>
          <textarea
            value={form.quote}
            onChange={set('quote')}
            rows={4}
            placeholder="Short biography or leadership quote..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 resize-none transition-all"
          />
        </div>

        {/* Gender + Order + Visibility */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Gender</label>
            <select
              value={form.gender}
              onChange={set('gender')}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#004835] appearance-none transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Inp label="Display Order" type="number" value={form.order} onChange={set('order')} placeholder="0" min="0" />
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2.5">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={setCheck('isVisible')}
                className="w-4 h-4 accent-[#004835]"
              />
              <span className="text-sm font-medium text-gray-700">Visible</span>
            </label>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Palette picker */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Avatar Color Palette{' '}
            <span className="text-gray-300 normal-case font-normal">(used when no photo)</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {PALETTES.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm(f => ({ ...f, paletteId: p.id }))}
                title={p.label}
                className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square
                  ${Number(form.paletteId) === p.id
                    ? 'border-[#004835] scale-110 shadow-md'
                    : 'border-transparent hover:border-gray-300'}`}
              >
                <MiniSilhouette bg={p.bg} fig={p.fig} />
                {Number(form.paletteId) === p.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
                      <svg className="w-3 h-3 text-[#004835]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Selected: <span className="font-medium text-gray-600">{selectedPalette.label}</span>
          </p>
        </div>

        <hr className="border-gray-100" />

        {/* Tags */}
        <TagsEditor tags={tags} onChange={setTags} />

        <hr className="border-gray-100" />

        {/* Photo */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Photo{' '}
            <span className="text-gray-300 normal-case font-normal">
              (optional — silhouette avatar used if empty)
            </span>
          </label>

          {photoPreview ? (
            <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-gray-200">
              <img src={photoPreview} alt="" className="w-full h-full object-cover object-top" />
              {photo && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#004835] text-white text-[9px] font-bold rounded-full">
                  New
                </div>
              )}
              <div className="absolute top-1.5 right-1.5 flex gap-1">
                <button
                  onClick={() => photoRef.current.click()}
                  className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  title="Replace photo"
                >
                  <Pencil size={10} className="text-gray-600" />
                </button>
                <button
                  onClick={clearPhoto}
                  className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  title="Remove photo"
                >
                  <X size={10} className="text-gray-600" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => photoRef.current.click()}
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#004835]/50 hover:bg-[#004835]/2 transition-colors"
            >
              <Upload size={18} className="text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">Click to upload photo</p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP — max 5MB. Face will be auto-cropped.</p>
              </div>
            </button>
          )}
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#004835] text-white text-sm font-semibold hover:bg-[#003828] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Saving...' : editMember ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminTeamPage() {
  const toast = useToast();

  const [members,    setMembers]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [formOpen,   setFormOpen]   = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authFetch('/admin/team');
      setMembers(data.members || []);
    } catch { toast('Failed to load team', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await authFetch(`/admin/team/${deleteId}`, { method: 'DELETE' });
      toast('Team member deleted');
      setDeleteId(null);
      fetchMembers();
    } catch { toast('Failed', 'error'); }
    finally { setDeleting(false); }
  };

  const handleToggleVisibility = async (id) => {
    try {
      const data = await authFetch(`/admin/team/${id}/toggle-visibility`, { method: 'PATCH' });
      toast(data.message);
      setMembers(prev => prev.map(m => m._id === id ? data.member : m));
    } catch { toast('Failed', 'error'); }
  };

  const handleMove = async (id, direction) => {
    const idx = members.findIndex(m => m._id === id);
    if (direction === 'up'   && idx === 0)                  return;
    if (direction === 'down' && idx === members.length - 1) return;

    const swapIdx   = direction === 'up' ? idx - 1 : idx + 1;
    const reordered = [...members];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

    const orderPayload = reordered.map((m, i) => ({ id: m._id, order: i }));
    setMembers(reordered.map((m, i) => ({ ...m, order: i })));

    try {
      await authFetch('/admin/team/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ order: orderPayload }),
      });
    } catch {
      toast('Failed to save order', 'error');
      fetchMembers();
    }
  };

  const openEdit = (m) => { setEditMember(m); setFormOpen(true); };
  const openNew  = ()  => { setEditMember(null); setFormOpen(true); };

  const PALETTES_MAP = Object.fromEntries(PALETTES.map(p => [p.id, p]));

  return (
    <DashboardLayout title="Management Team" subtitle="Add, edit and reorder team members shown publicly">

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors shadow-sm"
        >
          <Plus size={15} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-500 font-medium mb-1">No team members yet</p>
          <p className="text-sm text-gray-400 mb-5">Add your management team to showcase them publicly</p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors"
          >
            <Plus size={14} /> Add First Member
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            {['Member', 'Designation', 'Avatar Preview', 'Visible', 'Order', 'Actions'].map((h, i) => (
              <div
                key={h}
                className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest
                  ${i === 0 ? 'col-span-3' : i === 1 ? 'col-span-3' : i === 2 ? 'col-span-2' : 'col-span-1'}`}
              >
                {h}
              </div>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {members.map((m, i) => {
              const pal = PALETTES_MAP[m.paletteId] || PALETTES[0];
              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors"
                >
                  {/* Member */}
                  <div className="sm:col-span-3 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {m.photo?.url ? (
                        <img src={m.photo.url} alt={m.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <MiniSilhouette bg={pal.bg} fig={pal.fig} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate sm:hidden">{m.designation || '—'}</p>
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="sm:col-span-3 hidden sm:block text-xs text-gray-500 truncate">
                    {m.designation || <span className="text-gray-300 italic">No designation</span>}
                  </div>

                  {/* Palette preview */}
                  <div className="sm:col-span-2 hidden sm:flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <MiniSilhouette bg={pal.bg} fig={pal.fig} />
                    </div>
                    <span className="text-xs text-gray-400">{pal.label}</span>
                  </div>

                  {/* Visibility */}
                  <div className="sm:col-span-1">
                    <button
                      onClick={() => handleToggleVisibility(m._id)}
                      title={m.isVisible ? 'Visible — click to hide' : 'Hidden — click to show'}
                      className={`p-2 rounded-xl transition-colors
                        ${m.isVisible
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {m.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>

                  {/* Order */}
                  <div className="sm:col-span-1 hidden sm:flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMove(m._id, 'up')}
                      disabled={i === 0}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    ><ChevronUp size={13} /></button>
                    <button
                      onClick={() => handleMove(m._id, 'down')}
                      disabled={i === members.length - 1}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    ><ChevronDown size={13} /></button>
                  </div>

                  {/* Actions */}
                  <div className="sm:col-span-2 flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(m)}
                      className="p-2 rounded-xl bg-[#004835]/8 text-[#004835] hover:bg-[#004835]/15 transition-colors"
                    ><Pencil size={14} /></button>
                    <button
                      onClick={() => setDeleteId(m._id)}
                      className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                    ><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
        <ChevronUp size={12} /><ChevronDown size={12} />
        Use the up/down arrows to reorder how members appear on the public page.
      </p>

      <MemberFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchMembers}
        editMember={editMember}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Team Member"
        message="This will permanently delete this team member and their photo. This cannot be undone."
      />
    </DashboardLayout>
  );
}