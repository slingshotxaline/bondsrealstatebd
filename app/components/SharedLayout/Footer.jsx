"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Property Buy & Sell", href: "/property-buy-sell" },
  { label: "Property Management", href: "#services" },
  { label: "Property Development", href: "#development" },
  { label: "About Us", href: "/about" },
  { label: "Management Team", href: "/management-team" },
  { label: "Our Concerns", href: "/concerns" },
];

/* ─── animated background ────────────────────────────────────── */
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ── Left diagonal lines — staggered slide in + drift ── */}
      <div className="absolute top-0 left-0 w-48 lg:w-64 h-full opacity-[0.06]">
        <svg viewBox="0 0 200 600" fill="none" className="w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.line
              key={i}
              x1={-50 + i * 15}
              y1="0"
              x2={-50 + i * 15 + 200}
              y2="600"
              stroke="white"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
            />
          ))}
        </svg>
      </div>

      {/* ── Right concentric circles — continuous pulse ── */}
      <div className="absolute top-0 right-0 w-48 lg:w-72 h-full opacity-[0.06]">
        <svg viewBox="0 0 200 400" fill="none" className="w-full h-full">
          {[150, 120, 90, 60].map((r, i) => (
            <motion.circle
              key={r}
              cx="200"
              cy="200"
              r={r}
              stroke="white"
              strokeWidth="0.5"
              fill="none"
              animate={{ r: [r, r + 8, r], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      {/* ── Centre-top rotating compass/grid ── */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 opacity-[0.04]">
        <motion.svg
          viewBox="0 0 200 200"
          fill="none"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {/* Cross hairs */}
          <line
            x1="100"
            y1="0"
            x2="100"
            y2="200"
            stroke="white"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="100"
            x2="200"
            y2="100"
            stroke="white"
            strokeWidth="0.5"
          />
          {/* Diagonal */}
          <line
            x1="0"
            y1="0"
            x2="200"
            y2="200"
            stroke="white"
            strokeWidth="0.4"
          />
          <line
            x1="200"
            y1="0"
            x2="0"
            y2="200"
            stroke="white"
            strokeWidth="0.4"
          />
          {/* Rings */}
          <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="20" stroke="white" strokeWidth="0.5" />
        </motion.svg>
      </div>

      {/* ── Bottom-left floating grid ── */}
      <motion.div
        className="absolute bottom-8 left-6 w-36 h-36 opacity-[0.04]"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={v}
                y1="0"
                x2={v}
                y2="100"
                stroke="white"
                strokeWidth="0.4"
              />
              <line
                x1="0"
                y1={v}
                x2="100"
                y2={v}
                stroke="white"
                strokeWidth="0.4"
              />
            </g>
          ))}
          <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* ── Top-right floating dot field ── */}
      <motion.div
        className="absolute top-8 right-20 w-28 h-28 opacity-[0.07]"
        animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <motion.circle
                key={`${row}-${col}`}
                cx={10 + col * 20}
                cy={10 + row * 20}
                r="1.5"
                fill="white"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2.5,
                  delay: (row + col) * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))
          )}
        </svg>
      </motion.div>

      {/* ── Floating architectural sketch — centre-left ── */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-8 w-32 h-48 opacity-[0.04]"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 100 160"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          className="w-full h-full"
        >
          <rect x="10" y="50" width="80" height="100" rx="1" />
          <path d="M10 50 L50 10 L90 50" />
          <rect x="25" y="80" width="20" height="25" rx="1" />
          <rect x="55" y="80" width="20" height="25" rx="1" />
          <rect x="35" y="115" width="30" height="35" rx="1" />
          <line x1="10" y1="80" x2="90" y2="80" />
        </svg>
      </motion.div>

      {/* ── Centre-right orbit lines — continuous rotate ── */}
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 opacity-[0.05]"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <ellipse
            cx="60"
            cy="60"
            rx="55"
            ry="20"
            stroke="white"
            strokeWidth="0.5"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="55"
            ry="20"
            stroke="white"
            strokeWidth="0.5"
            transform="rotate(60 60 60)"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="55"
            ry="20"
            stroke="white"
            strokeWidth="0.5"
            transform="rotate(120 60 60)"
          />
          <circle cx="60" cy="60" r="5" stroke="white" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* ── Wandering particles ── */}
      {[
        { x: "15%", delay: 0, dur: 6 },
        { x: "40%", delay: 1.5, dur: 8 },
        { x: "65%", delay: 0.8, dur: 7 },
        { x: "85%", delay: 2.2, dur: 9 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ left: p.x, bottom: "10%" }}
          animate={{ y: [0, -80, 0], opacity: [0, 0.5, 0] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Subtle horizontal scan line ── */}
      <motion.div
        className="absolute left-0 right-0 h-px opacity-5"
        style={{
          background:
            "linear-gradient(90deg, transparent, white 40%, white 60%, transparent)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─── social icons ───────────────────────────────────────────── */
const socialPaths = {
  twitter:
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
};

/* ─── main ───────────────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#141414] text-white relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* ── Quick Links ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h4
              className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-6"
              style={{ fontFamily: "sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 text-[15px] transition-colors duration-200"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    <motion.span className="inline-block w-0 h-px bg-[#004835] group-hover:w-4 transition-all duration-300" />
                    <span className="group-hover:text-[#004835] transition-colors duration-200">
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ── Newsletter ── */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Animated envelope icon */}
            <motion.div
              className="w-12 h-12 mx-auto mb-5 rounded-xl flex items-center justify-center"
              style={{
                border: "1px solid rgba(0, 72, 53, 1)",
                background: "rgba(200,154,108,0.08)",
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.svg
                className="w-5 h-5 text-[#004835]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </motion.svg>
            </motion.div>

            <p
              className="text-gray-300 text-[15px] leading-relaxed mb-6"
              style={{ fontFamily: "sans-serif" }}
            >
              <em
                className="text-white font-semibold"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Subscribe
              </em>{" "}
              to receive high-potential investment properties, market analysis,
              and expert recommendations.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="relative flex items-center gap-0 pb-3"
            >
              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700" />
              <motion.div
                className="absolute bottom-0 left-0 h-px bg-[#004835]"
                animate={{ width: email ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 focus:outline-none"
                style={{ fontFamily: "sans-serif" }}
              />
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.span
                    key="ok"
                    className="text-[#004835] text-sm font-medium ml-3 flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ fontFamily: "sans-serif" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Done!
                  </motion.span>
                ) : (
                  <motion.button
                    key="sub"
                    type="submit"
                    className="flex items-center gap-2 text-[#004835] hover:text-white text-sm font-medium transition-colors ml-3"
                    style={{ fontFamily: "sans-serif" }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Subscribe
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 2, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                      />
                    </motion.svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* ── Contact ── */}
          <motion.div
            className="text-right"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h4
              className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-6"
              style={{ fontFamily: "sans-serif" }}
            >
              Contact Us
            </h4>
            <div
              className="space-y-2 text-gray-300 text-[14px]"
              style={{ fontFamily: "sans-serif" }}
            >
              {[
                "+88 02 55041896,",
                " 02 226603195",
                "+8801700764494",
                "info@bondsrealestatebd.com",
                "House# 5 (2nd Floor), Road# 7, Block# F,",
                "Banani, Dhaka-1213.",
              ].map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                  className="hover:text-[#004835] transition-colors duration-200 cursor-default"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              {["twitter", "linkedin", "instagram", "facebook"].map(
                (social, i) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 transition-colors duration-200"
                    whileHover={{
                      scale: 1.15,
                      borderColor: "#004835",
                      color: "#004835",
                    }}
                    whileTap={{ scale: 0.92 }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={socialPaths[social]} />
                    </svg>
                  </motion.a>
                )
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <motion.div
          className="mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p
            className="text-gray-500 text-sm"
            style={{ fontFamily: "sans-serif" }}
          >
            {/* © Copyright {new Date().getFullYear()}. */}
            <Link
              href="https://www.a-linebrands.com/"
              target="_blank"
              className="text-gray-500  transition-colors duration-300 hover:underline"
            >
              Developed by A-Line Limited
            </Link>
          </p>
          <div
            className="flex items-center gap-6 text-gray-500 text-sm"
            style={{ fontFamily: "sans-serif" }}
          >
            <Link href="#" className="hover:text-[#004835] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="#" className="hover:text-[#004835] transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Watermark ── */}
      <div className="relative h-12 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.04] select-none pointer-events-none"
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="text-[28px] md:text-[48px] font-bold italic text-white leading-none whitespace-nowrap"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Bonds Real Estate Ltd.
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
