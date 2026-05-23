'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';

export default function LoginModal({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all z-10"
          >
            <X size={16} />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#004835]/10 border border-[#004835]/20 flex items-center justify-center">
                <Building2 size={18} className="text-[#004835]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-xs text-gray-400">Sign in to continue</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-7 mt-4 pl-1 border-l-2 border-[#C89A6C] leading-relaxed">
              Please sign in to access our property listings and solutions.
            </p>

            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <button className="text-xs text-[#004835] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-[#004835]/20 active:scale-95"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Continue without login */}
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-800 font-semibold text-sm rounded-xl transition-all"
              >
                Continue as Guest
              </button>
            </div>

            {/* Sign up */}
            <p className="text-center text-xs text-gray-400 mt-5">
              Don't have an account?{' '}
              <button className="text-[#004835] font-semibold hover:underline">
                Create one
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}