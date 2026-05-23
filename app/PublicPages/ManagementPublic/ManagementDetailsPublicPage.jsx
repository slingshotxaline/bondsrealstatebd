"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Team Data ───────────────────────────────────── */
// To use real photos: add `image: "/images/team/filename.jpg"` to each member
const teamMembers = [
  {
    id: 1,
    name: "Syed Mahmud Hasan",
    designation: "Chairman",
    image: null,
    gender: "male",
    quote:
      "Our mission is not only to create impact today, but to build sustainable systems that empower future generations across Bangladesh.",
  },
  {
    id: 2,
    name: "Farzana Rahman",
    designation: "Managing Director",
    image: null,
    gender: "female",
    quote:
      "Innovation, empathy, and accountability are the three pillars that guide every initiative we undertake.",
  },
  {
    id: 3,
    name: "Md. Tanvir Hossain",
    designation: "Chief Executive Officer (CEO)",
    image: null,
    gender: "male",
    quote:
      "True development happens when communities gain both opportunity and the confidence to shape their own future.",
  },
  {
    id: 4,
    name: "Nusrat Jahan Chowdhury",
    designation: "Executive Director",
    image: null,
    gender: "female",
    quote:
      "We believe meaningful progress begins by listening to people, understanding their realities, and acting with purpose.",
  },
  {
    id: 5,
    name: "A.K.M. Rezaul Karim",
    designation: "Director, Strategy & Operations",
    image: null,
    gender: "male",
    quote:
      "Our goal is to combine technology, research, and human-centered solutions to create lasting social transformation.",
  },
];

/* ─── Generic Silhouette Avatar SVG ─────────────── */
// bgColor  : card background
// figColor : silhouette fill
const SilhouetteAvatar = ({ bgColor = "#1B6B5A", figColor = "#004835" }) => (
  <svg
    viewBox="0 0 200 220"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* background */}
    <rect width="200" height="220" fill={bgColor} />

    {/* subtle radial glow behind figure */}
    <ellipse cx="100" cy="130" rx="80" ry="70" fill={figColor} opacity="0.12" />

    {/* silhouette – head */}
    <circle cx="100" cy="76" r="38" fill={figColor} opacity="0.85" />

    {/* silhouette – shoulders / body */}
    <ellipse cx="100" cy="185" rx="66" ry="48" fill={figColor} opacity="0.85" />

    {/* neck gap (same as bg) */}
    <ellipse cx="100" cy="118" rx="20" ry="10" fill={bgColor} />
  </svg>
);

/* per-member palette pairs  [bgColor, figColor] */
const palettes = {
  1: ["#0d3d2f", "#004835"],
  2: ["#2d1b4e", "#c084fc"],
  3: ["#0a2540", "#60a5fa"],
  4: ["#3b1f2b", "#f9a8d4"],
  5: ["#1a2e1a", "#86efac"],
};

/* ─── Avatar / Image helper ─────────────────────── */
function CardVisual({ member }) {
  if (member.image) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>
    );
  }
  const [bg, fig] = palettes[member.id] ?? ["#1B6B5A", "#004835"];
  return <SilhouetteAvatar bgColor={bg} figColor={fig} />;
}

function ModalVisual({ member }) {
  if (member.image) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top rounded-2xl"
          sizes="230px"
        />
      </div>
    );
  }
  const [bg, fig] = palettes[member.id] ?? ["#1B6B5A", "#004835"];
  return <SilhouetteAvatar bgColor={bg} figColor={fig} />;
}

/* ─── Card ──────────────────────────────────────── */
function MemberCard({ member, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      onClick={() => onClick(member)}
      className="relative cursor-pointer select-none group"
    >
      <motion.div
        variants={{ hover: { y: -10 } }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl bg-white shadow-md"
      >
        {/* Gold corner blob */}
        {/* <div className="absolute top-0 right-0 z-10 w-[72px] h-[72px] bg-[#004835] rounded-bl-[100%] rounded-tr-2xl" /> */}
        {/* D monogram */}
        {/* <span
          className="absolute top-3 right-3.5 z-20 text-white text-xl font-black leading-none select-none"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
        >
          D
        </span> */}

        {/* Avatar / Image area */}
        <div className="relative w-full h-[230px] overflow-hidden">
          <CardVisual member={member} />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1B6B5A]/85"
            variants={{ hover: { opacity: 1 } }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-11 h-11 rounded-full border-2 border-white/70 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <span className="text-white text-[11px] font-bold tracking-[0.15em] uppercase">
              View Profile
            </span>
          </motion.div>
        </div>

        {/* Name strip */}
        <div className="px-4 pt-3 pb-4 bg-white border-t-[3px] border-[#004835]">
          <span className="inline-block bg-[#e8f4f0] text-[#1B6B5A] text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-1 rounded mb-1.5">
            {member.designation}
          </span>
          <p
            className="text-[14px] font-bold text-gray-900 leading-snug m-0"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {member.name}
          </p>
        </div>

        {/* Bottom gradient strip */}
        <div className="h-1 bg-gradient-to-r from-[#1B6B5A] to-[#004835]" />
      </motion.div>
    </motion.div>
  );
}

/* ─── Modal ─────────────────────────────────────── */
function Modal({ member, onClose }) {
  return (
    <AnimatePresence>
      {member && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(5,20,15,0.82)", backdropFilter: "blur(10px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-white shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 font-bold text-base hover:bg-gray-100 transition-colors cursor-pointer border-0"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left image panel */}
              <div className="relative md:w-56 flex-shrink-0 min-h-[280px] flex flex-col items-center justify-end overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#004835] to-[#c07a10]" />
                <div className="absolute top-0 left-0 right-0 h-[60%] rounded-b-[60%] bg-white/10" />

                {/* Avatar */}
                <div className="relative z-10 w-40 h-[175px] mb-14 rounded-2xl overflow-hidden shadow-xl">
                  <ModalVisual member={member} />
                </div>

                {/* Name strip */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#1B6B5A] px-4 py-3 z-20">
                  <p
                    className="text-white font-bold text-[14px] m-0 leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {member.name}
                  </p>
                  <p className="text-[#004835] text-[11px] font-semibold mt-0.5 m-0">
                    {member.designation}
                  </p>
                </div>
              </div>

              {/* Right details panel */}
              <div className="flex-1 p-8">
                <h2
                  className="text-2xl font-bold text-gray-900 m-0 mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {member.name}
                </h2>
                <p className="text-[#1B6B5A] font-semibold text-sm m-0 mb-5">
                  {member.designation}
                </p>

                {/* Divider */}
                <div className="h-0.5 bg-gradient-to-r from-[#004835] to-transparent rounded mb-6" />

                {/* Quote */}
                <div className="bg-amber-50 border-l-4 border-[#004835] rounded-r-xl px-5 py-4 relative">
                  <span className="absolute -top-2 left-3 text-5xl leading-none text-[#004835] opacity-40 font-serif select-none">
                    "
                  </span>
                  <p className="text-sm leading-relaxed text-gray-600 italic m-0 pt-2">
                    {member.quote}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Leadership", "Strategy", "Impact", "Bangladesh"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#e8f4f0] text-[#1B6B5A] text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Page ──────────────────────────────────────── */
export default function ManagementTeamPage() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* ── Banner ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#f4f2ed]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#004835] opacity-[0.08]" />
        <div className="absolute bottom-8 -left-14 w-56 h-56 rounded-full bg-[#004835] opacity-[0.07]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute top-0 right-[15%] w-1.5 h-full bg-[#004835] opacity-25 -skew-x-[8deg]" />
        <div className="absolute top-0 right-[17%] w-0.5 h-full bg-[#004835] opacity-15 -skew-x-[8deg]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#004835]/15 border border-[#004835]/40 rounded-full px-4 py-1.5 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#004835] inline-block" />
            <span className="text-[#004835] text-[11px] font-bold tracking-[0.18em] uppercase">
              Our Leadership
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-black font-extrabold leading-[1.1] mb-4 m-0"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(38px, 6vw, 68px)",
              maxWidth: 600,
            }}
          >
            Management<br />
            <span className="text-[#004835]">Team</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-black text-base leading-[1.75] max-w-md mb-9"
          >
            Guided by purpose, driven by impact — the visionaries shaping a better Bangladesh through strategy, empathy, and innovation.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex gap-10 flex-wrap"
          >
            {[["5+", "Leaders"], ["15+", "Years Avg. Experience"], ["1M+", "Lives Impacted"]].map(
              ([num, label]) => (
                <div key={label}>
                  <p
                    className="text-[#004835]  font-extrabold m-0 leading-none mb-1 text-center"
                    style={{ fontFamily: "'', serif", fontSize: 32 }}
                  >
                    {num}
                  </p>
                  <p className="text-black text-xs font-medium m-0 tracking-wide">{label}</p>
                </div>
              )
            )}
          </motion.div>
        </div>

        {/* Wave */}
        <svg
          viewBox="0 0 1440 55"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: 44, marginTop: -1 }}
          fill="#f4f2ed"
        >
          <path d="M0,55 C360,0 1080,45 1440,12 L1440,55 Z" />
        </svg>
      </section>

      {/* ── Team Grid ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 md:gap-6">
          {teamMembers.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} onClick={setSelected} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-400 text-sm mt-10"
        >
          Click any card to view their message
        </motion.p>
      </section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && <Modal member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </main>
  );
}