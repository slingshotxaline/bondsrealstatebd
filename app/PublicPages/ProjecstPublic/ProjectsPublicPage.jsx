'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';
import { projectAPI } from '@/app/lib/api';

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70';

// ── reuse your existing small components ──────────────────────────────────────
function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/15 min-w-[56px]">
      <span className="text-white/55 text-[9px] uppercase tracking-widest font-medium leading-none">{label}</span>
      <span className="text-white font-bold text-sm leading-none mt-0.5">{value}</span>
    </div>
  );
}

function tagStyle(tag) {
  const map = {
    Featured: 'bg-[#004835] text-white',
    New:      'bg-sky-600 text-white',
    Premium:  'bg-violet-600 text-white',
    Exclusive:'bg-rose-600 text-white',
  };
  return map[tag] ?? 'bg-gray-700 text-white';
}

function statusStyle(status) {
  return status === 'Ready'
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : status === 'Upcoming'
    ? 'bg-blue-50 text-blue-700 border border-blue-200'
    : 'bg-amber-50 text-amber-700 border border-amber-200';
}

function ProjectCard({ proj, index }) {
  const [open, setOpen] = useState(false);

  // Fixed spec fields + custom fields combined for details panel
  const details = [
    proj.floors  && { label: 'Total Floors', value: `${proj.floors} Floors` },
    proj.year    && { label: 'Completion',   value: proj.year               },
    proj.parking && { label: 'Parking',      value: proj.parking            },
    proj.status  && { label: 'Status',       value: proj.status             },
    // Custom fields from admin
    ...(proj.customFields || []).map(f => ({ label: f.key, value: f.value })),
  ].filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <Link href={`/projects/${proj._id}`}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: 'clamp(210px, 26vw, 290px)' }}>
          <img
            src={proj.mainImage?.url || FALLBACK}
            alt={proj.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={e => e.currentTarget.src = FALLBACK}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${proj.accentColor || 'from-emerald-900/80 to-emerald-700/40'}`} style={{ opacity: 0.82 }} />

          {/* badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {proj.tag && proj.tag !== 'None' && (
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${tagStyle(proj.tag)}`}>{proj.tag}</span>
            )}
            <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full ml-auto ${statusStyle(proj.status)}`}>{proj.status}</span>
          </div>

          {/* title + pills */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white/55 text-[9px] uppercase tracking-widest font-medium mb-0.5">{proj.type}</p>
            <h3 className="text-white font-bold text-xl leading-tight mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              {proj.title}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {proj.area   && <StatPill label="sqft"   value={proj.area}   />}
              {proj.rooms  && <StatPill label="beds"   value={proj.rooms}  />}
              {proj.baths  && <StatPill label="baths"  value={proj.baths}  />}
              {proj.floors && <StatPill label="floors" value={proj.floors} />}
            </div>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center gap-1.5 text-[#004835]">
          <MapPin size={11} />
          <span className="text-xs text-gray-400 truncate">{proj.location}</span>
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2">{proj.description}</p>

        <div className="h-px bg-gray-100" />

        {/* Spec grid */}
        <div className={`grid gap-1.5 ${proj.customFields?.length > 0 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {proj.area    && <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-1"><span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Area</span><span className="text-[11px] font-bold text-gray-700">{proj.area}ft²</span></div>}
          {proj.rooms   && <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-1"><span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Beds</span><span className="text-[11px] font-bold text-gray-700">{proj.rooms}</span></div>}
          {proj.baths   && <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-1"><span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Baths</span><span className="text-[11px] font-bold text-gray-700">{proj.baths}</span></div>}
          {proj.parking && <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-1"><span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Park</span><span className="text-[11px] font-bold text-gray-700">{proj.parking}</span></div>}
        </div>

        {/* Expandable details */}
        {details.length > 0 && (
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: open ? 400 : 0, opacity: open ? 1 : 0 }}
          >
            <div className="pt-1">
              <div className="bg-[#004835]/5 rounded-2xl p-3.5 border border-[#004835]/10">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#004835] mb-2.5">Full Details</p>
                {details.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#004835]/10 last:border-0">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{d.label}</span>
                    <span className="text-sm font-semibold text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          {details.length > 0 && (
            <button
              onClick={() => setOpen(v => !v)}
              className="flex-1 text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-full border border-[#004835] text-[#004835] hover:bg-[#004835] hover:text-white transition-all duration-200 cursor-pointer"
            >
              {open ? 'Hide' : 'Details'}
            </button>
          )}
          <Link
            href={`/projects/${proj._id}`}
            className="flex items-center gap-1.5 bg-[#004835] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full hover:bg-[#003528] transition-colors duration-200"
          >
            View More →
          </Link>
          <a
            href="#contact"
            className="flex items-center gap-1.5 border border-[#004835] text-[#004835] text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full hover:bg-[#004835] hover:text-white transition-colors duration-200"
          >
            Enquire
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsPublicPage() {
  const [projects,     setProjects]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = activeFilter !== 'All' ? `filter=${activeFilter}` : '';
    projectAPI.getAll(params)
      .then(d => {
        setProjects(d.data || []);
        setCategories(['All', ...(d.categories || [])]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-[#0a1f19] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
            <em className="italic font-light text-[#5cffbc]">Projects</em>
          </h1>
          <nav className="flex items-center justify-center gap-2 text-[10px] text-white/40 tracking-widest uppercase">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white/70">Projects</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        {/* Header + filters */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-px bg-[#004835]" />
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Featured List</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
              <em className="italic font-light text-[#004835]">Our Projects</em>
            </h2>
          </div>

          {/* Dynamic filter tabs from API */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer
                  ${activeFilter === f
                    ? 'bg-[#004835] text-white border-[#004835]'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-[#004835] hover:text-[#004835]'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6 tracking-wide">
          Showing <span className="font-bold text-gray-700">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="text-[#004835] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((proj, i) => <ProjectCard key={proj._id} proj={proj} index={i} />)}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-300 text-6xl mb-4">🏗</p>
            <p className="text-gray-400 text-sm">No projects found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}