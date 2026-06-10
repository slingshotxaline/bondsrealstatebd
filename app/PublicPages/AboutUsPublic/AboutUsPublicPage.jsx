"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const highlights = [
  "Premium Residential Developments",
  "Sustainable Urban Planning",
  "Contemporary Architectural Design",
  "Trusted Development Expertise",
];

const values = [
  {
    title: "Customer-Centricity",
    description:
      "Placing the needs and aspirations of our clients at the forefront, ensuring seamless experiences from booking to handover.",
    icon: "🤝",
  },
  {
    title: "Sustainable Innovation",
    description:
      "Integrating eco-friendly building practices, smart technologies, and forward-thinking designs.",
    icon: "🌱",
  },
  {
    title: "Community Enhancement",
    description:
      "Creating developments that improve infrastructure and quality of life for the surrounding community.",
    icon: "🏙️",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.13,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function AboutUs() {
  const heroRef = useRef(null);
  const [hoveredHighlight, setHoveredHighlight] = useState(null);
  const [activeValue, setActiveValue] = useState(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section className="bg-white overflow-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="py-16 md:py-24 lg:py-32 relative">
        {/* ambient bg blob */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", type: "tween" }}
          style={{
            position: "absolute", top: -120, right: -120, width: 480, height: 480,
            borderRadius: "50%", background: "radial-gradient(circle, #e8f5ef 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 1 }}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* IMAGE SECTION */}
            <motion.div style={{ y: parallaxY }} className="relative">
              <div
                className="grid grid-cols-2 gap-3"
                style={{ height: "clamp(380px, 55vw, 620px)" }}
              >
                {/* Image 1 — top left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className="relative overflow-hidden rounded-[28px]"
                  style={{ boxShadow: "0 16px 48px rgba(0,72,53,0.15)" }}
                >
                  <motion.img
                    src="/assets/About/about2.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,72,53,0.3) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }} />
                </motion.div>

                {/* Image 2 — tall right, row-span-2 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className="relative overflow-hidden rounded-[28px] row-span-2"
                  style={{ boxShadow: "0 16px 48px rgba(0,72,53,0.15)" }}
                >
                  <motion.img
                    src="/assets/About/about1.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", type: "tween" }}
                    whileHover={{ scale: 1.06 }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,72,53,0.35) 0%, transparent 55%)",
                    pointerEvents: "none",
                  }} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-5 left-5 bg-[#004835] text-white px-4 py-2 rounded-full text-xs font-medium"
                  >
                    Premium Living
                  </motion.div>
                </motion.div>

                {/* Image 3 — bottom left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className="relative overflow-hidden rounded-[28px]"
                  style={{ boxShadow: "0 16px 48px rgba(0,72,53,0.15)" }}
                >
                  <motion.img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </div>

              {/* Decorative Rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    top: -12 - i * 10,
                    right: -12 - i * 10,
                    width: 48 + i * 20,
                    height: 48 + i * 20,
                    border: `1.5px solid rgba(0,72,53,${0.25 - i * 0.07})`,
                    pointerEvents: "none",
                  }}
                  animate={{ scale: [1, 1.18 + i * 0.06, 1], opacity: [0.5, 0.15, 0.5] }}
                  transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6, type: "tween", ease: "easeInOut" }}
                />
              ))}
            </motion.div>

            {/* CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                custom={0.1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="text-[clamp(32px,4vw,48px)] font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                <em className="font-light italic text-[#004835]">About Us</em> 
              </motion.h2>

              <motion.p
                custom={0.2}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-6 text-gray-600 leading-8"
              >
                Bonds Real Estate is driven by a commitment to modern urban
                living, combining innovative planning, premium construction
                standards, and sustainable development principles.
              </motion.p>

              <motion.p
                custom={0.3}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-4 text-gray-600 leading-8"
              >
                Every development reflects our focus on quality, functionality,
                and enduring value, transforming locations into thriving
                communities and refined living environments.
              </motion.p>

              <motion.div
                custom={0.4}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-8 border-l-4 border-[#004835] pl-6"
              >
                <h4 className="font-semibold text-gray-900 mb-4">
                  Our Business Advantages
                </h4>

                <ul className="space-y-3">
                  {highlights.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      onHoverStart={() => setHoveredHighlight(i)}
                      onHoverEnd={() => setHoveredHighlight(null)}
                      whileHover={{ x: 6 }}
                      className="flex items-center gap-3 text-gray-600"
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        background: hoveredHighlight === i ? "#e8f5ef" : "transparent",
                        transition: "background 0.25s",
                        cursor: "default",
                      }}
                    >
                      <motion.span
                        animate={{ scale: hoveredHighlight === i ? 1.2 : 1 }}
                        transition={{ duration: 0.2, type: "tween" }}
                        className="w-6 h-6 rounded-full bg-[#004835]/10 flex items-center justify-center text-[#004835] text-xs flex-shrink-0"
                      >
                        ✓
                      </motion.span>
                      {item}
                      <motion.span
                        animate={{ opacity: hoveredHighlight === i ? 1 : 0, x: hoveredHighlight === i ? 0 : -6 }}
                        transition={{ duration: 0.2, type: "tween" }}
                        className="ml-auto text-[#004835] text-sm"
                      >
                        →
                      </motion.span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#004835]/10 flex items-center justify-center text-3xl mb-6">
                👁️
              </div>
              <h3 className="text-3xl font-bold mb-6 text-black">Vision</h3>
              <p className="text-gray-600 leading-8">
                To redefine the landscape of modern living and commerce by
                developing sustainable, innovative, and comfortable real estate
                projects that stand as enduring landmarks of excellence and
                community growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6 }}
              className="bg-[#004835] text-white rounded-[32px] p-8 md:p-12"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl mb-6">
                🎯
              </div>
              <h3 className="text-3xl font-bold mb-6">Mission</h3>
              <p className="leading-8 text-white/90">
                To deliver superior residential and commercial real estate
                solutions through meticulous planning, uncompromising structural
                quality, and ethical business practices while fostering
                environmentally responsible urban development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-[clamp(32px,4vw,48px)] font-bold text-gray-900 mb-6 leading-tight text-center"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em className="font-light italic text-[#004835]">Core Values</em> 
          </motion.h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.14, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setActiveValue(activeValue === i ? null : i)}
                className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.05)] text-black relative overflow-hidden cursor-pointer"
                style={{
                  border: activeValue === i ? "2px solid #004835" : "1px solid #f3f4f6",
                  background: activeValue === i ? "#e8f5ef" : "#fff",
                  transition: "border-color 0.3s, background 0.3s",
                }}
              >
                {/* bg glow on active */}
                <motion.div
                  animate={{ scale: activeValue === i ? 2 : 1, opacity: activeValue === i ? 0.12 : 0 }}
                  transition={{ duration: 0.4, type: "tween" }}
                  style={{
                    position: "absolute", top: -40, right: -40,
                    width: 140, height: 140, borderRadius: "50%",
                    background: "#004835", pointerEvents: "none",
                  }}
                />

                <motion.div
                  animate={{ scale: activeValue === i ? 1.15 : 1, rotate: activeValue === i ? 8 : 0 }}
                  transition={{ duration: 0.3, type: "tween" }}
                  className="text-5xl mb-6"
                  style={{ display: "inline-block" }}
                >
                  {item.icon}
                </motion.div>

                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>

                <p className="text-gray-600 leading-7">{item.description}</p>

                <AnimatePresence>
                  {activeValue === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      style={{ overflow: "hidden", fontSize: 12, color: "#004835", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
                    >
                      Tap again to close
                    </motion.p>
                  )}
                </AnimatePresence>

                {activeValue !== i && (
                  <p style={{ fontSize: 12, color: "#aaa", marginTop: 16, letterSpacing: "0.04em" }}>
                    Tap to explore →
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}