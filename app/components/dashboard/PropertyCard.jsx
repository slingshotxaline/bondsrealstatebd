"use client";
import { motion } from "framer-motion";
import {
  MapPin,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";

// const BASE =
//   process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
//   "http://localhost:5000";

const statusConfig = {
  Approved: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  Pending: {
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
  },
  Rejected: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
  },
};

export default function PropertyCard({
  property,
  onDelete,
  showAdminActions,
  onApprove,
  onReject,
  delay = 0,
}) {
  const cfg = statusConfig[property.status] || statusConfig.Pending;
  const StatusIcon = cfg.icon;
  const thumb = property.thumbnail?.url || '/placeholder-property.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-red rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:shadow-gray-100 transition-all group"
    >
      <Link href={`/dashboard/properties/${property._id}`}>
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={thumb}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x200/e5e7eb/9ca3af?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Status badge */}
          <div
            className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}
          >
            <StatusIcon size={11} />
            {property.status}
          </div>

          {/* Featured */}
          {property.isFeatured && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#C89A6C] text-white text-[10px] font-bold">
              <Star size={9} fill="currentColor" /> Featured
            </div>
          )}

          {/* Price */}
          <div className="absolute bottom-3 left-3 text-white font-bold text-base drop-shadow">
            ৳{property.price?.toLocaleString()}
            <span className="text-xs font-normal opacity-80 ml-1">
              {property.priceLabel}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <MapPin size={11} className="text-[#004835]" />
            <span className="truncate">
              {property.area}, {property.city}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#004835]/8 text-[#004835] border border-[#004835]/15">
                {property.listingType}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                {property.propertyCategory}
              </span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
              <Eye size={11} />
              {property.views}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
            {!showAdminActions && (
              <>
                <Link
                  href={`/dashboard/properties/${property._id}/edit`}
                  className="flex-1"
                >
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#004835]/8 text-[#004835] text-xs font-semibold hover:bg-[#004835]/15 transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                </Link>
                <button
                  onClick={() => onDelete?.(property._id)}
                  className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}

            {showAdminActions && property.status === "Pending" && (
              <>
                <button
                  onClick={() => onApprove?.(property._id)}
                  className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject?.(property._id)}
                  className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  Reject
                </button>
              </>
            )}

            {showAdminActions && property.status !== "Pending" && (
              <Link
                href={`/admin/properties/${property._id}`}
                className="flex-1"
              >
                <button className="w-full py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors">
                  View Details
                </button>
              </Link>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
