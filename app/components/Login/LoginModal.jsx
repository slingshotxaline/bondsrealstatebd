"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const user = await login(email, password);

      onClose();

      router.push(user?.role === "user" ? "/dashboard" : "/admin");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Top Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-800"
          >
            <X size={16} />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#004835]/20 bg-[#004835]/10">
                <Building2 size={18} className="text-[#004835]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-xs text-gray-400">Sign in to continue</p>
              </div>
            </div>

            <p className="mt-4 mb-7 border-l-2 border-[#C89A6C] pl-1 text-sm leading-relaxed text-gray-500">
              Please sign in to access our property listings and solutions.
            </p>

            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-10 pl-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-medium text-[#004835] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-xl bg-[#004835] py-3 text-sm font-bold text-white transition-all hover:bg-[#003828] hover:shadow-lg hover:shadow-[#004835]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* Divider */}
              <div className="my-1 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Guest */}
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-800"
              >
                Continue as Guest
              </button>
            </div>

            {/* Signup */}
            <p className="mt-5 text-center text-xs text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold text-[#004835] hover:underline"
              >
                Create one
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
