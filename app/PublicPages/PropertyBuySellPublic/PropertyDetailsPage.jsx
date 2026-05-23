'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BedDouble, Bath, Maximize2, MapPin, Star, ChevronRight,
  Calendar, User, Building2, Car, Wind, Layers,
  CheckCircle2, Phone, MessageCircle, Heart, Share2, ArrowLeft
} from 'lucide-react';

function formatPrice(price, priceType, purpose) {
  if (purpose === 'rent') return `৳ ${price.toLocaleString()} /mo`;
  if (price >= 10000000) return `৳ ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `৳ ${(price / 100000).toFixed(1)} L`;
  return `৳ ${price.toLocaleString()}`;
}

export default function PropertyDetailPage({ property: p }) {
  return (
    <div className="min-h-screen bg-gray-50 font-['Sora',_sans-serif] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
          {['Home', 'Properties', p.type, p.title].map((b, i, arr) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className={i === arr.length - 1 ? 'text-amber-600 font-medium truncate max-w-[160px]' : 'hover:text-gray-600 cursor-pointer transition-colors'}>
                {b}
              </span>
              {i < arr.length - 1 && <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />}
            </span>
          ))}
        </div>

        {/* Back button */}
        <Link href="/property-buy-sell"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Left / Main Column ─────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden h-64 sm:h-80 md:h-96 shadow-sm"
            >
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {p.featured && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <Star size={11} fill="white" /> FEATURED
                </div>
              )}
              <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${
                p.purpose === 'rent' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                FOR {p.purpose === 'rent' ? 'RENT' : 'SALE'}
              </div>

              {/* Action buttons overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all">
                  <Heart size={16} />
                </button>
                <button className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all">
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>

            {/* Title & Price */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-semibold text-amber-600 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded mb-2">
                    {p.type?.toUpperCase()}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{p.title}</h1>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600">
                    {formatPrice(p.price, p.priceType, p.purpose)}
                  </div>
                  {p.purpose === 'rent' && p.deposit > 0 && (
                    <div className="text-xs text-gray-400 mt-0.5">Deposit: ৳ {p.deposit.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <MapPin size={14} className="text-amber-500 flex-shrink-0" />
                <span>{p.address}</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                {[
                  { icon: BedDouble, label: 'Bedrooms', value: p.bedrooms },
                  { icon: Bath, label: 'Bathrooms', value: p.bathrooms },
                  { icon: Maximize2, label: 'Area', value: `${p.size} ft²` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                    <Icon size={18} className="text-amber-500 mb-1.5" />
                    <span className="text-gray-900 font-bold text-sm">{value}</span>
                    <span className="text-gray-400 text-[11px]">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-base font-bold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-base font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Layers, label: 'Floor', value: p.floor ? `${p.floor}th Floor` : 'N/A' },
                  { icon: Wind, label: 'Furnishing', value: p.furnishing || 'N/A' },
                  { icon: Car, label: 'Parking', value: p.garage || 'No Parking' },
                  { icon: Building2, label: 'Balconies', value: p.balconies || 0 },
                  { icon: Calendar, label: 'Available From', value: p.availableFrom || 'N/A' },
                  { icon: User, label: 'Preferred Tenant', value: p.preferredTenant || 'Any' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-gray-400">{label}</div>
                      <div className="text-sm font-semibold text-gray-700 truncate">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Features / Amenities */}
            {p.features?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-base font-bold text-gray-800 mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {p.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                      <CheckCircle2 size={14} className="text-amber-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right / Sidebar Column ──────────────────── */}
          <div className="space-y-5">

            {/* Owner Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 sticky top-6"
            >
              <h3 className="text-sm font-bold text-gray-800 mb-4">Contact Owner</h3>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-lg flex-shrink-0">
                  {p.owner?.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{p.owner}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Building2 size={11} />
                    {p.ownerType}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm rounded-xl transition-all hover:shadow-[0_4px_20px_rgba(245,158,11,0.35)] active:scale-95 flex items-center justify-center gap-2">
                  <Phone size={15} /> Call Owner
                </button>
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                  <MessageCircle size={15} /> WhatsApp
                </button>
                <button className="w-full py-2.5 border border-gray-200 hover:border-amber-300 text-gray-600 hover:text-amber-600 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={15} /> Send Message
                </button>
              </div>

              {/* Quick info */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Posted</span>
                  <span className="text-gray-700 font-medium">
                    {new Date(p.postedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {p.purpose === 'rent' && p.deposit > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Security Deposit</span>
                    <span className="text-gray-700 font-medium">৳ {p.deposit.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Property ID</span>
                  <span className="text-gray-700 font-medium">#{p.id.toString().padStart(5, '0')}</span>
                </div>
              </div>
            </motion.div>

            {/* Safety tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
            >
              <p className="text-xs text-amber-700 font-semibold mb-1">Safety Tip</p>
              <p className="text-xs text-amber-600 leading-relaxed">
                Always visit the property in person before making any payment. Never pay advance without signing a proper agreement.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}