"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
        <rect x="8" y="20" width="32" height="22" rx="2"/>
        <path d="M4 22L24 6L44 22"/>
        <path d="M18 42V30h12v12"/>
        <circle cx="24" cy="16" r="3"/>
      </svg>
    ),
    title: "Residential Apartments",
    desc: "Modern family residences with spacious layouts, natural ventilation, and refined finishes designed for elevated urban living.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
        <rect x="10" y="16" width="28" height="24" rx="2"/>
        <rect x="14" y="8" width="20" height="12" rx="2"/>
        <rect x="14" y="8" width="8" height="6" rx="1"/>
        <rect x="26" y="8" width="8" height="6" rx="1"/>
        <path d="M10 28h28M18 22v18M30 22v18"/>
      </svg>
    ),
    title: "Mixed-Use Developments",
    desc: "Integrated commercial and residential environments that combine business convenience with private living.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
        <rect x="8" y="10" width="14" height="30" rx="2"/>
        <rect x="26" y="18" width="14" height="22" rx="2"/>
        <path d="M12 18h6M12 24h6M12 30h6M30 26h6M30 32h6"/>
        <path d="M15 40v4M33 40v4"/>
      </svg>
    ),
    title: "Luxury Living Spaces",
    desc: "Premium apartment experiences with contemporary architecture, expansive balconies, and lifestyle-focused planning.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
        <rect x="6" y="28" width="8" height="14" rx="1"/>
        <rect x="18" y="20" width="8" height="22" rx="1"/>
        <rect x="30" y="12" width="8" height="30" rx="1"/>
        <path d="M8 24L20 16L32 8M32 8h-6M32 8v6"/>
      </svg>
    ),
    title: "Real Estate Investment Opportunities",
    desc: "Strategically located developments designed for long-term appreciation and future-ready living.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" ref={ref} className="py-24 bg-[#FAFAF9] relative overflow-hidden">
      {/* Decorative sketch */}
      <div className="absolute -left-8 top-0 bottom-0 w-48 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 200 600" fill="none" stroke="#004835" strokeWidth="0.8" className="w-full h-full">
          <path d="M100 580 L100 20 M80 60 L100 20 L120 60 M60 100 L100 60 L140 100 M40 150 L100 100 L160 150"/>
          <rect x="60" y="200" width="80" height="100" rx="2"/>
          <rect x="70" y="330" width="60" height="80" rx="2"/>
          <path d="M60 200 L100 170 L140 200"/>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-7 h-[1.5px] bg-[#004835]" />
            <span className="text-gray-500 text-sm font-medium tracking-wider uppercase">Services</span>
          </motion.div>
          <motion.h2
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em className="font-light italic">Services for </em> your property milestones
            {/* <br />for your property goals */}
          </motion.h2>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i * 0.1 + 0.2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group flex flex-col items-center text-center p-8 rounded-3xl border border-gray-100 bg-white hover:border-[#004835]/30 hover:shadow-xl hover:shadow-[#004835]/5 transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full border border-gray-200 group-hover:border-[#004835]/40 flex items-center justify-center mb-6 text-gray-700 group-hover:text-[#004835] transition-colors duration-300 bg-gray-50 group-hover:bg-[#004835]/5">
                {s.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-[15.5px] leading-snug">{s.title}</h3>
              <p className="text-gray-500 text-[13.5px] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          custom={0.6}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-100 pt-12"
        >
          {[
            { num: "500+", label: "Properties Sold" },
            { num: "98%", label: "Client Satisfaction" },
            { num: "12+", label: "Years Experience" },
            { num: "200+", label: "Verified Listings" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-bold text-[#004835] mb-1">{stat.num}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}