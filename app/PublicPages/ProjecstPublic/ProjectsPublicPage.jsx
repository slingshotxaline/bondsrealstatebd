"use client";
import Link from "next/link";
import { useState } from "react";

const properties = [
  {
    id: 1,
    type: "Premium Apartment",
    title: "BONDS Khan Palace",
    desc: "A premium apartment development featuring luxury single-unit residences with spacious interiors, elegant finishes, and thoughtfully planned modern living spaces.",
    area: "2850",
    rooms: "4",
    baths: "4",
    floors: "12",
    parking: "Yes",
    status: "Ready",
    location: "Sector-13, Jolshiri Abashon",
    year: "2024",
    filter: "Apartments",
    mainImg: "/assets/LandingProject/UKhanProject/UKhan1.jpg",
    accentColor: "from-emerald-900/80 to-emerald-700/40",
    tag: "Featured",
  },
  {
    id: 2,
    type: "Residential Apartment",
    title: "Sahara BONDS",
    desc: "A contemporary residential community with abundant natural light, ventilation, and access to green walkways and community amenities.",
    area: "2850",
    rooms: "4",
    baths: "4",
    floors: "10",
    parking: "Yes",
    status: "Ongoing",
    location: "Sector-16, Jolshiri Abashon",
    year: "2025",
    filter: "Apartments",
    mainImg: "/assets/LandingProject/USaharaProject/SaharaUnified.jpeg",
    accentColor: "from-stone-900/80 to-stone-700/40",
    tag: "New",
  },
  {
    id: 3,
    type: "Lifestyle Residences",
    title: "BONDS Golf Heights",
    desc: "Lifestyle-focused residences overlooking expansive green zones, a golf arena, and scenic surroundings designed for elevated everyday living.",
    area: "2850",
    rooms: "4",
    baths: "4",
    floors: "8",
    parking: "Yes",
    status: "Ready",
    location: "Sector-17, Jolshiri Abashon",
    year: "2023",
    filter: "Lifestyle",
    mainImg: "/assets/LandingProject/UGolfProject/UGolf1.jpg",
    accentColor: "from-teal-900/80 to-teal-700/40",
    tag: "Premium",
  },
  {
    id: 4,
    type: "Residential Apartment",
    title: "Project Bashundhara",
    desc: "A striking architectural landmark with sweeping balconies, modern aesthetics, and a prestigious residential atmosphere in the heart of the city.",
    area: "1650",
    rooms: "3",
    baths: "3",
    floors: "9",
    parking: "Yes",
    status: "Ongoing",
    location: "Sector-7, Jolshiri Abashon",
    year: "2025",
    filter: "Apartments",
    mainImg: "/assets/LandingProject/BashundharaProject/Bashundhara1.jpg",
    accentColor: "from-zinc-900/80 to-zinc-700/40",
    tag: "Exclusive",
  },
];

const FILTERS = ["All", "Apartments", "Lifestyle", "Villas"];

const FALLBACK =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70";

/* ── Stat pill (inside image) ── */
function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/15 min-w-[56px]">
      <span className="text-white/55 text-[9px] uppercase tracking-widest font-medium leading-none">
        {label}
      </span>
      <span className="text-white font-bold text-sm leading-none mt-0.5">{value}</span>
    </div>
  );
}

/* ── Spec tile (below image) ── */
function SpecTile({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-1">
      <span className="text-[#004835]">{icon}</span>
      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider leading-none">
        {label}
      </span>
      <span className="text-[11px] font-bold text-gray-700 leading-none">{value}</span>
    </div>
  );
}

/* ── Detail row (expandable) ── */
function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#004835]/10 last:border-0">
      <div className="flex items-center gap-2 text-[#004835]/60">
        {icon}
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

/* ── SVG Icons ── */
const AreaIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 3v18" />
  </svg>
);
const BedIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 14h18M7 14V9a1 1 0 011-1h8a1 1 0 011 1v5" />
  </svg>
);
const BathIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4zM4 12V5a2 2 0 014 0v7" />
    <circle cx="4" cy="5" r="1" />
  </svg>
);
const CarIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M7 17v2M17 17v2" />
    <circle cx="8" cy="14" r="1.5" />
    <circle cx="16" cy="14" r="1.5" />
  </svg>
);
const FloorIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const PinIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const ArrowIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/* ── Tag badge color ── */
function tagStyle(tag) {
  const map = {
    Featured: "bg-[#004835] text-white",
    New: "bg-sky-600 text-white",
    Premium: "bg-violet-600 text-white",
    Exclusive: "bg-rose-600 text-white",
  };
  return map[tag] ?? "bg-gray-700 text-white";
}

/* ── Status badge color ── */
function statusStyle(status) {
  return status === "Ready"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-amber-50 text-amber-700 border border-amber-200";
}

/* ── Project Card ── */
function ProjectCard({ prop }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">

      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: "clamp(210px, 26vw, 290px)" }}
      >
        <img
          src={prop.mainImg}
          alt={prop.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />

        {/* gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${prop.accentColor}`}
          style={{ opacity: 0.82 }}
        />

        {/* top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${tagStyle(prop.tag)}`}
          >
            {prop.tag}
          </span>
          <span
            className={`text-[9px] font-semibold px-2.5 py-1 rounded-full ${statusStyle(prop.status)}`}
          >
            {prop.status}
          </span>
        </div>

        {/* bottom: title + stat pills */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white/55 text-[9px] uppercase tracking-widest font-medium mb-0.5">
            {prop.type}
          </p>
          <h3
            className="text-white font-bold text-xl leading-tight mb-3"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {prop.title}
          </h3>
          <div className="flex gap-2 flex-wrap">
            <StatPill label="sqft" value={prop.area} />
            <StatPill label="beds" value={prop.rooms} />
            <StatPill label="baths" value={prop.baths} />
            <StatPill label="floors" value={prop.floors} />
          </div>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* location */}
        <div className="flex items-center gap-1.5 text-[#004835]">
          <PinIcon />
          <span className="text-xs text-gray-400 truncate">{prop.location}</span>
        </div>

        {/* description */}
        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2">
          {prop.desc}
        </p>

        {/* divider */}
        <div className="h-px bg-gray-100" />

        {/* 4-column spec tiles */}
        <div className="grid grid-cols-4 gap-1.5">
          <SpecTile icon={<AreaIcon />} label="Area" value={`${prop.area}ft²`} />
          <SpecTile icon={<BedIcon />} label="Beds" value={prop.rooms} />
          <SpecTile icon={<BathIcon />} label="Baths" value={prop.baths} />
          <SpecTile icon={<CarIcon />} label="Park" value={prop.parking} />
        </div>

        {/* ── Expandable detail panel ── */}
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: open ? 300 : 0, opacity: open ? 1 : 0 }}
        >
          <div className="pt-1">
            <div className="bg-[#004835]/5 rounded-2xl p-3.5 border border-[#004835]/10">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#004835] mb-2.5">
                Full Details
              </p>
              <DetailRow
                icon={<FloorIcon />}
                label="Total Floors"
                value={`${prop.floors} Floors`}
              />
              <DetailRow
                icon={<CalendarIcon />}
                label="Completion"
                value={prop.year}
              />
              <DetailRow
                icon={<CarIcon />}
                label="Parking"
                value={prop.parking}
              />
              <DetailRow
                icon={<CheckIcon />}
                label="Status"
                value={
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle(prop.status)}`}
                  >
                    {prop.status}
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex-1 text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-full border border-[#004835] text-[#004835] hover:bg-[#004835] hover:text-white transition-all duration-200 cursor-pointer"
          >
            {open ? "Hide" : "Details"}
          </button>
          <a
            href="#contact"
            className="flex items-center gap-1.5 bg-[#004835] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full hover:bg-[#003528] transition-colors duration-200"
          >
            Enquire <ArrowIcon />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ── Page ── */
export default function ProjectsPublicPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? properties
      : properties.filter((p) => p.filter === activeFilter);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Banner ── */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-[#0a1f19] flex flex-col items-center justify-center overflow-hidden">
        {/* grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* decorative rings */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />

        <div className="relative z-10 text-center px-4">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em className="italic font-light text-[#5cffbc]">Projects</em> 
          </h1>
          <nav className="flex items-center justify-center gap-2 text-[10px] text-white/40 tracking-widest uppercase">
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>›</span>
            <span className="text-white/70">Project</span>
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">

        {/* Section header + filters */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-px bg-[#004835]" />
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
                Featured List
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <em className="italic font-light text-[#004835]">Our</em> Projects
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  activeFilter === f
                    ? "bg-[#004835] text-white border-[#004835]"
                    : "bg-white text-gray-400 border-gray-200 hover:border-[#004835] hover:text-[#004835]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* result count */}
        <p className="text-xs text-gray-400 mb-6 tracking-wide">
          Showing{" "}
          <span className="font-bold text-gray-700">{filtered.length}</span>{" "}
          project{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid — 1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((prop) => (
            <ProjectCard key={prop.id} prop={prop} />
          ))}
        </div>

        {/* empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-300 text-6xl mb-4">🏗</p>
            <p className="text-gray-400 text-sm">
              No projects found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}