'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ChevronDown, LayoutDashboard, Settings, LogOut, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { userAPI } from '@/app/lib/api';


export default function Topbar({ onMenuClick, title, subtitle }) {
  const { user, logout, isAdmin } = useAuth();
  const router  = useRouter();
  const menuRef = useRef(null);

  const [unread,       setUnread]       = useState(0);
  const [accountOpen,  setAccountOpen]  = useState(false);

  useEffect(() => {
    userAPI.getNotifications('unread=true&limit=1')
      .then(d => setUnread(d.unreadCount || 0))
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 px-4 lg:px-8 py-3 flex items-center gap-3">

      {/* Hamburger — opens sidebar */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base lg:text-lg font-bold text-gray-900 leading-none truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate hidden sm:block">{subtitle}</p>}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">

        {/* Notifications bell */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
          )}
        </Link>

        {/* Account dropdown — visible on ALL screen sizes */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setAccountOpen(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-gray-200 hover:border-[#004835]/40 transition-all bg-white"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/70 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {/* Name — only on desktop */}
            <span className="hidden sm:block text-xs font-semibold text-gray-700 max-w-[90px] truncate">
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {accountOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="h-0.5 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C]" />

                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/70 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full
                    ${isAdmin
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#004835]/5 hover:text-[#004835] transition-colors font-medium"
                  >
                    <LayoutDashboard size={15} className="text-[#004835]" />
                    My Dashboard
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#004835]/5 hover:text-[#004835] transition-colors font-medium"
                    >
                      <Shield size={15} className="text-amber-500" />
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    href="/dashboard/properties"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#004835]/5 hover:text-[#004835] transition-colors font-medium"
                  >
                    <User size={15} className="text-[#004835]" />
                    My Properties
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#004835]/5 hover:text-[#004835] transition-colors font-medium"
                  >
                    <Settings size={15} className="text-[#004835]" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-gray-50 py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}