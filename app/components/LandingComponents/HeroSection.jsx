"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <>
      {/* ═══════════════════════════════════════
          MOBILE LAYOUT  (hidden on sm+)
      ════════════════════════════════════════ */}
      <section className="block sm:hidden w-full pt-[72px]">
        {/* Mobile Image — natural height with text overlay */}
        <div className="relative w-full">
          <Image
            src="/assets/Hero/mobileBanner.jpeg"
            alt="Hero building"
            width={0}
            height={0}
            sizes="100vw"
            priority
            className="w-full h-auto"
          />

          {/* Gradient overlay — stronger at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

          {/* Text overlay — pinned to bottom of image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute bottom-[12%] left-0 right-0 px-6 pb-8 pt-16"
          >
            {/* <p className="text-[#C89A6C] text-xs tracking-[0.2em] uppercase mb-3 font-medium">
              Real Estate & Development
            </p> */}

            <h1
              className="text-white leading-[1.08] mb-5"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <span className="block text-[1.75rem] font-light italic">
                Building Tomorrow's Legacy
              </span>
              <span className="block text-[1.75rem] font-bold italic mt-0.5">
                with Vision & Integrity
              </span>
            </h1>

            <a
              href="#projects"
              className="inline-flex items-center gap-3 bg-white text-gray-900 text-[13px] font-semibold px-5 py-3 rounded-full hover:bg-[#C89A6C] hover:text-white transition-all duration-300 group shadow-lg"
            >
              Explore Projects
              <span className="w-7 h-7 rounded-full bg-[#C89A6C] group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                <svg
                  className="w-3.5 h-3.5 text-white group-hover:text-[#C89A6C] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7v10"
                  />
                </svg>
              </span>
            </a>
          </motion.div>
        </div>

        {/* Stats row — below image */}
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#1a1a1a] px-6 py-6 grid grid-cols-3 gap-4 border-t border-white/10"
        >
          {[
            { value: "98%", label: "Satisfaction" },
            { value: "12+", label: "Years" },
            { value: "500+", label: "Projects" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {stat.value}
              </span>
              <span className="text-white/40 text-[11px] tracking-wide uppercase mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div> */}
      </section>

      {/* ═══════════════════════════════════════
          DESKTOP LAYOUT  (hidden below sm)
      ════════════════════════════════════════ */}
      <section className="hidden sm:block relative w-full min-h-screen pt-[72px] overflow-hidden">
        {/* Desktop Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/Hero/herobanner.jpeg"
            alt="Hero building"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto pr-5 sm:pr-8 lg:pr-12 flex flex-col justify-center min-h-screen pb-28 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative backdrop-blur-md bg-white/10 px-8 py-10 sm:px-10 sm:py-12 max-w-xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-white leading-[1.05] mb-8"
            >
              <span
                className="block text-4xl sm:text-5xl lg:text-6xl font-light italic"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Building Tomorrow's Legacy
              </span>
              <span
                className="block text-4xl sm:text-5xl lg:text-6xl font-bold italic"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                with Vision & Integrity
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-3 bg-white text-gray-900 text-[14px] font-semibold px-6 py-3.5 rounded-full hover:bg-[#C89A6C] hover:text-white transition-all duration-300 group shadow-xl"
              >
                Explore Projects
                <span className="w-8 h-8 rounded-full bg-[#C89A6C] group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-white group-hover:text-[#C89A6C] transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom-right Image Panel */}
        {/* <div className="relative z-30 md:absolute md:bottom-0 md:right-0 flex flex-col sm:flex-row w-full md:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="relative overflow-hidden w-full sm:w-56 md:w-72 lg:w-80 h-48 sm:h-auto sm:min-h-[200px] md:min-h-[220px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80"
              alt="Luxury interior"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 224px, 320px"
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </div> */}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-[1px] h-8 bg-white/40"
          />
        </motion.div>
      </section>
    </>
  );
}