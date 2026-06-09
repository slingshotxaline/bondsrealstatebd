'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Building2, MessageSquare, AlertCircle, ShoppingBag } from 'lucide-react';
import { useToast } from '@/app/components/ui/Toast';
import { userAPI } from '@/app/lib/api';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import EmptyState from '@/app/components/ui/EmptyState';
import Pagination from '@/app/components/ui/Pagination';


const TYPE_CONFIG = {
  PROPERTY_APPROVED:  { icon: Building2,    color: 'bg-emerald-50 text-emerald-600', label: 'Approved' },
  PROPERTY_REJECTED:  { icon: Building2,    color: 'bg-red-50 text-red-500',        label: 'Rejected' },
  PROPERTY_SUBMITTED: { icon: Building2,    color: 'bg-blue-50 text-blue-600',      label: 'Submitted' },
  PURCHASE_REQUEST:   { icon: ShoppingBag,  color: 'bg-amber-50 text-amber-600',    label: 'Purchase' },
  INQUIRY_RECEIVED:   { icon: MessageSquare,color: 'bg-purple-50 text-purple-600',  label: 'Inquiry' },
  SYSTEM_ALERT:       { icon: AlertCircle,  color: 'bg-gray-50 text-gray-500',      label: 'Alert' },
};

export default function NotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getNotifications(`page=${page}&limit=15`);
      setNotifications(data.data || []);
      setPagination(data.pagination || {});
      setUnreadCount(data.unreadCount || 0);
    } catch { toast('Failed to load notifications', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const handleMarkAll = async () => {
    setMarking(true);
    try {
      await userAPI.markAllRead();
      setNotifications(n => n.map(x => ({ ...x, isRead: true })));
      setUnreadCount(0);
      toast('All notifications marked as read');
    } catch { toast('Failed', 'error'); }
    finally { setMarking(false); }
  };

  const handleMarkOne = async (id) => {
    try {
      await userAPI.markRead(id);
      setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch {}
  };

  return (
    <DashboardLayout title="Notifications" subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}>
      {/* Header action */}
      {unreadCount > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleMarkAll}
            disabled={marking}
            className="flex items-center gap-2 px-4 py-2 bg-[#004835]/8 text-[#004835] text-sm font-semibold rounded-xl hover:bg-[#004835]/15 transition-colors disabled:opacity-60"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" message="You're all caught up! Notifications will appear here." />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {notifications.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM_ALERT;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => !n.isRead && handleMarkOne(n._id)}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors ${!n.isRead ? 'bg-[#004835]/2 cursor-pointer hover:bg-[#004835]/4' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${cfg.color}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#004835] flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {new Date(n.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
        </>
      )}
    </DashboardLayout>
  );
}