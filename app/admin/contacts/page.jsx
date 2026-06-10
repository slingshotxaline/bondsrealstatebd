"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Search,
  Trash2,
  Eye,
  Filter,
  Clock,
  CheckCircle,
  MessageSquare,
  Archive,
  Save,
  X,
} from "lucide-react";
import { useToast } from "@/app/components/ui/Toast";
import { ConfirmDialog, Modal } from "@/app/components/ui/Modal";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import EmptyState from "@/app/components/ui/EmptyState";
import Pagination from "@/app/components/ui/Pagination";
import { adminAPI } from "@/app/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("bonds_token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  Unread: {
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: Mail,
  },
  Read: { color: "text-gray-500", bg: "bg-gray-50 border-gray-200", icon: Eye },
  Replied: {
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
  },
  Archived: {
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: Archive,
  },
};

const SERVICE_LABELS = {
  buy: "Property Buying",
  sell: "Property Selling",
  rent: "Rental & Leasing",
  invest: "Investment Consulting",
  "": "General",
};

const STATUS_FILTERS = ["All", "Unread", "Read", "Replied", "Archived"];

// ── Detail Modal ──────────────────────────────────────────────────────────────
function ContactDetailModal({ contact, open, onClose, onUpdated }) {
  const toast = useToast();
  const [status, setStatus] = useState(contact?.status || "Read");
  const [adminNotes, setAdminNotes] = useState(contact?.adminNotes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setStatus(contact.status);
      setAdminNotes(contact.adminNotes || "");
    }
  }, [contact]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await adminAPI.updateContact(contact._id, {
        status,
        adminNotes,
      });
      toast("Contact updated");
      onUpdated(data.contact);
      onClose();
    } catch {
      toast("Failed to update", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!contact) return null;
  const cfg = STATUS_CFG[contact.status] || STATUS_CFG.Read;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Contact Message"
      maxWidth="max-w-lg"
    >
      <div className="p-6 space-y-5">
        {/* Sender info */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/60 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            {contact.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900">{contact.name}</p>
            <div className="flex flex-wrap gap-3 mt-1">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#004835] transition-colors"
              >
                <Mail size={11} />
                {contact.email}
              </a>
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#004835] transition-colors"
                >
                  <Phone size={11} />
                  {contact.phone}
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}
            >
              {contact.status}
            </span>
            {contact.service && contact.service !== "" && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#004835]/8 text-[#004835] border border-[#004835]/15">
                {SERVICE_LABELS[contact.service]}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Message
          </p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-line">
            {contact.message}
          </p>
        </div>

        {/* Date */}
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={11} />
          {new Date(contact.createdAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Status update */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Update Status
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["Read", "Replied", "Archived", "Unread"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all
                  ${
                    status === s
                      ? "bg-[#004835] text-white border-[#004835]"
                      : "border-gray-200 text-gray-500 hover:border-[#004835]/30"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Admin notes */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Admin Notes
          </p>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Add internal notes..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 resize-none transition-all"
          />
        </div>

        {/* Reply shortcut */}
        <a
          href={`mailto:${contact.email}?subject=Re: Your message to BONDS Real Estate`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#004835]/8 text-[#004835] text-sm font-semibold rounded-xl hover:bg-[#004835]/15 transition-colors border border-[#004835]/15"
        >
          <Mail size={14} />
          Reply via Email
        </a>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#004835] text-white text-sm font-semibold hover:bg-[#003828] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminContactsPage() {
  const toast = useToast();

  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (status !== "All") params.set("status", status);
      if (search) params.set("search", search);
      const data = await adminAPI.getContacts(params.toString());
      setContacts(data.data || []);
      setPagination(data.pagination || {});
      setUnreadCount(data.unreadCount || 0);
    } catch {
      toast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchContacts();
  }, [page, status]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchContacts();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleUpdated = (updated) => {
    setContacts((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
    if (updated.status !== "Unread") {
      setUnreadCount((n) => Math.max(0, n - 1));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteContact(deleteId);
      toast('Message deleted');
      setDeleteId(null);
      fetchContacts();
    } catch { toast('Failed to delete', 'error'); }
    finally { setDeleting(false); }
  };
  
  const openContact = (contact) => {
    // Optimistically mark as Read in local state
    if (contact.status === "Unread") {
      setContacts((prev) =>
        prev.map((c) => (c._id === contact._id ? { ...c, status: "Read" } : c))
      );
      setUnreadCount((n) => Math.max(0, n - 1));
    }
    setSelected(contact);
  };

  return (
    <DashboardLayout
      title="Contact Messages"
      subtitle={
        unreadCount > 0
          ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
          : "All messages read"
      }
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or message..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white flex-shrink-0">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-2 text-xs font-semibold transition-colors border-r border-gray-200 last:border-0 relative
                ${
                  status === s
                    ? "bg-[#004835] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              {s}
              {/* Unread badge on "All" and "Unread" tabs */}
              {s === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-gray-400 mb-4">
          {pagination.total || 0} message{pagination.total !== 1 ? "s" : ""}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages found"
          message="Contact messages from your website will appear here."
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {contacts.map((contact, i) => {
              const cfg = STATUS_CFG[contact.status] || STATUS_CFG.Read;
              const StatusIcon = cfg.icon;
              const isUnread = contact.status === "Unread";

              return (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50/80
                    ${isUnread ? "bg-blue-50/30" : ""}`}
                  onClick={() => openContact(contact)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {contact.name?.[0]?.toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              isUnread ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {contact.name}
                          </p>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail size={10} />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone size={10} />
                              {contact.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right badges + actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}
                        >
                          <StatusIcon size={9} />
                          {contact.status}
                        </span>
                        {contact.service && contact.service !== "" && (
                          <span className="hidden sm:block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#004835]/8 text-[#004835] border border-[#004835]/15">
                            {SERVICE_LABELS[contact.service]}
                          </span>
                        )}
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(contact._id);
                          }}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Message preview */}
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">
                      {contact.message}
                    </p>

                    {/* Admin notes */}
                    {contact.adminNotes && (
                      <p className="text-xs text-[#004835] bg-[#004835]/5 px-2.5 py-1 rounded-lg mt-1.5 line-clamp-1">
                        📝 {contact.adminNotes}
                      </p>
                    )}

                    {/* Date */}
                    <p className="text-[10px] text-gray-300 mt-1.5 flex items-center gap-1">
                      <Clock size={9} />
                      {new Date(contact.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPage={setPage}
          />
        </>
      )}

      {/* Detail modal */}
      <ContactDetailModal
        contact={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Message"
        message="This will permanently delete this contact message. This cannot be undone."
      />
    </DashboardLayout>
  );
}
