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
  User,
  Phone,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

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

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Email/password registration ───────────────────────────────────────────
  const handleRegister = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { authAPI } = await import("@/app/lib/api");
      await authAPI.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      const user = await login(form.email, form.password);
      onClose();
      router.push(user.role === "user" ? "/dashboard" : "/admin");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google sign-up — same endpoint as login ───────────────────────────────
  // The backend's passport strategy auto-creates a new user if one doesn't
  // exist for that Google account, so "register" and "login" with Google
  // are literally the same redirect.
  const handleGoogleSignup = () => {
    window.location.href = `${API}/auth/google`;
  };

  const InputField = ({
    icon: Icon,
    label,
    type = "text",
    field,
    placeholder,
    rightEl,
  }) => (
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
          type={type}
          value={form[field]}
          onChange={set(field)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#004835]/10 transition-all
            ${
              fieldErrors[field]
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-[#004835]"
            }`}
        />
        {rightEl && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}
      </div>
      {fieldErrors[field] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[field]}</p>
      )}
    </div>
  );

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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        >
          <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C] flex-shrink-0" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all z-10"
          >
            <X size={16} />
          </button>

          <div className="p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#004835]/10 border border-[#004835]/20 flex items-center justify-center">
                <Building2 size={18} className="text-[#004835]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Account
                </h2>
                <p className="text-xs text-gray-400">Join BONDS Real Estate</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6 mt-4 pl-1 border-l-2 border-[#C89A6C] leading-relaxed">
              Create a free account to list properties and track your inquiries.
            </p>

            {/* ── Google sign-up button ──────────────────────────────────── */}
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-4"
            >
              <GoogleIcon />
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">
                or sign up with email
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Global error */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <InputField
                icon={User}
                label="Full Name"
                field="name"
                placeholder="Your full name"
              />
              <InputField
                icon={Mail}
                label="Email Address"
                field="email"
                type="email"
                placeholder="you@example.com"
              />
              <InputField
                icon={Phone}
                label="Phone (optional)"
                field="phone"
                placeholder="+880..."
              />

              <InputField
                icon={Lock}
                label="Password"
                field="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              <InputField
                icon={Lock}
                label="Confirm Password"
                field="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Submit */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-[#004835]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>

            {/* Switch to login */}
            <p className="text-center text-xs text-gray-400 mt-5">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-[#004835] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
