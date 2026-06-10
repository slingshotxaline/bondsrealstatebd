"use client";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ─── animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: -28 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const imgReveal = {
  hidden: { opacity: 0, scale: 0.93, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.14, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const statsCard = {
  hidden: { opacity: 0, y: 16, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] },
  },
};

/* ─── counter hook ───────────────────────────────────────────── */
function useCounter(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const controls = animate(0, target, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return controls.stop;
  }, [start, target, duration]);
  return value;
}

/* ─── shimmer overlay ────────────────────────────────────────── */
function Shimmer() {
  return (
    <motion.div
      className="absolute inset-0 rounded-[18px] pointer-events-none"
      style={{
        background:
          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── main component ─────────────────────────────────────────── */
export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const counterStarted = useInView(ref, { once: true, margin: "-120px" });
  const count = useCounter(150, 1800, counterStarted);

  const advantages = [
    "Premium Residential Developments",
    "Sustainable Urban Planning",
    "Contemporary Architectural Design",
    "Trusted Development Expertise",
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 bg-white overflow-hidden relative"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Background ring decoration */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(0,72,53,0.04)" }}
      />

      <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── IMAGE GRID ───────────────────────────────────────── */}
          <div className="relative">
            {/* Floating image grid — continuous bob */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="grid grid-cols-2 gap-2.5 h-[500px] sm:h-[540px]"
            >
              {/* Top-left */}
              <motion.div
                custom={0}
                variants={imgReveal}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="relative rounded-[18px] overflow-hidden group"
              >
                <motion.img
                  src="/assets/About/about2.jpg"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80")
                  }
                  alt="Modern interior kitchen"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                <div className="absolute inset-0 rounded-[18px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                     style={{ background: "linear-gradient(135deg,rgba(0,72,53,0.15) 0%,transparent 60%)" }} />
                <Shimmer />
              </motion.div>

              {/* Right tall — row-span-2, continuous inner parallax */}
              <motion.div
                custom={0.1}
                variants={imgReveal}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="row-span-2 relative rounded-[18px] overflow-hidden group"
              >
                <motion.img
                  src="/assets/About/about1.jpg"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80")
                  }
                  alt="Modern house exterior"
                  className="w-full h-full object-cover"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.06 }}
                  style={{ transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                />
                <div className="absolute inset-0 rounded-[18px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                     style={{ background: "linear-gradient(135deg,rgba(0,72,53,0.15) 0%,transparent 60%)" }} />
                {/* Badge */}
                <motion.div
                  className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full text-white z-10"
                  style={{
                    background: "rgba(0,72,53,0.88)",
                    fontSize: "11.5px",
                    fontFamily: "sans-serif",
                    letterSpacing: "0.4px",
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#5cffbc" }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  Premium Living
                </motion.div>
                <Shimmer />
              </motion.div>

              {/* Bottom-left */}
              <motion.div
                custom={0.22}
                variants={imgReveal}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="relative rounded-[18px] overflow-hidden group"
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                  alt="House keys blueprint"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                <div className="absolute inset-0 rounded-[18px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                     style={{ background: "linear-gradient(135deg,rgba(0,72,53,0.15) 0%,transparent 60%)" }} />
                <Shimmer />
              </motion.div>
            </motion.div>

            {/* Floating stats card */}
            {/* <motion.div
              variants={statsCard}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="absolute -bottom-5 -left-4 sm:-left-6 z-10 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white"
              style={{
                border: "0.5px solid rgba(0,72,53,0.2)",
                boxShadow: "0 10px 36px rgba(0,72,53,0.14)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,72,53,0.1)" }}
              >
                <svg width="18" height="18" fill="none" stroke="#004835" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p
                  className="leading-none mb-0.5"
                  style={{ fontSize: "22px", fontWeight: 700, color: "#004835", fontFamily: "'Georgia', serif" }}
                >
                  {count}+
                </p>
                <p style={{ fontSize: "11px", color: "#888", fontFamily: "sans-serif", letterSpacing: "0.3px" }}>
                  Projects Delivered
                </p>
              </div>
            </motion.div> */}

            {/* Decorative pulsing rings */}
            {[0, 1.2].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: i === 0 ? 100 : 62,
                  height: i === 0 ? 100 : 62,
                  top: i === 0 ? -20 : 8,
                  right: i === 0 ? -28 : 0,
                  border: "1.5px solid rgba(0,72,53,0.14)",
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* ── CONTENT ──────────────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            {/* <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex items-center gap-3 mb-4"
            >
              <span className="inline-block w-7 h-px bg-[#004835]" />
              <span
                style={{ fontSize: "11px", letterSpacing: "2.5px", fontFamily: "sans-serif" }}
                className="text-[#004835] font-medium uppercase"
              >
                About Us
              </span>
            </motion.div> */}

            {/* Heading */}
            <motion.h2
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-[clamp(32px,4vw,48px)] font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <em className="font-light italic text-[#004835]">About  Us</em>
            </motion.h2>

            {/* Body */}
            <motion.p
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-gray-500 text-[15px] leading-[1.85] mb-8"
              style={{ fontFamily: "sans-serif" }}
            >
              Bonds Real Estate is driven by a commitment to modern urban living,
              combining innovative planning, premium construction standards, and
              sustainable development principles. Every development reflects our
              focus on quality, functionality, and enduring value, transforming
              locations into thriving communities and refined living environments.
            </motion.p>

            {/* Advantages box */}
            <motion.div
              custom={0}
              variants={fadeRight}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="border-l-[3.5px] border-[#004835] pl-6 mb-10 py-5 pr-6 rounded-r-xl"
              style={{ background: "#f9f8f5" }}
            >
              <h4
                className="font-semibold italic text-gray-800 mb-4 text-[15px]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Our Business Advantages
              </h4>
              <ul className="space-y-2.5" style={{ fontFamily: "sans-serif" }}>
                {advantages.map((item, i) => (
                  <motion.li
                    key={item}
                    custom={i}
                    variants={fadeRight}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="flex items-center gap-2.5 text-gray-600 text-[13.5px]"
                  >
                    <span
                      className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#004835]"
                      style={{ background: "rgba(0,72,53,0.1)" }}
                    >
                      ✓
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* CTA */}
            <motion.div
              custom={0.4}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex items-center gap-4 flex-wrap"
            >
              <motion.a
                href="#team"
                className="inline-flex items-center gap-3 text-[13px] font-semibold px-5 py-3.5 rounded-full transition-all duration-300 group"
                style={{ background: "#f3f2ee", color: "#111", fontFamily: "sans-serif" }}
                whileHover={{ backgroundColor: "#004835", color: "#fff" }}
                whileTap={{ scale: 0.97 }}
              >
                More About Us
                <motion.span
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                  style={{ background: "#004835" }}
                  whileHover={{ backgroundColor: "#fff" }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </motion.span>
              </motion.a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}