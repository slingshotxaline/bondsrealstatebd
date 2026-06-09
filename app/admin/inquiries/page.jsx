'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Building2, Mail, Phone, Clock, ChevronDown, Filter, X, Save } from 'lucide-react';
import { useToast } from '@/app/components/ui/Toast';
import { adminAPI } from '@/app/lib/api';
import { Modal } from '@/app/components/ui/Modal';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import EmptyState from '@/app/components/ui/EmptyState';
import Pagination from '@/app/components/ui/Pagination';


const STATUS_OPTIONS  = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
const TYPE_OPTIONS    = ['All', 'General', 'Purchase', 'Visit'];

const STATUS_STYLES = {
  Open:          'bg-blue-50 text-blue-600 border-blue-200',
  'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
  Resolved:      'bg-emerald-50 text-emerald-600 border-emerald-200',
  Closed:        'bg-gray-50 text-gray-500 border-gray-200',
};
const TYPE_STYLES = {
  General:  'bg-purple-50 text-purple-600',
  Purchase: 'bg-[#004835]/8 text-[#004835]',
  Visit:    'bg-[#C89A6C]/15 text-[#8B6035]',
};

// ── Detail / Edit Modal ───────────────────────────────────────────────────────
function InquiryDetailModal({ inquiry, open, onClose, onUpdated }) {
  const toast = useToast();
  const [status, setStatus]     = useState(inquiry?.status || 'Open');
  const [notes, setNotes]       = useState(inquiry?.adminNotes || '');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setNotes(inquiry.adminNotes || '');
    }
  }, [inquiry]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateInquiry(inquiry._id, { status, adminNotes: notes });
      toast('Inquiry updated');
      onUpdated({ ...inquiry, status, adminNotes: notes });
      onClose();
    } catch { toast('Failed to update', 'error'); }
    finally { setSaving(false); }
  };

  if (!inquiry) return null;

  return (
    <Modal open={open} onClose={onClose} title="Inquiry Details" maxWidth="max-w-lg">
      <div className="p-6 space-y-5">
        {/* Inquiry info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 p-3.5 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-0.5">Property</p>
            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{inquiry.property?.title || '—'}</p>
            <p className="text-xs text-gray-400">{inquiry.property?.city}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-0.5">From</p>
            <p className="text-sm font-semibold text-gray-800">{inquiry.name}</p>
            <p className="text-xs text-gray-400 truncate">{inquiry.email}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-0.5">Type &amp; Date</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_STYLES[inquiry.inquiryType] || ''}`}>
              {inquiry.inquiryType}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Message</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3.5 leading-relaxed">{inquiry.message}</p>
        </div>

        {/* Status update */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Update Status</p>
          <div className="grid grid-cols-2 gap-2">
            {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all
                  ${status === s ? 'bg-[#004835] text-white border-[#004835]' : 'border-gray-200 text-gray-500 hover:border-[#004835]/30'}`}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Admin notes */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Admin Notes</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add internal notes visible to admins only..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 resize-none transition-all"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#004835] text-white text-sm font-semibold hover:bg-[#003828] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <Save size={13} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminInquiriesPage() {
  const toast = useToast();

  const [inquiries, setInquiries]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage]             = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter]     = useState('All');
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (typeFilter   !== 'All') params.set('inquiryType', typeFilter);
      const data = await adminAPI.getInquiries(params.toString());
      setInquiries(data.data || []);
      setPagination(data.pagination || {});
    } catch { toast('Failed to load inquiries', 'error'); }
    finally { setLoading(false); }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => { fetchInquiries(); }, [page, statusFilter, typeFilter]);

  const handleUpdated = (updated) => {
    setInquiries(list => list.map(x => x._id === updated._id ? updated : x));
  };

  return (
    <DashboardLayout title="Inquiries" subtitle="Review and respond to all property inquiries">

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter size={14} className="text-gray-400" />

        {/* Status */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 text-xs font-semibold transition-colors border-r border-gray-200 last:border-0
                ${statusFilter === s ? 'bg-[#004835] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Type */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
          {TYPE_OPTIONS.map(t => (
            <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
              className={`px-3 py-2 text-xs font-semibold transition-colors border-r border-gray-200 last:border-0
                ${typeFilter === t ? 'bg-[#004835] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {!loading && (
          <span className="ml-auto text-xs text-gray-400">{pagination.total || 0} inquiries</span>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No inquiries found" message="Try adjusting your filters." />
      ) : (
        <>
          <div className="space-y-3">
            {inquiries.map((inq, i) => (
              <motion.div
                key={inq._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(inq)}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#004835]/20 hover:shadow-sm cursor-pointer transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${TYPE_STYLES[inq.inquiryType] || 'bg-gray-50 text-gray-500'}`}>
                    <MessageSquare size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        {/* Property */}
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Building2 size={11} className="text-gray-300 flex-shrink-0" />
                          <p className="text-xs text-gray-400 truncate">{inq.property?.title || 'Unknown property'}</p>
                        </div>
                        {/* Sender */}
                        <p className="text-sm font-semibold text-gray-900">{inq.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail size={10} />{inq.email}
                          </span>
                          {inq.phone && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone size={10} />{inq.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[inq.status] || ''}`}>
                          {inq.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${TYPE_STYLES[inq.inquiryType] || ''}`}>
                          {inq.inquiryType}
                        </span>
                      </div>
                    </div>

                    {/* Message preview */}
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">{inq.message}</p>

                    {/* Admin notes */}
                    {inq.adminNotes && (
                      <p className="text-xs text-[#004835] bg-[#004835]/5 px-2.5 py-1.5 rounded-lg mt-2 line-clamp-1">
                        📝 {inq.adminNotes}
                      </p>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                      <Clock size={10} />
                      {new Date(inq.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
        </>
      )}

      {/* Detail modal */}
      <InquiryDetailModal
        inquiry={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />
    </DashboardLayout>
  );
}