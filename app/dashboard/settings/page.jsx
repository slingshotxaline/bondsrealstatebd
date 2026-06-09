'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/ui/Toast';
import { authAPI } from '@/app/lib/api';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';


const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
    <input
      {...props}
      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
    />
  </div>
);

export default function SettingsPage() {
  const { user, loadUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(profile);
      await loadUser();
      toast('Profile updated successfully');
    } catch (err) { toast(err.message || 'Update failed', 'error'); }
    finally { setSaving(false); }
  };

  const handlePwdSave = async () => {
    if (pwd.newPassword !== pwd.confirm) { toast('Passwords do not match', 'error'); return; }
    if (pwd.newPassword.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
    setSavingPwd(true);
    try {
      await authAPI.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
      toast('Password changed successfully');
    } catch (err) { toast(err.message || 'Password change failed', 'error'); }
    finally { setSavingPwd(false); }
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
      <div className="w-7 h-7 rounded-lg bg-[#004835]/8 flex items-center justify-center">
        <Icon size={14} className="text-[#004835]" />
      </div>
      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
  );

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004835] to-[#004835]/60 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full
              ${user?.role === 'user' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl border border-gray-100 p-6">
          <SectionHeader icon={User} title="Profile Information" />
          <div className="space-y-4 mb-5">
            <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            <Input label="Email Address" value={user?.email} disabled className="opacity-60 cursor-not-allowed" />
            <Input label="Phone Number" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+880..." />
          </div>
          <button
            onClick={handleProfileSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 p-6">
          <SectionHeader icon={Lock} title="Change Password" />
          <div className="space-y-4 mb-5">
            <Input label="Current Password" type="password" value={pwd.currentPassword} onChange={e => setPwd(p => ({ ...p, currentPassword: e.target.value }))} placeholder="••••••••" />
            <Input label="New Password" type="password" value={pwd.newPassword} onChange={e => setPwd(p => ({ ...p, newPassword: e.target.value }))} placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
          </div>
          <button
            onClick={handlePwdSave}
            disabled={savingPwd || !pwd.currentPassword || !pwd.newPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors disabled:opacity-60"
          >
            <Lock size={14} />
            {savingPwd ? 'Updating...' : 'Update Password'}
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}