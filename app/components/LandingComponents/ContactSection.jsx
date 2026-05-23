"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─── variants ───────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.68, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: -24 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ─── floating orb ───────────────────────────────────────────── */
function Orb({ style, dur = 8, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ background: "rgba(0,72,53,0.07)", ...style }}
      animate={{ scale: [1, 1.14, 1], x: [0, 8, 0], y: [0, -8, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── animated input ─────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-semibold uppercase tracking-widest text-gray-400"
        style={{ fontFamily: "sans-serif" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all duration-300";

/* ─── info row ───────────────────────────────────────────────── */
function InfoRow({ icon, label, lines, delay, inView }) {
  return (
    <motion.div
      custom={delay}
      variants={fadeRight}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex items-start gap-3"
    >
      <motion.div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
        whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.25)" }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      <div>
        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5"
           style={{ fontFamily: "sans-serif" }}>
          {label}
        </p>
        {lines.map((l, i) => (
          <p key={i} className="text-white text-sm leading-snug" style={{ fontFamily: "sans-serif" }}>
            {l}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── main ───────────────────────────────────────────────────── */
export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" ref={ref} className="relative bg-white overflow-hidden">

      {/* ── Layout ── */}
      <div className="grid lg:grid-cols-2 min-h-[680px]">

        {/* ══ LEFT — image / info panel ══ */}
        <div className="relative overflow-hidden min-h-[480px] lg:min-h-0">
          {/* BG image */}
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
            alt="Office building"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Continuous parallax-like zoom */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0"
               style={{ background: "linear-gradient(160deg, rgba(0,30,20,0.55) 0%, rgba(0,20,14,0.82) 100%)" }} />

          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.05) 50%, transparent 62%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Rotating ring decoration */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 220, height: 220,
              bottom: "8%", right: "-60px",
              border: "1px dashed rgba(255,255,255,0.12)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 130, height: 130,
              bottom: "12%", right: "-20px",
              border: "1px dashed rgba(255,255,255,0.07)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />

          {/* Content */}
          <div className="relative z-10 p-10 lg:p-14 flex flex-col h-full justify-between">

            {/* Header */}
            <div>
              <motion.div
                custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                className="flex items-center gap-3 mb-5"
              >
                <motion.span
                  className="inline-block h-px bg-white/70"
                  style={{ width: 28 }}
                  animate={{ width: [20, 36, 20] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-white/70 text-sm font-medium tracking-wider uppercase"
                      style={{ fontFamily: "sans-serif" }}>
                  Contact
                </span>
              </motion.div>

              <motion.h2
                custom={0.1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                className="text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                <em className="font-light italic">Start Your</em>
                <br />
                <span className="font-bold">Property Journey</span>
              </motion.h2>

              {/* Animated underline */}
              <motion.div
                className="h-[2px] rounded-full mb-8"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.5), transparent)" }}
                initial={{ width: 0 }}
                animate={inView ? { width: 120 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>

            {/* Map card */}
            <motion.div
              custom={0.25} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="rounded-2xl overflow-hidden mb-8"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <div className="h-40 relative overflow-hidden">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38356.25!2d-6.27!3d53.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDIwJzI0LjAiTiA2wrAxNicxMi4wIlc!5e0!3m2!1sen!2s!4v1"
                  className="w-full h-full"
                  style={{ border: 0, filter: "grayscale(0.2)" }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-4 grid grid-cols-2 gap-4" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div>
                  <p className="italic font-semibold text-gray-700 text-sm mb-1.5"
                     style={{ fontFamily: "'Georgia', serif" }}>Location:</p>
                  <div className="flex items-start gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#004835]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    </svg>
                    <span>House# 5 (2nd Floor), Road# 7, Block# F, <br />Banani, Dhaka-1213.</span>
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-4">
                  <p className="italic font-semibold text-gray-700 text-sm mb-1.5"
                     style={{ fontFamily: "'Georgia', serif" }}>Email:</p>
                  <div className="flex items-start gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#004835]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 7 10-7" />
                    </svg>
                    <span> info@bondsinternationalltd.com<br /> +88 02 55041896, 02 226603195</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info rows */}
            {/* <div className="flex flex-col gap-4">
              <InfoRow
                icon={
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                }
                label="Address"
                lines={["Holland Park Holland, London 7QU"]}
                delay={0.3}
                inView={inView}
              />
              <InfoRow
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
                  </svg>
                }
                label="Email"
                lines={["example@gmail.com", "info8797@gmail.com"]}
                delay={0.38}
                inView={inView}
              />
            </div> */}
          </div>
        </div>

        {/* ══ RIGHT — form panel ══ */}
        <div className="relative flex items-center overflow-hidden" style={{ background: "#FAFAF9" }}>

          {/* Background orbs */}
          <Orb style={{ width: 280, height: 280, top: -60, right: -60 }} dur={10} />
          <Orb style={{ width: 160, height: 160, bottom: 40, left: -40 }} dur={13} delay={2} />

          {/* Rotating ring */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 180, height: 180,
              top: "4%", right: "4%",
              border: "1px dashed rgba(0,72,53,0.1)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          />

          {/* Decorative sketch */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-56 pointer-events-none select-none"
            style={{ opacity: 0.04 }}
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 300 600" fill="none" stroke="#004835" strokeWidth="0.5" className="w-full h-full">
              <rect x="20" y="20" width="260" height="400" rx="2" />
              <rect x="40" y="40" width="80" height="120" rx="2" />
              <rect x="140" y="40" width="80" height="120" rx="2" />
              <path d="M40 200 L280 200 M40 250 L280 250" />
            </svg>
          </motion.div>

          {/* Form content */}
          <div className="relative z-10 w-full max-w-xl mx-auto px-8 lg:px-14 py-14">

            <motion.div
              custom={0.1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-5 h-px bg-[#004835]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#004835]"
                      style={{ fontFamily: "sans-serif" }}>
                  Get in Touch
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "'Georgia', serif" }}>
                Send Us a <em className="font-light italic">Message</em>
              </h3>
              {/* Animated underline */}
              <motion.div
                className="mt-3 h-[2px] rounded-full"
                style={{ background: "linear-gradient(90deg, #004835, rgba(0,72,53,0.15))" }}
                initial={{ width: 0 }}
                animate={inView ? { width: 80 } : {}}
                transition={{ delay: 0.45, duration: 0.7 }}
              />
            </motion.div>

            <motion.form
              custom={0.2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Your Name">
                  <input
                    type="text" name="name" placeholder="Your Name *"
                    value={form.name} onChange={handleChange}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    required className={inputCls}
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email" name="email" placeholder="Email Address *"
                    value={form.email} onChange={handleChange}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    required className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone Number">
                  <input
                    type="tel" name="phone" placeholder="Phone *"
                    value={form.phone} onChange={handleChange}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Select Service">
                  <div className="relative">
                    <select
                      name="service" value={form.service} onChange={handleChange}
                      onFocus={() => setFocused("service")} onBlur={() => setFocused(null)}
                      className={inputCls + " appearance-none pr-9"}
                      style={{ color: form.service ? "#1f2937" : "#9ca3af" }}
                    >
                      <option value="">Subject (Optional)</option>
                      <option value="buy">Property Buying</option>
                      <option value="sell">Property Selling</option>
                      <option value="rent">Rental & Leasing</option>
                      <option value="invest">Investment Consulting</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </Field>
              </div>

              <Field label="Message">
                <textarea
                  name="message" placeholder="Type Your Message"
                  rows={5} value={form.message} onChange={handleChange}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                  className={inputCls + " resize-none"}
                />
              </Field>

              {/* Focus indicator bar */}
              <motion.div
                className="h-[2px] rounded-full"
                style={{ background: "linear-gradient(90deg, #004835, rgba(0,72,53,0.2))" }}
                animate={{ width: focused ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

              {/* Submit */}
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3 px-6 py-3.5 rounded-full"
                    style={{ background: "rgba(0,72,53,0.1)", border: "1px solid rgba(0,72,53,0.2)" }}
                  >
                    <motion.span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#004835" }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.span>
                    <span className="text-[#004835] text-sm font-semibold" style={{ fontFamily: "sans-serif" }}>
                      Message Sent!
                    </span>
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    type="submit"
                    className="inline-flex items-center gap-3 text-[14px] font-semibold px-6 py-3.5 rounded-full"
                    style={{ background: "#f3f2ee", color: "#111", fontFamily: "sans-serif" }}
                    whileHover={{ backgroundColor: "#004835", color: "#fff" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Send Message
                    <motion.span
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#004835" }}
                      whileHover={{ backgroundColor: "#fff" }}
                      transition={{ duration: 0.25 }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </motion.span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}