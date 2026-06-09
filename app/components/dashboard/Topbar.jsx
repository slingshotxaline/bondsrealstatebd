'use client';
import { useState, useEffect } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/app/context/AuthContext';
import { userAPI } from '@/app/lib/api';


export default function Topbar({ onMenuClick, title, subtitle }) {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    userAPI.getNotifications('unread=true&limit=1')
      .then(d => setUnread(d.unreadCount || 0))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 px-4 lg:px-8 py-3 flex items-center gap-4">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-gray-900 leading-none truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link href="/dashboard/notifications" className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
          )}
        </Link>

        {/* Avatar */}
        <Link href="/dashboard/settings" className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/70 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </Link>
      </div>
    </header>
  );
}