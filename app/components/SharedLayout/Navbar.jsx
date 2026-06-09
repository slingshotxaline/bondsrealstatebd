"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import { useAuthModal } from "@/app/context/AuthModalContext";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  User
} from "lucide-react";

const propertySolutions = [
  { label: "Property Buy/Sell", href: "property-buy-sell", icon: "🏠" },
  { label: "Property Management", href: "#services", icon: "🔑" },
  { label: "Property Development", href: "#development", icon: "🏗️" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAdmin, loading } = useAuth();
  const { setShowModal, setModalType } = useAuthModal();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openLogin = () => {
    setModalType("login");
    setShowModal(true);
  };
  const openRegister = () => {
    setModalType("register");
    setShowModal(true);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  // ── Shared nav link class ────────────────────────────────────────────────
  const navLink =
    "text-[13.5px] text-gray-600 hover:text-[#004835] transition-colors duration-200 font-semibold whitespace-nowrap";

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
            <div className="relative w-[180px] h-[80px]">
              <Image
                src="/assets/logo/logo7.png"
                alt="Bonds RSB Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-7">
            <Link href="/" className={navLink}>
              Home
            </Link>
            <Link href="/about" className={navLink}>
              About Us
            </Link>
            <Link href="/management-team" className={navLink}>
              Management Team
            </Link>
            <Link href="/about" className={navLink}>
              Mission & Vision
            </Link>
            <Link href="/projects" className={navLink}>
              Projects
            </Link>

            {/* Property Solutions Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                onMouseEnter={() => setDropdownOpen(true)}
                className={`flex items-center gap-1.5 ${navLink}`}
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
                            className="w-3 h-3 ml-auto text-gray-300 group-hover:text-[#004835] group-hover:translate-x-0.5 transition-all"
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

            <Link href="/concerns" className={navLink}>
              Our Concerns
            </Link>
          </div>

          {/* Right side: CTA + Auth + Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 bg-[#004835] hover:bg-[#7a5235] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#004835]/20"
            >
              Contact Us
            </Link>

            {/* ── Auth area ──────────────────────────────────────────────── */}
            {!loading && (
              <>
                {user ? (
                  // ── Logged in: avatar dropdown ──────────────────────────
                  <div ref={userMenuRef} className="relative hidden xl:block">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-[#004835]/40 transition-all bg-white"
                    >
                      {/* Avatar circle */}
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/60 flex items-center justify-center text-white font-bold text-xs">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 max-w-[80px] truncate">
                        {user.name?.split(" ")[0]}
                      </span>
                      <ChevronDown
                        size={13}
                        className={`text-gray-400 transition-transform duration-200 ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute top-full right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                          <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C]" />

                          {/* User info */}
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {user.email}
                            </p>
                            <span
                              className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full
                              ${
                                isAdmin
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {user.role?.toUpperCase()}
                            </span>
                          </div>

                          <div className="py-2">
                            {/* Dashboard link */}
                            <Link
                              href={isAdmin ? "/admin" : "/dashboard"}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:text-[#004835] hover:bg-[#004835]/5 transition-all font-semibold"
                            >
                              <LayoutDashboard
                                size={14}
                                className="text-[#004835]"
                              />
                              {isAdmin ? "Admin Panel" : "My Dashboard"}
                            </Link>

                            {/* Logout */}
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-all font-semibold"
                            >
                              <LogOut size={14} />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // ── Not logged in: Sign In + Register buttons ───────────
                  <button
                    onClick={openLogin}
                    className="hidden xl:flex items-center gap-2 text-[16px] font-bold text-gray-600 hover:text-[#004835] px-2 py-2 rounded-full transition-all hover:bg-[#004835]/5 border border-gray-200 hover:border-[#004835]/30"
                  >
                    <User className="text-[#004835]"  size={17} />
                    
                  </button>
                )}
              </>
            )}

            {/* Hamburger */}
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

      {/* ── Mobile Menu ─────────────────────────────────────────────────────── */}
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
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/management-team", label: "Management Team" },
                { href: "/about", label: "Mission & Vision" },
                { href: "/projects", label: "Projects" },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 text-[15px]"
                >
                  {label}
                </Link>
              ))}

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
                href="/concerns"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 text-[15px]"
              >
                Our Concerns
              </Link>

              {/* ── Mobile auth section ──────────────────────────────────── */}
              {!loading && (
                <>
                  {user ? (
                    // Logged in mobile
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      {/* User info pill */}
                      <div className="flex items-center gap-3 px-1 py-2 mb-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/60 flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.role?.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={isAdmin ? "/admin" : "/dashboard"}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 py-3 text-gray-700 hover:text-[#004835] font-semibold border-b border-gray-50 text-[15px]"
                      >
                        <LayoutDashboard size={16} className="text-[#004835]" />
                        {isAdmin ? "Admin Panel" : "My Dashboard"}
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 py-3 text-red-500 font-semibold text-[15px]"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    // Not logged in mobile
                    <button
                      onClick={() => {
                        openLogin();
                        setMenuOpen(false);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-3 border-2 border-[#004835] text-[#004835] font-semibold text-[14px] rounded-full hover:bg-[#004835]/5 transition-colors"
                    >
                      <LogIn size={16} />
                      Sign In
                    </button>
                  )}
                </>
              )}

              <Link
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex justify-center bg-[#C89A6C] text-white text-[14px] font-semibold px-5 py-3 rounded-full hover:bg-[#b8895d] transition-colors"
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
