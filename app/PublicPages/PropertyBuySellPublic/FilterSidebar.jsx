'use client';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const inputClass =
  'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all';

const labelClass =
  'block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2';

function Section({ id, label, children, openSections, toggle }) {
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between text-left mb-3 group"
      >
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-amber-500 transition-colors">
          {label}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${openSections[id] ? 'rotate-180' : ''}`}
        />
      </button>
      {openSections[id] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function FilterSidebar({ filters, setFilters, onSearch, onClear }) {
  const [openSections, setOpenSections] = useState({
    purpose: true, price: true, size: true, beds: true,
  });

  const toggle = (section) =>
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-72 flex-shrink-0 self-start"
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
            <SlidersHorizontal size={14} className="text-amber-500" />
          </div>
          <span className="text-gray-800 font-semibold text-sm">Filters</span>
        </div>

        {/* Keyword */}
        <div className="mb-4">
          <label className={labelClass}>Search</label>
          <input
            className={inputClass}
            placeholder="Location, keyword..."
            value={filters.keyword}
            onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>

        {/* Purpose */}
        <Section id="purpose" label="Purpose" openSections={openSections} toggle={toggle}>
          <div className="flex gap-2">
            {['all', 'rent', 'sale'].map(p => (
              <button
                key={p}
                onClick={() => setFilters(prev => ({ ...prev, purpose: p }))}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filters.purpose === p
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </Section>

        {/* Location */}
        <div className="mb-4">
          <label className={labelClass}>Location</label>
          <select
            className={inputClass}
            value={filters.location}
            onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
          >
            <option value="All">All Locations</option>
            {['Eskaton', 'Mohammadpur', 'Uttara', 'Malibag', 'Banasree', 'Mirpur 1', 'Gulshan 2'].map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <Section id="price" label="Price (BDT)" openSections={openSections} toggle={toggle}>
          <div className="flex gap-2">
            <input className={inputClass} placeholder="Min" type="number" value={filters.minPrice}
              onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))} />
            <input className={inputClass} placeholder="Max" type="number" value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))} />
          </div>
        </Section>

        {/* Size */}
        <Section id="size" label="Size (Sq.ft)" openSections={openSections} toggle={toggle}>
          <div className="flex gap-2">
            <input className={inputClass} placeholder="Min" type="number" value={filters.minSize}
              onChange={e => setFilters(prev => ({ ...prev, minSize: e.target.value }))} />
            <input className={inputClass} placeholder="Max" type="number" value={filters.maxSize}
              onChange={e => setFilters(prev => ({ ...prev, maxSize: e.target.value }))} />
          </div>
        </Section>

        {/* Bedrooms */}
        <Section id="beds" label="Bedrooms" openSections={openSections} toggle={toggle}>
          <div className="flex gap-2 flex-wrap">
            {['Any', '1', '2', '3', '4', '5+'].map(bed => (
              <button
                key={bed}
                onClick={() => setFilters(prev => ({ ...prev, beds: bed }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filters.beds === bed
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {bed}
              </button>
            ))}
          </div>
        </Section>

        {/* Posted By */}
        <div className="mb-6">
          <label className={labelClass}>Posted By</label>
          <div className="flex gap-2">
            {['All', 'Owner', 'Company'].map(type => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, postedBy: type }))}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filters.postedBy === type
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm rounded-xl transition-all hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-95"
          >
            Search
          </button>
          <button
            onClick={onClear}
            className="px-4 py-3 bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-700 rounded-xl transition-all hover:border-gray-300"
          >
            <X size={15} />
          </button>
        </div>

        {/* Requirement Button */}
        <button className="w-full mt-3 py-2.5 text-xs text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-50 transition-all font-semibold">
          Tell Us Your Requirement
        </button>
      </div>
    </motion.aside>
  );
}