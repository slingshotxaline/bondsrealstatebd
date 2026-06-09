'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MessageSquare, Bell, Clock, CheckCircle, XCircle, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import PropertyCard from '../components/dashboard/PropertyCard';
import { propertyAPI, userAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';


export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentProps, setRecentProps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      propertyAPI.getMy('limit=6'),
      userAPI.getNotifications('limit=5'),
    ]).then(([propsData, notifData]) => {
      const props = propsData.data || [];
      setRecentProps(props);
      setStats({
        total: propsData.pagination?.total || props.length,
        pending: props.filter(p => p.status === 'Pending').length,
        approved: props.filter(p => p.status === 'Approved').length,
        rejected: props.filter(p => p.status === 'Rejected').length,
      });
      setNotifications(notifData.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const notifTypeStyles = {
    PROPERTY_APPROVED: 'bg-emerald-50 text-emerald-600',
    PROPERTY_REJECTED: 'bg-red-50 text-red-500',
    PROPERTY_SUBMITTED: 'bg-blue-50 text-blue-600',
    INQUIRY_RECEIVED: 'bg-purple-50 text-purple-600',
    PURCHASE_REQUEST: 'bg-amber-50 text-amber-600',
    SYSTEM_ALERT: 'bg-gray-50 text-gray-500',
  };

  return (
    <DashboardLayout title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`} subtitle="Here's what's happening with your properties">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Listings" value={stats.total} icon={Building2} color="green" delay={0} />
        <StatCard label="Pending Review" value={stats.pending} icon={Clock} color="gold" delay={0.05} />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="blue" delay={0.1} />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="red" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Properties</h2>
            <Link href="/dashboard/properties" className="flex items-center gap-1 text-sm text-[#004835] font-medium hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : recentProps.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <Building2 size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500 mb-1">No properties yet</p>
              <p className="text-xs text-gray-400 mb-4">Submit your first property listing</p>
              <Link href="/dashboard/properties/add-property">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors">
                  <Plus size={15} /> Add Property
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentProps.map((p, i) => (
                <PropertyCard key={p._id} property={p} delay={i * 0.05} />
              ))}
            </div>
          )}
        </div>

        {/* Notifications panel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Notifications</h2>
            <Link href="/dashboard/notifications" className="text-sm text-[#004835] font-medium hover:underline">
              All
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={24} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n, i) => (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`px-4 py-3.5 ${!n.isRead ? 'bg-[#004835]/2' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${notifTypeStyles[n.type] || 'bg-gray-50 text-gray-500'}`}>
                        {n.type === 'PROPERTY_APPROVED' ? '✓' :
                         n.type === 'PROPERTY_REJECTED' ? '✕' : '•'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 leading-snug">{n.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                      {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-[#004835] mt-1.5 flex-shrink-0" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-4 space-y-2">
            <Link href="/dashboard/properties/add-property">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors">
                <Plus size={16} />
                Post New Property
              </button>
            </Link>
            <Link href="/dashboard/inquiries">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                <MessageSquare size={16} className="text-[#004835]" />
                View My Inquiries
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}