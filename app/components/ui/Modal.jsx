'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

// ── Generic Modal ─────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
          >
            <div className="h-0.5 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C]" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, danger = true, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
            <AlertTriangle size={18} className={danger ? 'text-red-500' : 'text-amber-500'} />
          </div>
          <p className="text-sm text-gray-600 pt-2">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60
              ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#004835] hover:bg-[#003828]'}`}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Reject Modal ──────────────────────────────────────────────────────────────
export function RejectModal({ open, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('');
  return (
    <Modal open={open} onClose={onClose} title="Reject Property" maxWidth="max-w-sm">
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-500">Please provide a reason for rejection. This will be sent to the property owner.</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Images do not match the property description"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 resize-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onConfirm(reason)} disabled={loading || !reason.trim()} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60 transition-colors">
            {loading ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

