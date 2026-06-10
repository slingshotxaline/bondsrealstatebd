"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Eye,
  Star,
  CheckCircle2,
  Share2,
  Phone,
  MessageCircle,
  Heart,
  ArrowLeft,
  ChevronRight,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Building2,
  Car,
  Wind,
  Layers,
  User,
  Loader2,
  X,
  ChevronLeft,
} from "lucide-react";
import { propertyAPI } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

function formatPrice(price, listingType) {
  if (listingType === "Rent") return `৳ ${price?.toLocaleString()} /mo`;
  if (price >= 10000000) return `৳ ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `৳ ${(price / 100000).toFixed(1)} L`;
  return `৳ ${price?.toLocaleString()}`;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index);
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"
      >
        <X size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCur((i) => (i - 1 + images.length) % images.length);
        }}
        className="absolute left-4 p-2 rounded-full bg-white/10 text-white"
      >
        <ChevronLeft size={20} />
      </button>
      <img
        src={images[cur]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCur((i) => (i + 1) % images.length);
        }}
        className="absolute right-4 p-2 rounded-full bg-white/10 text-white"
      >
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-4 text-sm text-white/60">
        {cur + 1} / {images.length}
      </div>
    </div>
  );
}

// ── Contact / Inquiry Form ────────────────────────────────────────────────────
function ContactForm({ property }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: `I'm interested in this property 🏠 ${property.title}. Please contact me.`,
    inquiryType: "General",
    preferredVisitDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.message) {
      setError("Name, phone, email and message are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await propertyAPI.submitInquiry(property._id, form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp =
    "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all";

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-6"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
          <CheckCircle2 size={28} className="text-emerald-500" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Message Sent!</h3>
        <p className="text-sm text-gray-500">
          The owner will contact you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs text-amber-600 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-800 mb-1">
        Contact Information
      </h3>

      {/* Inquiry type */}
      <div className="flex gap-2">
        {["General", "Purchase", "Visit"].map((t) => (
          <button
            key={t}
            onClick={() => setForm((f) => ({ ...f, inquiryType: t }))}
            className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all
              ${
                form.inquiryType === t
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-gray-200 text-gray-500 hover:border-amber-300"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Name */}
      <div className="relative">
        <input
          value={form.name}
          onChange={set("name")}
          placeholder="Your Name *"
          className={inp}
        />
        {form.name && (
          <CheckCircle2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
          />
        )}
      </div>

      {/* Phone */}
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 flex-shrink-0">
          <span className="text-base">🇧🇩</span>
          <span>+880</span>
          <ChevronRight size={12} className="text-gray-400 rotate-90" />
        </div>
        <input
          value={form.phone}
          onChange={set("phone")}
          placeholder="Enter Mobile Number *"
          type="tel"
          className={`${inp} flex-1`}
        />
      </div>

      {/* Email */}
      <div className="relative">
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="Email Address *"
          className={inp}
        />
        {form.email?.includes("@") && (
          <CheckCircle2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
          />
        )}
      </div>

      {/* Visit date */}
      {form.inquiryType === "Visit" && (
        <input
          type="date"
          value={form.preferredVisitDate}
          onChange={set("preferredVisitDate")}
          min={new Date().toISOString().split("T")[0]}
          className={inp}
        />
      )}

      {/* Message */}
      <textarea
        value={form.message}
        onChange={set("message")}
        rows={3}
        placeholder="Your message *"
        className={`${inp} resize-none`}
      />

      {/* Terms */}
      <p className="text-[11px] text-gray-400 leading-relaxed">
        By submitting, you agree to our{" "}
        <span className="text-amber-600 cursor-pointer hover:underline">
          Terms of Use
        </span>{" "}
        and{" "}
        <span className="text-amber-600 cursor-pointer hover:underline">
          Privacy Policy
        </span>
        . This site is protected by reCAPTCHA and the Google Privacy Policy and
        Terms of Service apply.
      </p>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-200">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <a
          href={`https://wa.me/88${property.ownerPhone?.replace(
            /^0/,
            ""
          )}?text=${encodeURIComponent(form.message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl transition-all active:scale-95"
        >
          <MessageCircle size={15} /> WHATSAPP
        </a>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : null}
          {loading ? "Sending..." : "SUBMIT"}
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PropertyDetailPage({ property: p }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const allImages = [
    p.thumbnail?.url,
    ...(p.photos || []).map((ph) => ph.url),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 font-['Sora',_sans-serif] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 flex-wrap">
          {["Home", "Properties", p.propertyCategory, p.title].map(
            (b, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                <span
                  className={
                    i === arr.length - 1
                      ? "text-amber-600 font-medium truncate max-w-[160px]"
                      : "hover:text-gray-600 cursor-pointer transition-colors"
                  }
                >
                  {b}
                </span>
                {i < arr.length - 1 && (
                  <ChevronRight
                    size={12}
                    className="text-gray-300 flex-shrink-0"
                  />
                )}
              </span>
            )
          )}
        </div>

        <Link
          href="/property-buy-sell"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors mb-6 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ── Left column ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden h-64 sm:h-80 md:h-96 shadow-sm cursor-zoom-in"
              onClick={() => allImages.length > 0 && setLightboxIdx(0)}
            >
              <img
                src={
                  allImages[0] ||
                  "https://placehold.co/800x400/e5e7eb/9ca3af?text=No+Image"
                }
                alt={p.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div
                className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg
                ${p.listingType === "Rent" ? "bg-emerald-500" : "bg-blue-500"}`}
              >
                FOR {p.listingType?.toUpperCase()}
              </div>

              {p.isFeatured && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <Star size={11} fill="white" /> FEATURED
                </div>
              )}

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all"
                >
                  <Heart size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard?.writeText(window.location.href);
                  }}
                  className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 text-white text-xs font-semibold rounded-lg backdrop-blur-sm flex items-center gap-1.5">
                  <Eye size={12} /> {allImages.length} photos
                </div>
              )}
            </motion.div>

            {/* Photo strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIdx(i)}
                    className="w-16 h-12 flex-shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-amber-400 transition-colors"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Price */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-semibold text-amber-600 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded mb-2">
                    {p.propertyCategory?.toUpperCase()} ·{" "}
                    {p.propertyType?.toUpperCase()}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {p.title}
                  </h1>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600">
                    {formatPrice(p.price, p.listingType)}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.priceLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <MapPin size={14} className="text-amber-500 flex-shrink-0" />
                {p.address}, {p.area}, {p.city}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                {[
                  {
                    icon: BedDouble,
                    label: "Bedrooms",
                    value: p.bedrooms || "N/A",
                  },
                  {
                    icon: Bath,
                    label: "Bathrooms",
                    value: p.bathrooms || "N/A",
                  },
                  {
                    icon: Maximize2,
                    label: "Area",
                    value: p.size ? `${p.size} ft²` : "N/A",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <Icon size={18} className="text-amber-500 mb-1.5" />
                    <span className="text-gray-900 font-bold text-sm">
                      {value}
                    </span>
                    <span className="text-gray-400 text-[11px]">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-base font-bold text-gray-800 mb-3">
                Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {p.description}
              </p>
            </motion.div>

            {/* Amenities */}
            {p.amenities?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-base font-bold text-gray-800 mb-4">
                  Amenities & Features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {p.amenities.map((a) => (
                    <div
                      key={a}
                      className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-amber-500 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {a}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* YouTube */}
            {p.youtubeUrl && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-base font-bold text-gray-800 mb-4">
                  Video Tour
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      p.youtubeUrl.match(/(?:v=|\.be\/|embed\/)([^&?/]+)/)?.[1]
                    }`}
                    className="w-full h-full"
                    allowFullScreen
                    title="Property Video"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Contact form card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 lg:sticky lg:top-24"
            >
              {/* Owner identity */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-lg flex-shrink-0">
                  {p.ownerName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {p.ownerName}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Building2 size={11} /> Property Owner
                  </div>
                </div>
              </div>

              <ContactForm property={p} />

              {/* Quick info */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Views</span>
                  <span className="text-gray-700 font-medium flex items-center gap-1">
                    <Eye size={11} /> {p.views}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Property ID</span>
                  <span className="text-gray-700 font-medium">
                    #{p._id?.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Listed</span>
                  <span className="text-gray-700 font-medium">
                    {new Date(p.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Safety tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
            >
              <p className="text-xs text-amber-700 font-semibold mb-1">
                Safety Tip
              </p>
              <p className="text-xs text-amber-600 leading-relaxed">
                Always visit the property in person before making any payment.
                Never pay advance without signing a proper agreement.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={allImages}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}
