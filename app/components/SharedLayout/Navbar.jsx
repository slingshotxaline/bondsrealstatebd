"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const propertySolutions = [
  { label: "Property Buy/Sell", href: "property-buy-sell", icon: "🏠" },
  { label: "Property Management", href: "#services", icon: "🔑" },
  { label: "Property Development", href: "#development", icon: "🏗️" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-[140px] h-[50px]">
              <Image
                src="/assets/logo/logo6.png"
                alt="Bonds RSB Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-7">
            <Link
              href="/"
              className="text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap"
            >
              About Us
            </Link>

            <Link
              href="/management-team"
              className="text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap"
            >
              Management Team
            </Link>
            <Link
              href="/management-team"
              className="text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap"
            >
              Mission & Vision
            </Link>
            <Link
              href="#projects"
              className="text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap"
            >
              Projects
            </Link>

            {/* ── Property Solutions Dropdown ── */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                onMouseEnter={() => setDropdownOpen(true)}
                className="flex items-center gap-1.5 text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap"
              >
                Property Solutions
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C]" />

                    <div className="py-2">
                      {propertySolutions.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-[13.5px] text-gray-700 hover:text-[#004835] hover:bg-[#004835]/5 transition-all duration-150 group"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="font-semibold">{item.label}</span>
                          <svg
                            className="w-3 h-3 ml-auto text-gray-300 group-hover:text-[#004835] group-hover:translate-x-0.5 transition-all duration-150"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="#ourconcerns"
              className="text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap"
            >
              Our Concerns
            </Link>
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 bg-[#004835] hover:bg-[#7a5235] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#004835]/20"
            >
              Contact Us
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden flex flex-col gap-1.5 p-2 group"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-[1.5px] bg-gray-700 transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-gray-700 transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-gray-700 transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-xl xl:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 text-[15px]"
              >
                Home
              </Link>

              <Link
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 text-[15px]"
              >
                About Us
              </Link>
              <Link
                href="/management-team"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 last:border-0 text-[15px]"
              >
                Management Team
              </Link>
              <Link
                href="#team"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 last:border-0 text-[15px]"
              >
                Mission & Vision
              </Link>

              <Link
                href="#projects"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 text-[15px]"
              >
                Projects
              </Link>

              {/* Property Solutions accordion */}
              <div className="border-b border-gray-50">
                <button
                  onClick={() => setMobileDropdownOpen((v) => !v)}
                  className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-[#004835] font-semibold text-[15px]"
                >
                  Property Solutions
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {mobileDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {propertySolutions.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileDropdownOpen(false);
                          }}
                          className="flex items-center gap-3 pl-4 pr-2 py-2.5 text-[14px] text-gray-600 hover:text-[#004835]"
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="#team"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 last:border-0 text-[15px]"
              >
                Our Concerns
              </Link>

              <Link
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-3 inline-flex justify-center bg-[#004835] text-white text-[14px] font-semibold px-5 py-3 rounded-full"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
