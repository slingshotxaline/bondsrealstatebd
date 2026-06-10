"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─── data ───────────────────────────────────────────────────── */
const properties = [
  {
    id: 1,
    type: "Premium Apartment",
    title: "BONDS  Khan Palace",
    desc: "A premium apartment development featuring luxury single-unit residences with spacious interiors, elegant finishes, and thoughtfully planned modern living spaces.",
    area: "2850 sq ft",
    rooms: "4 Beds",
    baths: "4",
    parking: "Yes",
    location: "Sector-13, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/UKhanProject/UKhan1.jpg",
    thumbImg: "/assets/LandingProject/UKhanProject/Ukhan2.jpg",
  },
  {
    id: 2,
    type: "Residential Apartment",
    title: "Sahara BONDS ",
    desc: "A contemporary residential community positioned on a quiet street with abundant natural light, ventilation, and access to green walkways and community amenities.",
    area: "2850 sq ft",
    rooms: "4 Beds",
    baths: "4",
    parking: "Yes",
    location: "Sector-16, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/USaharaProject/SaharaUnified.jpeg",
    thumbImg: "/assets/LandingProject/USaharaProject/Sahara2.jpg",
  },
  {
    id: 3,
    type: "Lifestyle-focused Residences",
    title: "BONDS  Golf Heights",
    desc: "Lifestyle-focused residences overlooking expansive green zones, a golf arena, and scenic surroundings designed for elevated everyday living.",
    area: "2850 sq ft",
    rooms: "4 Beds",
    baths: "4",
    parking: "Yes",
    location: "Sector-17, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/UGolfProject/UGolf1.jpg",
    thumbImg: "/assets/LandingProject/UGolfProject/UGolf2.jpg",
  },
//   {
//     id: 4,
//     type: "Luxury Villa",
//     title: "Bonds Khan Tower",
//     desc: "An expansive residential development balancing sophisticated architecture with open layouts, daylight optimization, and urban connectivity.",
//     area: "6200 sq ft",
//     rooms: "Open Plan",
//     baths: "6",
//     parking: "Yes",
//     location: "Sector-9, Jolshiri Abashon",
//     mainImg: "/assets/LandingProject/BondsKhanProject/bonds khan press tower 1.jpeg",
//     thumbImg: "/assets/LandingProject/BondsKhanProject/bonds2.jpg",
//   },
  {
    id: 4,
    type: "Residential Apartment",
    title: "Project Bashundhara",
    desc: "A striking architectural landmark with sweeping balconies, modern aesthetics, and a prestigious residential atmosphere.",
    area: "1650 sq ft",
    rooms: "3 Beds",
    baths: "3",
    parking: "Yes",
    location: "Sector-7, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/BashundharaProject/Bashundhara1.jpg",
    thumbImg: "/assets/LandingProject/BashundharaProject/Bashundhara2.jpg",
  },
];

/* ─── icons ──────────────────────────────────────────────────── */
const SpecIcon = ({ type }) => {
  const icons = {
    area: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" />
      </svg>
    ),
    bed: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 14h18M7 14V9a1 1 0 011-1h8a1 1 0 011 1v5" />
      </svg>
    ),
    bath: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4zM4 12V5a2 2 0 014 0v7" />
        <circle cx="4" cy="5" r="1" />
      </svg>
    ),
    car: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M7 17v2M17 17v2" />
        <circle cx="8" cy="14" r="1.5" /><circle cx="16" cy="14" r="1.5" />
      </svg>
    ),
  };
  return icons[type] || null;
};

const specs = [
  { icon: "area", label: "Total Area", key: "area" },
  { icon: "bed",  label: "Rooms",      key: "rooms" },
  { icon: "bath", label: "Baths",      key: "baths" },
  { icon: "car",  label: "Parking",    key: "parking" },
];

/* ─── floating orb ───────────────────────────────────────────── */
function Orb({ style, delay = 0, dur = 8 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ background: "rgba(0,72,53,0.05)", ...style }}
      animate={{ scale: [1, 1.12, 1], x: [0, 8, 0], y: [0, -8, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── thumbnail strip ────────────────────────────────────────── */
function ThumbStrip({ active, setActive }) {
  return (
    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 flex-shrink-0">
      {properties.map((p, i) => (
        <motion.button
          key={p.id}
          onClick={() => setActive(i)}
          className="relative flex-shrink-0 rounded-xl overflow-hidden focus:outline-none"
          style={{
            width: 72, height: 72,
            border: i === active ? "2px solid #004835" : "2px solid transparent",
            transition: "border-color 0.3s",
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
        >
          <img
            src={p.thumbImg}
            alt={p.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=60")}
          />
          {/* active overlay */}
          <AnimatePresence>
            {i === active && (
              <motion.div
                className="absolute inset-0"
                style={{ background: "rgba(0,72,53,0.25)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
          {/* number badge */}
          <span
            className="absolute bottom-1 right-1.5 text-white font-bold leading-none"
            style={{ fontSize: 9, fontFamily: "sans-serif", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── main image panel ───────────────────────────────────────── */
function MainImage({ prop }) {
  return (
    <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ minHeight: 320 }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={prop.id}
          src={prop.mainImg}
          alt={prop.title}
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=70")}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </AnimatePresence>

      {/* Continuous shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.12) 50%, transparent 62%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Type badge — top left */}
      <AnimatePresence mode="wait">
        <motion.div
          key={prop.id + "-badge"}
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white"
          style={{ background: "rgba(0,72,53,0.82)", fontSize: 11, fontFamily: "sans-serif", letterSpacing: "0.4px" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {prop.type}
        </motion.div>
      </AnimatePresence>

      {/* Location overlay — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.68), transparent)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={prop.id + "-loc"}
            className="flex items-center gap-2 text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </motion.div>
            <div>
              <p className="font-semibold text-sm">{prop.title}</p>
              <p className="text-white/75 text-xs">{prop.location}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pulsing corner dot */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <motion.span
          className="w-2 h-2 rounded-full"
          style={{ background: "#5cffbc" }}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="text-white text-[10px]" style={{ fontFamily: "sans-serif" }}>Live</span>
      </div>
    </div>
  );
}

/* ─── detail card ────────────────────────────────────────────── */
function DetailCard({ prop }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={prop.id}
        className="flex flex-col h-full"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -28 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Type */}
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2"
           style={{ color: "#004835", fontFamily: "sans-serif" }}>
          {prop.type}
        </p>

        {/* Title */}
        <h3
          className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight uppercase"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.04em" }}
        >
          {prop.title}
        </h3>

        {/* Animated accent line */}
        <motion.div
          className="h-[2px] rounded-full mb-5"
          style={{ background: "linear-gradient(90deg, #004835, rgba(0,72,53,0.15))" }}
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        />

        {/* Desc */}
        <p className="text-gray-500 text-[13.5px] leading-[1.8] mb-7"
           style={{ fontFamily: "sans-serif" }}>
          {prop.desc}
        </p>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.key}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "#f5f4f0", border: "0.5px solid #e8e6e0" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 + 0.15, duration: 0.4, ease: "easeOut" }}
              whileHover={{ backgroundColor: "rgba(0,72,53,0.07)", borderColor: "rgba(0,72,53,0.25)" }}
            >
              <span className="text-[#004835] flex-shrink-0">
                <SpecIcon type={spec.icon} />
              </span>
              <div>
                <p className="text-[10px] text-gray-400 leading-none mb-0.5"
                   style={{ fontFamily: "sans-serif", letterSpacing: "0.3px" }}>
                  {spec.label}
                </p>
                <p className="text-[13px] font-semibold text-gray-800"
                   style={{ fontFamily: "sans-serif" }}>
                  {prop[spec.key] ?? "—"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="#contact"
          className="inline-flex items-center gap-3 self-start text-[13px] font-semibold px-6 py-3.5 rounded-full"
          style={{ background: "#f3f2ee", color: "#111", fontFamily: "sans-serif" }}
          whileHover={{ backgroundColor: "#004835", color: "#fff" }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.25 }}
        >
          More About Us
          <motion.span
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#004835" }}
            whileHover={{ backgroundColor: "#fff" }}
            transition={{ duration: 0.25 }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.span>
        </motion.a>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── section ────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.68, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ProjectsSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prop = properties[active];

  return (
    <section id="projects" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Background orbs — continuous */}
      <Orb style={{ width: 320, height: 320, top: -80, right: -80 }} dur={9} />
      <Orb style={{ width: 200, height: 200, bottom: -60, left: -60 }} dur={11} delay={1.5} />

      {/* Rotating ring */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 180, height: 180,
          top: "5%", right: "8%",
          border: "1px dashed rgba(0,72,53,0.1)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <motion.span
              className="inline-block h-px bg-[#004835]"
              style={{ width: 28 }}
              animate={{ width: [20, 36, 20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-gray-500 text-sm font-medium tracking-wider uppercase"
                  style={{ fontFamily: "sans-serif" }}>
              Featured List
            </span>
            <motion.span
              className="inline-block h-px bg-[#004835]"
              style={{ width: 28 }}
              animate={{ width: [20, 36, 20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.h2
            custom={0.1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-4xl lg:text-5xl font-bold text-gray-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em className="font-light italic text-[#004835]">Our Projects</em> 
          </motion.h2>

          <motion.div
            className="mx-auto mt-4 h-[2px] rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #004835, transparent)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: 100, opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>

        {/* ── Main layout ── */}
        <motion.div
          custom={0.3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-[1fr_420px] gap-8 items-stretch"
        >

          {/* Left — image + thumb strip */}
          <div className="flex flex-col gap-4">
            {/* Thumb strip (horizontal on mobile) */}
            <div className="flex lg:hidden gap-3 overflow-x-auto pb-1">
              <ThumbStrip active={active} setActive={setActive} />
            </div>

            {/* Image row */}
            <div className="flex gap-3" style={{ height: "clamp(300px, 45vw, 500px)" }}>
              {/* Vertical thumb strip — desktop only */}
              <div className="hidden lg:flex flex-col gap-3">
                <ThumbStrip active={active} setActive={setActive} />
              </div>
              <MainImage prop={prop} />
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "#f0efec" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "#004835" }}
                  animate={{ width: `${((active + 1) / properties.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0"
                    style={{ fontFamily: "sans-serif" }}>
                {String(active + 1).padStart(2, "0")} / {String(properties.length).padStart(2, "0")}
              </span>
            </div>

            {/* Nav arrows */}
            <div className="flex items-center gap-3">
              {[
                { dir: -1, label: "prev" },
                { dir: 1, label: "next" },
              ].map(({ dir, label }) => (
                <motion.button
                  key={label}
                  onClick={() => setActive((prev) => (prev + dir + properties.length) % properties.length)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid #e5e3de", color: "#004835" }}
                  whileHover={{ backgroundColor: "#004835", color: "#fff", borderColor: "#004835" }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.22 }}
                  aria-label={label}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d={dir === -1 ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </motion.button>
              ))}

              {/* Dot indicators */}
              <div className="flex gap-2 ml-1">
                {properties.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActive(i)}
                    className="rounded-full"
                    style={{ background: i === active ? "#004835" : "#d5d3ce" }}
                    animate={{
                      width: i === active ? 28 : 10,
                      height: 10,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    aria-label={`Go to project ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — detail card */}
          <div
            className="rounded-3xl p-7 lg:p-8"
            style={{ border: "0.5px solid #e8e6e0", background: "#fdfcfa" }}
          >
            <DetailCard prop={prop} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}