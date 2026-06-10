"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  TrendingUp,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { adminAPI, userAPI } from "../lib/api";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import PropertyCard from "../components/dashboard/PropertyCard";
import { useToast } from "../components/ui/Toast";

export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [pendingProps, setPendingProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [recentNotifs, setRecentNotifs] = useState([]);

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace("/dashboard");
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      adminAPI.getStats(),
      adminAPI.getProperties("status=Pending&limit=6"),
      userAPI.getNotifications('limit=5&unread=true'),
    ])
      .then(([statsData, propsData,notifData]) => {
        setStats(statsData);
        setPendingProps(propsData.data || []);
        setRecentNotifs(notifData.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleApprove = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await adminAPI.approveProperty(id);
      setPendingProps((p) => p.filter((x) => x._id !== id));
      toast("Property approved");
    } catch {
      toast("Failed to approve", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Rejection reason:");
    if (!reason) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await adminAPI.rejectProperty(id, { reason });
      setPendingProps((p) => p.filter((x) => x._id !== id));
      toast("Property rejected");
    } catch {
      toast("Failed to reject", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const byStatus = (s) =>
    stats?.statusStats?.find((x) => x._id === s)?.count || 0;
  const totalUsers = 0; // would come from separate endpoint

  return (
    <DashboardLayout
      title="Admin Panel"
      subtitle="Manage properties, users, and inquiries"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Properties"
          value={stats?.total ?? "—"}
          icon={Building2}
          color="green"
          delay={0}
        />
        <StatCard
          label="Pending Review"
          value={byStatus("Pending")}
          icon={Clock}
          color="gold"
          delay={0.05}
        />
        <StatCard
          label="Approved"
          value={byStatus("Approved")}
          icon={CheckCircle}
          color="blue"
          delay={0.1}
        />
        <StatCard
          label="Rejected"
          value={byStatus("Rejected")}
          icon={XCircle}
          color="red"
          delay={0.15}
        />
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          {
            href: "/admin/properties",
            icon: Building2,
            label: "All Properties",
            sub: "Manage listings",
          },
          {
            href: "/admin/users",
            icon: Users,
            label: "Users",
            sub: "Manage accounts",
          },
          {
            href: "/admin/inquiries",
            icon: MessageSquare,
            label: "Inquiries",
            sub: "View & respond",
          },
        ].map(({ href, icon: Icon, label, sub }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={href}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#004835]/30 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#004835]/8 flex items-center justify-center group-hover:bg-[#004835] transition-colors">
                <Icon
                  size={16}
                  className="text-[#004835] group-hover:text-white transition-colors"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Admin Notifications */}
      {recentNotifs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell size={16} className="text-[#004835]" />
              Recent Alerts
              <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                {recentNotifs.length} unread
              </span>
            </h2>
            <Link
              href="/dashboard/notifications"
              className="text-sm text-[#004835] font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {recentNotifs.map((n, i) => {
              const typeStyles = {
                PROPERTY_SUBMITTED: {
                  bg: "bg-blue-50",
                  text: "text-blue-600",
                  icon: "🏠",
                },
                INQUIRY_RECEIVED: {
                  bg: "bg-purple-50",
                  text: "text-purple-600",
                  icon: "💬",
                },
                SYSTEM_ALERT: {
                  bg: "bg-amber-50",
                  text: "text-amber-600",
                  icon: "📩",
                },
                PURCHASE_REQUEST: {
                  bg: "bg-green-50",
                  text: "text-green-600",
                  icon: "🛒",
                },
              };
              const cfg = typeStyles[n.type] || typeStyles.SYSTEM_ALERT;

              return (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm ${cfg.bg}`}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-1">
                      {new Date(n.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#004835] mt-1.5 flex-shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900">Pending Review</h2>
            {pendingProps.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
                {pendingProps.length}
              </span>
            )}
          </div>
          <Link
            href="/admin/properties?status=Pending"
            className="text-sm text-[#004835] font-medium hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : pendingProps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
            <CheckCircle size={28} className="text-emerald-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              All caught up! No pending properties.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingProps.map((p, i) => (
              <PropertyCard
                key={p._id}
                property={p}
                delay={i * 0.04}
                showAdminActions
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
