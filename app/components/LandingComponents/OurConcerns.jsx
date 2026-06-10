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

const concerns = [
  {
    id: 1,
    name: "Bonds International Ltd.",
    description:
      "A premier intending firm that facilitates seamless trade by connecting national and international suppliers, buyers, and vendors. Specializing in the global import, export, and distribution of consumer goods, we manage the entire supply chain from product sourcing to after-sales service.",
  },
  {
    id: 2,
    name: "Bonds Developments and Logistics Ltd.",
    description:
      "Provides end-to-end infrastructure and supply chain solutions tailored to support diverse commercial needs. This concern focuses on optimizing the movement of goods while managing strategic development projects to ensure operational efficiency.",
  },
  {
    id: 3,
    name: "Tillage Aqua Culture Ltd.",
    description:
      "Spanning an impressive 100 bighas, this agro and fisheries project is dedicated to boosting agricultural productivity and sustainable fisheries management. It operates across both government and non-government sectors.",
  },
  {
    id: 4,
    name: "Sadarpur Dairy and Poultry Ltd.",
    description:
      "Located on a vast 150-bigha estate in Atroshi, Sadarpur (Faridpur), this integrated farm specializes in high-yield dairy and poultry production. The facility employs modern, sustainable farming practices to consistently supply fresh, premium-quality products.",
  },
  {
    id: 5,
    name: "Sky Logistics (BD) Ltd.",
    description:
      "A dedicated supply chain and freight management enterprise that ensures the seamless movement of domestic and international cargo. Serving as a crucial operational wing of the broader business group, it specializes in secure, timely, and cost-effective distribution solutions.",
  },
];

const icons = {
  1: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-10 h-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="#004835" opacity="0.12" />
      <path
        d="M14 32V20l10-6 10 6v12H28v-7h-8v7H14Z"
        stroke="#004835"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <rect
        x="20"
        y="25"
        width="8"
        height="7"
        rx="1"
        stroke="#004835"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M10 32h28"
        stroke="#C49B40"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  2: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-10 h-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="#004835" opacity="0.12" />
      <rect
        x="11"
        y="20"
        width="26"
        height="14"
        rx="2"
        stroke="#004835"
        strokeWidth="2"
        fill="none"
      />
      <path d="M11 24h26" stroke="#C49B40" strokeWidth="1.5" />
      <path
        d="M17 20v-4a7 7 0 0 1 14 0v4"
        stroke="#004835"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="18" cy="27" r="2" fill="#C49B40" />
      <circle cx="30" cy="27" r="2" fill="#C49B40" />
    </svg>
  ),
  3: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-10 h-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="#004835" opacity="0.12" />
      <path
        d="M24 12c-5 0-10 4-10 10 0 7 10 16 10 16s10-9 10-16c0-6-5-10-10-10Z"
        stroke="#004835"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M18 28c2-3 8-8 12-4"
        stroke="#C49B40"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="24"
        cy="22"
        rx="3"
        ry="4"
        stroke="#004835"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  ),
  4: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-10 h-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="#004835" opacity="0.12" />
      <ellipse
        cx="24"
        cy="30"
        rx="12"
        ry="5"
        stroke="#004835"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M12 30V22c0-3 5-6 12-6s12 3 12 6v8"
        stroke="#004835"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 20c1 2 4 3 8 3s7-1 8-3"
        stroke="#C49B40"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  5: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-10 h-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="#004835" opacity="0.12" />
      <path
        d="M10 30h20l4-12h4"
        stroke="#004835"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="16"
        cy="34"
        r="3"
        stroke="#C49B40"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="28"
        cy="34"
        r="3"
        stroke="#C49B40"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M10 22h16"
        stroke="#C49B40"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const AUTO_PLAY_INTERVAL = 4000;

/* Floating orb that drifts continuously */
function FloatingOrb({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        scale: [1, 1.08, 0.96, 1.05, 1],
        opacity: [0.18, 0.28, 0.15, 0.25, 0.18],
      }}
      transition={{
        duration: style.duration ?? 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: style.delay ?? 0,
      }}
    />
  );
}

/* Animated counter */
function Counter({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    String(Math.round(v)).padStart(2, "0")
  );

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}

/* Magnetic card wrapper */
function MagneticCard({ children, className, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [6, -6]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-6, 6]), {
    stiffness: 180,
    damping: 20,
  });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Shimmer line that runs across the top bar */
function ShimmerBar() {
  return (
    <div
      className="h-1 w-full relative overflow-hidden"
      style={{ background: "linear-gradient(90deg,#004835,#C49B40)" }}
    >
      <motion.div
        className="absolute inset-y-0 w-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
        }}
        animate={{ x: ["-100%", "250%"] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.2,
        }}
      />
    </div>
  );
}

export default function OurConcerns() {
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    const update = () => setCardsPerView(window.innerWidth >= 1024 ? 3 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = concerns.length;
  const maxIndex = Math.max(total - cardsPerView, 0);

  const resetTimer = (nextFn) => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(nextFn, AUTO_PLAY_INTERVAL);
  };

  useEffect(() => {
    const tick = () => setCurrent((p) => (p >= maxIndex ? 0 : p + 1));
    timerRef.current = setInterval(tick, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [maxIndex]);

  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(i, maxIndex));
    setCurrent(clamped);
    resetTimer(() => setCurrent((p) => (p >= maxIndex ? 0 : p + 1)));
  };

  const goPrev = () => goTo(current <= 0 ? maxIndex : current - 1);
  const goNext = () => goTo(current >= maxIndex ? 0 : current + 1);

  const translateX = `${-(current * (100 / cardsPerView))}%`;

  /* Stagger for visible cards */
  const visibleIds = concerns
    .slice(current, current + cardsPerView)
    .map((c) => c.id);

  return (
    <section
      id="ourconcerns"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "#fafaf8" }}
    >
      {/* Ambient floating orbs */}
      <FloatingOrb
        style={{
          width: 320,
          height: 320,
          top: "-80px",
          right: "-100px",
          background: "radial-gradient(circle,#004835 0%,transparent 70%)",
          duration: 14,
          delay: 0,
        }}
      />
      <FloatingOrb
        style={{
          width: 260,
          height: 260,
          bottom: "-60px",
          left: "-80px",
          background: "radial-gradient(circle,#C49B40 0%,transparent 70%)",
          duration: 11,
          delay: 2,
        }}
      />
      <FloatingOrb
        style={{
          width: 180,
          height: 180,
          top: "40%",
          right: "10%",
          background: "radial-gradient(circle,#004835 0%,transparent 70%)",
          duration: 16,
          delay: 4,
        }}
      />

      {/* Subtle grain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
           
            <motion.span
              className="inline-block h-px"
              style={{ background: "#C49B40" }}
              initial={{ width: 0 }}
              whileInView={{ width: 28 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <span className="text-gray-500 text-sm font-medium tracking-widest uppercase">
              Since 2000
            </span>
            <motion.span
              className="inline-block h-px"
              style={{ background: "#C49B40" }}
              initial={{ width: 0 }}
              whileInView={{ width: 28 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div> */}

          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <motion.em
              className="font-light italic"
              style={{ color: "#004835" }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Our  Concerns
            </motion.em>{" "}
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
             
            </motion.span>
          </h2>

          {/* Animated underline */}
          <motion.div
            className="mx-auto mt-4 h-0.5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #004835, transparent)",
            }}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
          />

          <motion.p
            className="text-gray-400 text-base md:text-lg mt-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            We are proud of our service since 2000
          </motion.p>
        </motion.div>

        {/* ── Slider ── */}
        <div className="relative">
          {/* Prev */}
          <motion.button
            onClick={goPrev}
            whileHover={{ scale: 1.12, borderColor: "#C49B40" }}
            whileTap={{ scale: 0.93 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-5 hidden lg:flex
                       items-center justify-center w-11 h-11 rounded-full shadow-md bg-white border border-gray-200"
            aria-label="Previous"
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <path
                d="M10 3L5 8l5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>

          {/* Next */}
          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.12, borderColor: "#C49B40" }}
            whileTap={{ scale: 0.93 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-5 hidden lg:flex
                       items-center justify-center w-11 h-11 rounded-full shadow-md bg-white border border-gray-200"
            aria-label="Next"
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <path
                d="M6 3l5 5-5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>

          {/* Track */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: translateX }}
              transition={{ type: "spring", stiffness: 260, damping: 34 }}
            >
              {concerns.map((concern, idx) => (
                <MagneticCard
                  key={concern.id}
                  className="flex-shrink-0 rounded-2xl overflow-hidden bg-white shadow-md group
                             border border-gray-100 cursor-pointer"
                  style={{
                    width: cardsPerView === 3 ? "calc(33.333% - 1rem)" : "100%",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.65,
                      delay: idx * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      boxShadow: "0 20px 48px rgba(0,72,53,0.13)",
                      borderColor: "#C49B40",
                      y: -4,
                    }}
                    transition2={{ duration: 0.28 }}
                    className="h-full border border-transparent rounded-2xl"
                  >
                    {/* Shimmer top bar */}
                    <ShimmerBar />

                    {/* Card body */}
                    <div className="px-6 pt-7 pb-8 flex flex-col gap-4">
                      {/* Icon + ghost number */}
                      <div className="flex items-center justify-between">
                        {/* <motion.div
                          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                          transition={{ duration: 0.45 }}
                        >
                          {icons[concern.id]}
                        </motion.div> */}
                        <motion.span
                          className="text-5xl font-black leading-none select-none"
                          style={{
                            color: "#004835",
                            opacity: 0.08,
                            fontFamily: "'Georgia', serif",
                          }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.08 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3 + idx * 0.1 }}
                        >
                          <Counter value={concern.id} />
                        </motion.span>
                      </div>

                      {/* Name */}
                      <motion.h3
                        className="font-bold text-gray-900 text-lg leading-snug"
                        style={{ fontFamily: "'Georgia', serif" }}
                        whileHover={{ color: "#004835" }}
                        transition={{ duration: 0.2 }}
                      >
                        {concern.name}
                      </motion.h3>

                      {/* Animated divider */}
                      <motion.div
                        className="h-px rounded-full"
                        style={{ background: "#C49B40" }}
                        initial={{ width: 16 }}
                        whileInView={{ width: 40 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.5 + idx * 0.1 }}
                        whileHover={{ width: 64 }}
                      />

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {concern.description}
                      </p>

                      {/* Hover pill */}
                      <motion.div
                        className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100"
                        initial={false}
                        transition={{ duration: 0.25 }}
                      >
                        <motion.span
                          className="text-xs font-semibold tracking-wide uppercase"
                          style={{ color: "#C49B40" }}
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          Learn more
                        </motion.span>
                        <motion.svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.08,
                          }}
                        >
                          <path
                            d="M2 7h10M8 3l4 4-4 4"
                            stroke="#C49B40"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </motion.div>
                    </div>
                  </motion.div>
                </MagneticCard>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile Buttons */}
        <div className="flex justify-center gap-4 mt-6 lg:hidden">
          <motion.button
            onClick={goPrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white border border-gray-200"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white border border-gray-200"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>

        {/* ── Dots ── */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full"
              animate={{
                width: i === current ? 28 : 10,
                height: 10,
                backgroundColor: i === current ? "#C49B40" : "#d1cbbf",
                opacity: i === current ? 1 : 0.55,
              }}
              whileHover={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
            />
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div
          className="mt-5 mx-auto rounded-full overflow-hidden"
          style={{ height: 2, width: 160, background: "#e8e4dc" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#004835,#C49B40)" }}
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  );
}
