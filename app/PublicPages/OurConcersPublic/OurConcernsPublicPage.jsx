"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import Link from "next/link";

const concerns = [
  {
    id: 1,
    name: "Bonds International Ltd.",
    description:
      "A premier intending firm that facilitates seamless trade by connecting national and international suppliers, buyers, and vendors. Specializing in the global import, export, and distribution of consumer goods, we manage the entire supply chain from product sourcing to after-sales service.",
    tag: "Trade & Commerce",
    color: "#004835",
  },
  {
    id: 2,
    name: "Bonds Developments and Logistics Ltd.",
    description:
      "Provides end-to-end infrastructure and supply chain solutions tailored to support diverse commercial needs. This concern focuses on optimizing the movement of goods while managing strategic development projects to ensure operational efficiency.",
    tag: "Logistics",
    color: "#C49B40",
  },
  {
    id: 3,
    name: "Tillage Aqua Culture Ltd.",
    description:
      "Spanning an impressive 100 bighas, this agro and fisheries project is dedicated to boosting agricultural productivity and sustainable fisheries management. It operates across both government and non-government sectors.",
    tag: "Agriculture",
    color: "#004835",
  },
  {
    id: 4,
    name: "Sadarpur Dairy and Poultry Ltd.",
    description:
      "Located on a vast 150-bigha estate in Atroshi, Sadarpur (Faridpur), this integrated farm specializes in high-yield dairy and poultry production. The facility employs modern, sustainable farming practices to consistently supply fresh, premium-quality products.",
    tag: "Farming",
    color: "#C49B40",
  },
  {
    id: 5,
    name: "Sky Logistics (BD) Ltd.",
    description:
      "A dedicated supply chain and freight management enterprise that ensures the seamless movement of domestic and international cargo. Serving as a crucial operational wing of the broader business group, it specializes in secure, timely, and cost-effective distribution solutions.",
    tag: "Freight",
    color: "#004835",
  },
];

const icons = {
  1: (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
      <path d="M14 32V20l10-6 10 6v12H28v-7h-8v7H14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 32h28" stroke="#C49B40" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
      <rect x="11" y="20" width="26" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M17 20v-4a7 7 0 0 1 14 0v4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="27" r="2" fill="#C49B40" />
      <circle cx="30" cy="27" r="2" fill="#C49B40" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
      <path d="M24 12c-5 0-10 4-10 10 0 7 10 16 10 16s10-9 10-16c0-6-5-10-10-10Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M18 28c2-3 8-8 12-4" stroke="#C49B40" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="24" cy="22" rx="3" ry="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
      <ellipse cx="24" cy="30" rx="12" ry="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 30V22c0-3 5-6 12-6s12 3 12 6v8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 20c1 2 4 3 8 3s7-1 8-3" stroke="#C49B40" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  5: (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
      <path d="M10 30h20l4-12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="34" r="3" stroke="#C49B40" strokeWidth="1.8" />
      <circle cx="28" cy="34" r="3" stroke="#C49B40" strokeWidth="1.8" />
      <path d="M10 22h16" stroke="#C49B40" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

/* ── Animated Counter ── */
function Counter({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(2, "0"));
  useEffect(() => {
    const c = animate(count, value, { duration: 1.4, ease: "easeOut" });
    return c.stop;
  }, [value]);
  return <motion.span>{rounded}</motion.span>;
}

/* ── Shimmer bar ── */
function ShimmerBar({ color }) {
  return (
    <div className="h-[3px] w-full relative overflow-hidden rounded-full" style={{ background: color }}>
      <motion.div
        className="absolute inset-y-0 w-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
        animate={{ x: ["-100%", "260%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
      />
    </div>
  );
}

/* ── Concern Card ── */
function ConcernCard({ concern, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-60, 60], [5, -5]), { stiffness: 160, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-60, 60], [-5, 5]), { stiffness: 160, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const isGold = concern.color === "#C49B40";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 cursor-pointer"
      whileHover={{ y: -6, boxShadow: "0 24px 56px rgba(0,72,53,0.13)" }}
    >
      {/* Top accent bar */}
      <ShimmerBar color={concern.color} />

      {/* Card body */}
      <div className="flex flex-col gap-4 p-6 flex-1">

        {/* Ghost number + icon row */}
        <div className="flex items-start justify-between">
          {/* Icon circle */}
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ background: `${concern.color}15`, color: concern.color }}
            animate={hovered ? { rotate: [0, -6, 6, 0], scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            {icons[concern.id]}
          </motion.div>

          {/* Ghost number */}
          <span
            className="text-6xl font-black leading-none select-none"
            style={{ color: concern.color, opacity: 0.07, fontFamily: "'Georgia', serif" }}
          >
            <Counter value={concern.id} />
          </span>
        </div>

        {/* Tag pill */}
        <div className="flex">
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: `${concern.color}15`, color: concern.color }}
          >
            {concern.tag}
          </span>
        </div>

        {/* Name */}
        <motion.h3
          className="font-bold text-gray-900 text-[17px] leading-snug"
          style={{ fontFamily: "'Georgia', serif" }}
          animate={hovered ? { color: concern.color } : { color: "#111827" }}
          transition={{ duration: 0.2 }}
        >
          {concern.name}
        </motion.h3>

        {/* Animated divider */}
        <motion.div
          className="h-px rounded-full"
          style={{ background: concern.color }}
          initial={{ width: 20 }}
          whileInView={{ width: 44 }}
          viewport={{ once: true }}
          whileHover={{ width: 72 }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
        />

        {/* Description */}
        <p className="text-gray-400 text-[13px] leading-relaxed flex-1">
          {concern.description}
        </p>

        {/* Learn more — visible on hover */}
        <motion.div
          className="flex items-center gap-2"
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.22 }}
        >
          <motion.span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: concern.color }}
            animate={hovered ? { x: [0, 4, 0] } : { x: 0 }}
            transition={{ duration: 1.4, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
          >
            Learn more
          </motion.span>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke={concern.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Floating orb ── */
function FloatingOrb({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -28, 10, -18, 0], x: [0, 14, -8, 18, 0], scale: [1, 1.07, 0.96, 1.04, 1], opacity: [0.12, 0.2, 0.1, 0.18, 0.12] }}
      transition={{ duration: style.dur ?? 13, repeat: Infinity, ease: "easeInOut", delay: style.delay ?? 0 }}
    />
  );
}

/* ── Page ── */
export default function OurConcernsPublicPage() {
  return (
    <div className="min-h-screen bg-white mt-10">

      {/* ── Hero Banner ── */}
      <div className="relative h-52 sm:h-60 md:h-72 bg-[#0a1f19] flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* decorative rings */}
        <motion.div
          className="absolute rounded-full border border-white/5 pointer-events-none"
          style={{ width: 340, height: 340, top: -120, right: -100 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute rounded-full border border-white/5 pointer-events-none"
          style={{ width: 260, height: 260, bottom: -90, left: -80 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        {/* gold accent dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ background: "#C49B40", left: `${15 + i * 14}%`, top: `${30 + (i % 2) * 30}%`, opacity: 0.4 }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.6, 1] }}
            transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}

        <div className="relative z-10 text-center px-4">
          <motion.div
            className="flex items-center justify-center gap-3 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className="h-px bg-[#C49B40]" initial={{ width: 0 }} animate={{ width: 28 }} transition={{ duration: 0.8, delay: 0.3 }} />
            <span className="text-[9px] uppercase tracking-widest text-[#C49B40] font-semibold">Since 2000</span>
            <motion.span className="h-px bg-[#C49B40]" initial={{ width: 0 }} animate={{ width: 28 }} transition={{ duration: 0.8, delay: 0.3 }} />
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <em className="italic font-light text-[#5cffbc]">Our Concern</em> 
          </motion.h1>

          <motion.p
            className="text-white/40 text-xs mt-3 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We are proud of our service since 2000
          </motion.p>

          <motion.nav
            className="flex items-center justify-center gap-2 text-[10px] text-white/30 tracking-widest uppercase mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white/60">Our Concern</span>
          </motion.nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "#fafaf8" }}>
        {/* ambient orbs */}
        <FloatingOrb style={{ width: 300, height: 300, top: -80, right: -100, background: "radial-gradient(circle,#004835 0%,transparent 70%)", dur: 14 }} />
        <FloatingOrb style={{ width: 240, height: 240, bottom: -60, left: -80, background: "radial-gradient(circle,#C49B40 0%,transparent 70%)", dur: 11, delay: 2 }} />
        <FloatingOrb style={{ width: 160, height: 160, top: "40%", right: "8%", background: "radial-gradient(circle,#004835 0%,transparent 70%)", dur: 16, delay: 4 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">

          {/* Section header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.span className="h-px bg-[#C49B40]" initial={{ width: 0 }} whileInView={{ width: 28 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
              <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Our Concerns</span>
              <motion.span className="h-px bg-[#C49B40]" initial={{ width: 0 }} whileInView={{ width: 28 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
              <em className="italic font-light" style={{ color: "#004835" }}>Diverse Ventures</em> 
            </h2>

            <motion.div
              className="mx-auto mt-4 h-0.5 rounded-full"
              style={{ background: "linear-gradient(90deg,transparent,#004835,transparent)" }}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.5 }}
            />

            <motion.p
              className="text-gray-400 text-sm md:text-base mt-5 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              A family of companies united by purpose — driving commerce, agriculture, logistics, and innovation across Bangladesh and beyond.
            </motion.p>
          </motion.div>

          {/* Count strip */}
          {/* <motion.div
            className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {[
              { label: "Years Active", value: "25+" },
              { label: "Concerns", value: "05" },
              { label: "Bighas Land", value: "250+" },
              { label: "Countries", value: "20+" },
              { label: "Team Members", value: "500+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-white rounded-xl py-4 px-2 border border-gray-100"
                whileHover={{ borderColor: "#C49B40", y: -3 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="text-xl font-black" style={{ color: "#004835", fontFamily: "'Georgia', serif" }}>{stat.value}</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest text-center leading-tight">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Cards grid — 1 col mobile, 2 col md, 3 col lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerns.map((concern, index) => (
              <ConcernCard key={concern.id} concern={concern} index={index} />
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}