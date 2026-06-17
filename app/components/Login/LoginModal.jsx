"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Google SVG icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// ── Shared input ──────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, label, error, rightEl, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div className="relative">
      <Icon
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        {...props}
        className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder:text-gray-400
          focus:outline-none focus:ring-2 transition-all
          ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-[#004835] focus:ring-[#004835]/10"
          }`}
      />
      {rightEl && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Views ─────────────────────────────────────────────────────────────────────
// type View = "login" | "forgot" | "otp" | "reset" | "success";

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const router = useRouter();

  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Forgot password fields
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [confirmPwd, setConfirmPwd] = useState(false);

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      onClose();
      router.push(user.role === "user" ? "/dashboard" : "/admin");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  // ── Forgot password: step 1 — send OTP ────────────────────────────────────
  const handleForgotSubmit = async () => {
    setError("");
    if (!fpEmail) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setView("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handler ─────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    // Auto-focus next
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  // ── Forgot password: step 2 — verify OTP ──────────────────────────────────
  const handleVerifyOtp = async () => {
    setError("");
    const otpStr = otp.join("");
    if (otpStr.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: otpStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetToken(data.resetToken);
      setView("reset");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password: step 3 — set new password ────────────────────────────
  const handleResetPassword = async () => {
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setView("success");
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // ── Back to login ─────────────────────────────────────────────────────────
  const backToLogin = () => {
    setView("login");
    setError("");
    setFpEmail("");
    setOtp(["", "", "", "", "", ""]);
    setResetToken("");
    setNewPassword("");
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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C]" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all z-10"
          >
            <X size={16} />
          </button>

          <div className="p-8">
            {/* ── VIEW: Login ─────────────────────────────────────────────── */}
            {view === "login" && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#004835]/10 border border-[#004835]/20 flex items-center justify-center">
                    <Building2 size={18} className="text-[#004835]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Welcome Back
                    </h2>
                    <p className="text-xs text-gray-400">Sign in to continue</p>
                  </div>
                </div>

                {/* Google button */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-4 group"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400 font-medium">
                    or sign in with email
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <InputField
                    icon={Mail}
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                  <InputField
                    icon={Lock}
                    label="Password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    rightEl={
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setView("forgot");
                        setError("");
                        setFpEmail(email);
                      }}
                      className="text-xs text-[#004835] hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-[#004835]/20 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={15} className="animate-spin" />}
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-5">
                  Don't have an account?{" "}
                  <button
                    onClick={onSwitchToRegister}
                    className="text-[#004835] font-semibold hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </>
            )}

            {/* ── VIEW: Forgot Password — Enter Email ──────────────────────── */}
            {view === "forgot" && (
              <>
                <button
                  onClick={backToLogin}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
                >
                  <ArrowLeft size={15} /> Back to Sign In
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Forgot Password?
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Enter your email and we'll send you a 6-digit OTP to reset
                  your password.
                </p>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <InputField
                    icon={Mail}
                    label="Email Address"
                    type="email"
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                  <button
                    onClick={handleForgotSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={15} className="animate-spin" />}
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </>
            )}

            {/* ── VIEW: Enter OTP ───────────────────────────────────────────── */}
            {view === "otp" && (
              <>
                <button
                  onClick={() => setView("forgot")}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
                >
                  <ArrowLeft size={15} /> Back
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Check your email
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  We sent a 6-digit OTP to
                </p>
                <p className="text-sm font-semibold text-[#004835] mb-6">
                  {fpEmail}
                </p>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* OTP boxes */}
                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Didn't receive it?{" "}
                  <button
                    onClick={handleForgotSubmit}
                    className="text-[#004835] font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </>
            )}

            {/* ── VIEW: Set New Password ────────────────────────────────────── */}
            {view === "reset" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Set New Password
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Choose a strong password for your account.
                </p>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <InputField
                    icon={Lock}
                    label="New Password"
                    type={showNewPwd ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    rightEl={
                      <button
                        type="button"
                        onClick={() => setShowNewPwd((v) => !v)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />
                  <InputField
                    icon={Lock}
                    label="Confirm Password"
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Repeat password"
                    error={
                      confirmPwd && newPassword !== confirmPwd
                        ? "Passwords do not match"
                        : ""
                    }
                  />

                  <button
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword || !confirmPwd}
                    className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={15} className="animate-spin" />}
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </>
            )}

            {/* ── VIEW: Success ─────────────────────────────────────────────── */}
            {view === "success" && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Password Reset!
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Your password has been reset successfully. You can now sign in
                  with your new password.
                </p>
                <button
                  onClick={backToLogin}
                  className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all"
                >
                  Sign In Now
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
