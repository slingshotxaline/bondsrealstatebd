"use client";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ─── data ───────────────────────────────────────────────────── */
const services = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-11 h-11">
        <rect x="8" y="20" width="32" height="22" rx="2" />
        <path d="M4 22L24 6L44 22" />
        <path d="M18 42V30h12v12" />
        <circle cx="24" cy="16" r="3" />
      </svg>
    ),
    title: "Residential Apartments",
    desc: "Modern family residences with spacious layouts, natural ventilation, and refined finishes designed for elevated urban living.",
    accent: "#004835",
    tag: "01",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-11 h-11">
        <rect x="10" y="16" width="28" height="24" rx="2" />
        <rect x="14" y="8" width="20" height="12" rx="2" />
        <rect x="14" y="8" width="8" height="6" rx="1" />
        <rect x="26" y="8" width="8" height="6" rx="1" />
        <path d="M10 28h28M18 22v18M30 22v18" />
      </svg>
    ),
    title: "Mixed-Use Developments",
    desc: "Integrated commercial and residential environments that combine business convenience with private living.",
    accent: "#004835",
    tag: "02",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-11 h-11">
        <rect x="8" y="10" width="14" height="30" rx="2" />
        <rect x="26" y="18" width="14" height="22" rx="2" />
        <path d="M12 18h6M12 24h6M12 30h6M30 26h6M30 32h6" />
        <path d="M15 40v4M33 40v4" />
      </svg>
    ),
    title: "Luxury Living Spaces",
    desc: "Premium apartment experiences with contemporary architecture, expansive balconies, and lifestyle-focused planning.",
    accent: "#004835",
    tag: "03",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-11 h-11">
        <rect x="6" y="28" width="8" height="14" rx="1" />
        <rect x="18" y="20" width="8" height="22" rx="1" />
        <rect x="30" y="12" width="8" height="30" rx="1" />
        <path d="M8 24L20 16L32 8M32 8h-6M32 8v6" />
      </svg>
    ),
    title: "Real Estate Investment Opportunities",
    desc: "Strategically located developments designed for long-term appreciation and future-ready living.",
    accent: "#004835",
    tag: "04",
  },
];

const stats = [
  { num: 500, suffix: "+", label: "Properties Sold" },
  { num: 98, suffix: "%", label: "Client Satisfaction" },
  { num: 12, suffix: "+", label: "Years Experience" },
  { num: 200, suffix: "+", label: "Verified Listings" },
];

/* ─── animated counter ───────────────────────────────────────── */
function AnimatedStat({ num, suffix, label, start }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const ctrl = animate(0, num, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.floor(v)),
    });
    return ctrl.stop;
  }, [start, num]);

  return (
    <div className="text-center group">
      <motion.p
        className="text-3xl lg:text-4xl font-bold mb-1"
        style={{ color: "#004835", fontFamily: "'Georgia', serif" }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {val}{suffix}
      </motion.p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}

/* ─── card ───────────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function ServiceCard({ s, i, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={i * 0.1 + 0.2}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
      className="relative group flex flex-col items-center text-center p-8 rounded-3xl border bg-white overflow-hidden cursor-default"
      style={{
        borderColor: hovered ? "rgba(0,72,53,0.3)" : "#f0efec",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,72,53,0.1)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Animated background fill on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,72,53,0.035)", borderRadius: 24 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Tag number — top right */}
      <span
        className="absolute top-5 right-6 text-xs font-semibold tracking-widest"
        style={{ color: "rgba(0,72,53,0.25)", fontFamily: "sans-serif" }}
      >
        {s.tag}
      </span>

      {/* Orbiting ring around icon */}
      <div className="relative mb-6">
        {/* Outer spinning dashed ring — continuous */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1.5px dashed rgba(0,72,53,0.2)",
            margin: "-8px",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(0,72,53,0.12)", margin: "-3px" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative w-[88px] h-[88px] rounded-full flex items-center justify-center"
          style={{
            background: hovered ? "rgba(0,72,53,0.1)" : "#f5f4f0",
            border: "1px solid",
            borderColor: hovered ? "rgba(0,72,53,0.35)" : "#e8e6e0",
            color: hovered ? "#004835" : "#6b7280",
            transition: "all 0.35s",
          }}
          animate={hovered ? { rotate: [0, -4, 4, 0] } : { rotate: 0 }}
          transition={{ duration: 0.4 }}
        >
          {s.icon}
        </motion.div>
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-gray-900 mb-3 leading-snug"
        style={{ fontSize: "15.5px", fontFamily: "'Georgia', serif" }}
      >
        {s.title}
      </h3>

      {/* Desc */}
      <p className="text-gray-500 leading-relaxed" style={{ fontSize: "13.5px", fontFamily: "sans-serif" }}>
        {s.desc}
      </p>

      {/* Bottom accent line — slides in on hover */}
      <motion.div
        className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full"
        style={{ background: "#004835" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </motion.div>
  );
}

/* ─── floating sketch bg ─────────────────────────────────────── */
function SketchBg() {
  return (
    <motion.div
      className="absolute -left-6 top-0 bottom-0 w-44 pointer-events-none select-none"
      style={{ opacity: 0.045 }}
      animate={{ x: [0, 6, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 600" fill="none" stroke="#004835" strokeWidth="0.8" className="w-full h-full">
        <path d="M100 580 L100 20 M80 60 L100 20 L120 60 M60 100 L100 60 L140 100 M40 150 L100 100 L160 150" />
        <rect x="60" y="200" width="80" height="100" rx="2" />
        <rect x="70" y="330" width="60" height="80" rx="2" />
        <path d="M60 200 L100 170 L140 200" />
      </svg>
    </motion.div>
  );
}

/* ─── main ───────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <section
      id="services"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: "#FAFAF9" }}
    >
      <SketchBg />

      {/* Continuous floating orb — top right */}
      <motion.div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(0,72,53,0.05)" }}
        animate={{ scale: [1, 1.12, 1], x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom left orb */}
      <motion.div
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "rgba(0,72,53,0.04)" }}
        animate={{ scale: [1, 1.08, 1], x: [0, -8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <motion.span
              className="inline-block h-px bg-[#004835]"
              style={{ width: 28 }}
              animate={{ width: [20, 36, 20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              className="text-gray-500 text-sm font-medium tracking-wider uppercase"
              style={{ fontFamily: "sans-serif" }}
            >
              Services
            </span>
            <motion.span
              className="inline-block h-px bg-[#004835]"
              style={{ width: 28 }}
              animate={{ width: [20, 36, 20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.h2
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em className="font-light italic">Services for your property milestones</em> 
          </motion.h2>

          {/* Animated underline */}
          <motion.div
            className="mx-auto mt-5 h-[2px] rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #004835, transparent)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: 120, opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} inView={inView} />
          ))}
        </div>

        {/* ── Stats ── */}
        <motion.div
          ref={statsRef}
          custom={0.6}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 relative"
        >
          {/* Divider line — animates in */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #e5e3de, transparent)" }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
          />

          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i * 0.1 + 0.7}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <AnimatedStat {...stat} start={statsInView} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}