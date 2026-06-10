"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize2, Star, Heart } from "lucide-react";

function formatPrice(price, listingType) {
  if (listingType === "Rent") return `৳ ${price?.toLocaleString()} /mo`;
  if (price >= 10000000) return `৳ ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `৳ ${(price / 100000).toFixed(1)} L`;
  return `৳ ${price?.toLocaleString()}`;
}

export default function PropertyCard({ property: p, index, isGrid }) {
  const thumb =
    p.thumbnail?.url ||
    "https://placehold.co/400x280/e5e7eb/9ca3af?text=No+Image";

  if (!isGrid) {
    // ── List view ──────────────────────────────────────────────────────────────
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <Link
          href={`/property-buy-sell/${p.slug || p._id}`}
          className="flex flex-col sm:flex-row gap-0"
        >
          <div className="relative w-full sm:w-52 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
            <img
              src={thumb}
              alt={p.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div
              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white
              ${p.listingType === "Rent" ? "bg-emerald-500" : "bg-blue-500"}`}
            >
              FOR {p.listingType?.toUpperCase()}
            </div>
            {p.isFeatured && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                <Star size={9} fill="white" /> FEATURED
              </div>
            )}
          </div>
          <div className="flex-1 p-4 sm:p-5">
            <span className="inline-block text-[10px] font-semibold text-amber-600 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded mb-1.5">
              {p.propertyCategory?.toUpperCase()}
            </span>
            <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-1">
              {p.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
              <MapPin size={11} className="text-amber-500" />
              {p.area}, {p.city}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              {p.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <BedDouble size={12} className="text-amber-500" />
                  {p.bedrooms} Beds
                </span>
              )}
              {p.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath size={12} className="text-amber-500" />
                  {p.bathrooms} Baths
                </span>
              )}
              {p.size && (
                <span className="flex items-center gap-1">
                  <Maximize2 size={12} className="text-amber-500" />
                  {p.size} ft²
                </span>
              )}
            </div>
            <div className="text-lg font-bold text-amber-600">
              {formatPrice(p.price, p.listingType)}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── Grid view ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
    >
     <Link href={`/property-buy-sell/${p.slug || p._id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={thumb}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white
            ${p.listingType === "Rent" ? "bg-emerald-500" : "bg-blue-500"}`}
          >
            FOR {p.listingType?.toUpperCase()}
          </div>

          {p.isFeatured && (
            <div className="absolute top-3 right-10 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <Star size={9} fill="white" /> FEATURED
            </div>
          )}

          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/40 transition-colors"
          >
            <Heart size={13} />
          </button>

          <div className="absolute bottom-3 left-3">
            <div className="text-white font-bold text-base drop-shadow">
              {formatPrice(p.price, p.listingType)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <span className="inline-block text-[10px] font-semibold text-amber-600 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded mb-1.5">
            {p.propertyCategory?.toUpperCase()}
          </span>
          <h3 className="font-bold text-gray-900 text-sm mb-1.5 line-clamp-1">
            {p.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <MapPin size={11} className="text-amber-500 flex-shrink-0" />
            <span className="truncate">
              {p.area}, {p.city}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
            {p.bedrooms != null && (
              <span className="flex items-center gap-1">
                <BedDouble size={11} className="text-amber-500" />
                {p.bedrooms}
              </span>
            )}
            {p.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath size={11} className="text-amber-500" />
                {p.bathrooms}
              </span>
            )}
            {p.size && (
              <span className="flex items-center gap-1">
                <Maximize2 size={11} className="text-amber-500" />
                {p.size} ft²
              </span>
            )}
            <span className="ml-auto text-[10px] text-gray-300">
              {new Date(p.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
