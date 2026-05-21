"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen pt-[72px] overflow-hidden">
      {/* ── Full-width Hero Image ── */}
      <div className="absolute inset-0">
        <Image
          src="/assets/Hero/herobanner.jpeg"
          alt="Hero building"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-20 container mx-auto pr-5 sm:pr-8 lg:pr-12 flex flex-col justify-center min-h-screen pb-28 sm:pb-24">
        {/* Blurred glass panel behind text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="
            relative
            backdrop-blur-md bg-white/10
            px-8 py-10 sm:px-10 sm:py-12
            max-w-xl
            before:absolute before:inset-0
            before:rounded-none before:content-['']
          "
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
              Building Tomorrow’s Legacy 
            </span>
            <span
              className="block text-4xl sm:text-5xl lg:text-6xl font-bold"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom-right overlapping panels ── */}
      {/*
        Layout (desktop):   [ stat card | image panel ]
        Layout (mobile):    stacked vertically, full width
        Both panels sit over the hero via absolute positioning on md+,
        and flow naturally below on small screens.
      */}

      {/* Wrapper — absolute on md+, static block on mobile */}
      <div
        className="
          relative z-30
          md:absolute md:bottom-0 md:right-0
          flex flex-col sm:flex-row
          w-full md:w-auto
        "
      >
        {/* ── Stat Card ── */}
        {/* <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="
            bg-white/95 backdrop-blur-sm
            p-6 sm:p-8
            flex flex-col justify-center
            w-full sm:w-56 md:w-64
            min-h-[160px] sm:min-h-[200px] md:min-h-[220px]
          "
        >
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
            Client Satisfaction
          </p>
          <p
            className="text-6xl font-bold text-gray-900 mb-4 leading-none"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            98<span className="text-3xl">%</span>
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Premium residential and commercial properties tailored to your
            lifestyle and investment goals.
          </p>
        </motion.div> */}

        {/* ── Image Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="
            relative overflow-hidden
            w-full sm:w-56 md:w-72 lg:w-80
            h-48 sm:h-auto sm:min-h-[200px] md:min-h-[220px]
          "
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80"
            alt="Luxury interior"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 224px, 320px"
          />
          {/* subtle tint */}
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
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
  );
}