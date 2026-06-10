'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, MessageSquare, Bell, Settings,
  ChevronRight, LogOut, Shield, Users, FileCheck, X, Star,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const userNav = [
  { label: 'Overview',      href: '/dashboard',              icon: LayoutDashboard },
  { label: 'My Properties', href: '/dashboard/properties',   icon: Building2 },
  { label: 'My Inquiries',  href: '/dashboard/inquiries',    icon: MessageSquare },
  { label: 'Notifications', href: '/dashboard/notifications',icon: Bell },
  { label: 'Settings',      href: '/dashboard/settings',     icon: Settings },
];

const adminNav = [
  { label: 'Admin Panel',   href: '/admin',                  icon: Shield },
  { label: 'Properties',    href: '/admin/properties',       icon: Building2 },
  { label: 'Users',         href: '/admin/users',            icon: Users },
  { label: 'Property Inquiries',     href: '/admin/inquiries',        icon: FileCheck },
  { label: 'Contact Messages',      href: '/admin/contacts',     icon: MessageSquare }, 
];

function NavItem({ item, onClick }) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));
  const Icon = item.icon;

  return (
    <Link href={item.href} onClick={onClick}>
      <motion.div
        whileHover={{ x: 3 }}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative
          ${active
            ? 'bg-[#004835] text-white shadow-md shadow-[#004835]/20'
            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}
      >
        {active && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 bg-[#004835] rounded-xl -z-10"
          />
        )}
        <Icon size={16} />
        <span>{item.label}</span>
        {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
      </motion.div>
    </Link>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#004835] flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-none">BONDS</div>
            <div className="text-[10px] text-gray-400 font-medium tracking-wide">Real Estate</div>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
          <X size={16} />
        </button>
      </div>

      {/* User pill */}
      <div className="mx-4 my-4 p-3 rounded-xl bg-gradient-to-br from-[#004835]/5 to-[#C89A6C]/5 border border-[#004835]/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/70 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{user?.name}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full
            ${isAdmin ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            {isAdmin && <Star size={9} />}
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">My Account</div>
        {userNav.map(item => <NavItem key={item.href} item={item} onClick={onClose} />)}

        {isAdmin && (
          <>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mt-5 mb-2">Administration</div>
            {adminNav.map(item => <NavItem key={item.href} item={item} onClick={onClose} />)}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden shadow-2xl"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}