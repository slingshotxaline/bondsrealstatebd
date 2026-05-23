'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BedDouble, Bath, Maximize2, MapPin, Star, ArrowUpRight } from 'lucide-react';

function formatPrice(price, priceType, purpose) {
  if (purpose === 'rent') return `৳ ${price.toLocaleString()} /mo`;
  if (price >= 10000000) return `৳ ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `৳ ${(price / 100000).toFixed(1)} L`;
  return `৳ ${price.toLocaleString()}`;
}

export default function PropertyCard({ property, index, isGrid }) {
  const timeAgo = (dateStr) => {
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (isGrid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="group relative"
      >
       <Link href={`/property-buy-sell/${property.slug}`}>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-amber-400/60 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(245,158,11,0.15)] shadow-sm">
            {/* Image */}
            <div className="relative h-48 sm:h-52 overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {property.featured && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  <Star size={10} fill="white" /> FEATURED
                </div>
              )}
              <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${
                property.purpose === 'rent' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {property.purpose === 'rent' ? 'RENT' : 'SALE'}
              </div>
              <div className="absolute bottom-3 left-3 text-white font-bold text-lg leading-tight drop-shadow-md">
                {formatPrice(property.price, property.priceType, property.purpose)}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-gray-900 font-semibold text-sm leading-snug mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                <MapPin size={11} />
                <span>{property.location}, {property.city}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span className="flex items-center gap-1.5"><BedDouble size={13} className="text-amber-500" /> {property.bedrooms}</span>
                <span className="flex items-center gap-1.5"><Bath size={13} className="text-amber-500" /> {property.bathrooms}</span>
                <span className="flex items-center gap-1.5"><Maximize2 size={13} className="text-amber-500" /> {property.size} ft²</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group"
    >
     <Link href={`/property-buy-sell/${property.slug}`}>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-amber-400/60 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(245,158,11,0.15)] shadow-sm flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-56 md:w-64 flex-shrink-0 overflow-hidden h-48 sm:h-auto">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-transparent to-black/10" />
            {property.featured && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                <Star size={10} fill="white" /> FEATURED
              </div>
            )}
            <div className={`absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
              property.purpose === 'rent' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {property.purpose === 'rent' ? 'RENT' : 'SALE'}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="min-w-0">
                  <div className="inline-block text-[10px] font-semibold text-amber-600 border border-amber-300 bg-amber-50 px-2 py-0.5 rounded mb-1.5">
                    {property.type?.toUpperCase()}
                  </div>
                  <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
                    {property.title}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-amber-600 font-bold text-base sm:text-lg whitespace-nowrap">
                    {formatPrice(property.price, property.priceType, property.purpose)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                <MapPin size={11} />
                <span>{property.location}, {property.city}</span>
              </div>
              <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed hidden sm:block">
                {property.description}
              </p>
            </div>

            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mt-3 pt-3 border-t border-gray-100 gap-2">
              <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5"><BedDouble size={13} className="text-amber-500" /> {property.bedrooms} Beds</span>
                <span className="flex items-center gap-1.5"><Bath size={13} className="text-amber-500" /> {property.bathrooms} Baths</span>
                <span className="flex items-center gap-1.5"><Maximize2 size={13} className="text-amber-500" /> {property.size} ft²</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs flex-shrink-0">
                <span>{property.owner}</span>
                <span>·</span>
                <span>{timeAgo(property.postedAt)}</span>
                <ArrowUpRight size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}