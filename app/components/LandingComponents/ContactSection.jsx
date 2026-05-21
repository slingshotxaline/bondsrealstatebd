"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" ref={ref} className="py-0 bg-white">
      <div className="grid lg:grid-cols-2 min-h-[640px]">
        {/* Left - Image + Map + Info */}
        <div className="relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
            alt="Office building"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

          <div className="relative z-10 p-10 lg:p-16 flex flex-col h-full">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-[1.5px] bg-white" />
                <span className="text-white text-sm font-medium tracking-wider uppercase">Contact</span>
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                <em className="font-light italic">Start Your </em>
                <br />
                <span className="font-bold">Property
                Journey</span>
              </h2>
            </motion.div>

            {/* Map embed placeholder */}
            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-8 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <div className="h-44 bg-gray-200 relative overflow-hidden rounded-t-2xl">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38356.25!2d-6.27!3d53.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDIwJzI0LjAiTiA2wrAxNicxMi4wIlc!5e0!3m2!1sen!2s!4v1"
                  className="w-full h-full"
                  style={{ border: 0, filter: "grayscale(0.3)" }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-4 grid grid-cols-2 gap-4 bg-white/95">
                <div>
                  <p className="italic font-semibold text-gray-700 text-sm mb-2" style={{ fontFamily: "'Georgia', serif" }}>Location:</p>
                  <div className="flex items-start gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#004835]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                    <span>Holland Park Holland,<br />London 7QU</span>
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-4">
                  <p className="italic font-semibold text-gray-700 text-sm mb-2" style={{ fontFamily: "'Georgia', serif" }}>Email:</p>
                  <div className="flex items-start gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#004835]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M2 7l10 7 10-7"/>
                    </svg>
                    <span>example@gmail.com<br />info8797@gmail.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-[#FAFAF9] flex items-center">
          <div className="w-full max-w-xl mx-auto px-8 lg:px-16 py-16">
            {/* Decorative */}
            <div className="absolute right-0 top-0 bottom-0 w-64 opacity-5 pointer-events-none">
              <svg viewBox="0 0 300 600" fill="none" stroke="#004835" strokeWidth="0.5" className="w-full h-full">
                <rect x="20" y="20" width="260" height="400" rx="2"/>
                <rect x="40" y="40" width="80" height="120" rx="2"/>
                <rect x="140" y="40" width="80" height="120" rx="2"/>
                <path d="M40 200 L280 200 M40 250 L280 250"/>
              </svg>
            </div>

            <motion.div
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Georgia', serif" }}>
                Send Us a Message
              </h3>
            </motion.div>

            <motion.form
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#004835] focus:ring-1 focus:ring-[#004835]/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#004835] focus:ring-1 focus:ring-[#004835]/20 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone *"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#004835] focus:ring-1 focus:ring-[#004835]/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Select Service</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#004835] transition-colors appearance-none"
                  >
                    <option value="">Subject (Optional)</option>
                    <option value="buy">Property Buying</option>
                    <option value="sell">Property Selling</option>
                    <option value="rent">Rental & Leasing</option>
                    <option value="invest">Investment Consulting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Message</label>
                <textarea
                  name="message"
                  placeholder="Type Your Message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#004835] focus:ring-1 focus:ring-[#004835]/20 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-stone-100 hover:bg-[#004835] text-gray-800 hover:text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-300 group shadow"
              >
                {sent ? "Message Sent!" : "Send"}
                <span className="w-8 h-8 rounded-full bg-[#004835] group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                  <svg className="w-4 h-4 text-white group-hover:text-[#004835]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </span>
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}