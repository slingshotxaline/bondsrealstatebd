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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// Moved OUTSIDE the RegisterModal component.
// Previously this was declared *inside* RegisterModal, which meant a brand
// new InputField function/component was created on every re-render
// (i.e. on every keystroke, since typing calls setForm -> re-render).
// React saw it as a "different" component each time and unmounted/remounted
// the real <input> DOM node, which made it lose focus after every character
// — that's why you could type one char but not continue typing the next.
function InputField({
  icon: Icon,
  label,
  type = "text",
  field,
  placeholder,
  value,
  error,
  onChange,
  rightEl,
}) {
  return (
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
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#004835]/10 transition-all
            ${
              error
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
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

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

  const handleRegister = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      // authAPI.register is called inside AuthContext via a small workaround:
      // We import authAPI directly here to register, then login automatically
      const { authAPI } = await import("../../lib/api");
      await authAPI.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      // Auto-login after registration
      const user = await login(form.email, form.password);
      onClose();
      router.push(user.role === "user" ? "/dashboard" : "/admin");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        >
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C] flex-shrink-0" />

          {/* Close */}
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
                value={form.name}
                error={fieldErrors.name}
                onChange={set("name")}
              />
              <InputField
                icon={Mail}
                label="Email Address"
                field="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                error={fieldErrors.email}
                onChange={set("email")}
              />
              <InputField
                icon={Phone}
                label="Phone (optional)"
                field="phone"
                placeholder="+880..."
                value={form.phone}
                error={fieldErrors.phone}
                onChange={set("phone")}
              />

              <InputField
                icon={Lock}
                label="Password"
                field="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                error={fieldErrors.password}
                onChange={set("password")}
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
                value={form.confirm}
                error={fieldErrors.confirm}
                onChange={set("confirm")}
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
                {loading && (
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
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
