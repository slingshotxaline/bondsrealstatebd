"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";

const properties = [
  {
    id: 1,
    type: "Premium Apartment",
    title: "Unified Khan Palace",
    desc: "A premium apartment development featuring luxury single-unit residences with spacious interiors, elegant finishes, and thoughtfully planned modern living spaces.",
    area: "2850 sq ft",
    rooms: "4 Beds",
    baths: "4",
    parking: "Yes",
    location: "Sector-13, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/UKhanProject/UKhan1.jpg",
    thumbImg: "/assets/LandingProject/UKhanProject/UKhan2.jpg",
  },
  {
    id: 2,
    type: "Residential Apartment",
    title: "Sahara Unified",
    desc: "A contemporary residential community positioned on a quiet street with abundant natural light, ventilation, and access to green walkways and community amenities.",
    area: "2850 sq ft",
    rooms: "4 Beds",
    baths: "4",
    parking: "Yes",
    location: "Sector-16, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/USaharaProject/SaharaUnified.jpeg",
    thumbImg: "/assets/LandingProject/USaharaProject/Sahara2.jpg",
  },
  {
    id: 3,
    type: "Lifestyle-focused Residences",
    title: "Unified Golf Heights",
    desc: "Lifestyle-focused residences overlooking expansive green zones, a golf arena, and scenic surroundings designed for elevated everyday living.",
    area: "2850 sq ft",
    rooms: "4 Beds",
    baths: "4",
    location: "Sector-17, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/UGolfProject/UGolf1.jpg",
    thumbImg: "/assets/LandingProject/UGolfProject/UGolf2.jpg",
  },
  {
    id: 4,
    type: "Luxury Villa",
    title: "Bonds Khan Tower",
    desc: "An expansive residential development balancing sophisticated architecture with open layouts, daylight optimization, and urban connectivity.",
    area: "6200 sq ft",
    rooms: "Open Plan",
    baths: "6",
    parking: "Yes",
    location: "Sector-9, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/BondsKhanProject/bonds khan press tower 1.jpeg",
    thumbImg: "/assets/LandingProject/BondsKhanProject/bonds2.jpg",
  },
  {
    id: 5,
    type: "Residential Apartment",
    title: "Project Bashundhara",
    desc: "A striking architectural landmark with sweeping balconies, modern aesthetics, and a prestigious residential atmosphere.",
    area: "6200 sq ft",
    rooms: "Open Plan",
    baths: "6",
    parking: "Yes",
    location: "Sector-7, Jolshiri Abashon",
    mainImg: "/assets/LandingProject/BashundharaProject/Bashundhara1.jpg",
    thumbImg: "/assets/LandingProject/BashundharaProject/Bashundhara2.jpg",
  },
];

const specs = [
  { icon: "area", label: "Total Area" },
  { icon: "bed", label: "Rooms" },
  { icon: "bath", label: "Baths" },
  { icon: "car", label: "Parking" },
];

const SpecIcon = ({ type }) => {
  const icons = {
    area: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 3v18"/>
      </svg>
    ),
    bed: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 14h18M7 14V9a1 1 0 011-1h8a1 1 0 011 1v5"/>
      </svg>
    ),
    bath: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4zM4 12V5a2 2 0 014 0v7"/>
        <circle cx="4" cy="5" r="1"/>
      </svg>
    ),
    car: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M7 17v2M17 17v2"/>
        <circle cx="8" cy="14" r="1.5"/>
        <circle cx="16" cy="14" r="1.5"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" } }),
};

export default function ProjectsSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const prop = properties[active];
  const vals = [prop.area, prop.rooms, prop.baths, prop.parking];

  return (
    <section id="projects" ref={ref} className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-7 h-[1.5px] bg-[#004835]" />
            <span className="text-gray-500 text-sm font-medium tracking-wider uppercase">Featured List</span>
          </motion.div>
          <motion.h2
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-4xl lg:text-5xl font-bold text-gray-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em className="font-light italic"></em>Projects
          </motion.h2>
        </div>

        {/* Property Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            {/* Images */}
            <div className="flex gap-3 h-[480px]">
              {/* Thumbnail */}
              <div className="w-1/4 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={prop.thumbImg}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Main */}
              <div className="flex-1 relative rounded-2xl overflow-hidden">
                <img
                  src={prop.mainImg}
                  alt={prop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <div className="flex items-center gap-2 text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <div>
                      <p className="text-white font-medium text-sm">{prop.title}</p>
                      <p className="text-white/80 text-xs">{prop.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="border border-gray-100 rounded-3xl p-8 shadow-sm">
              <p className="text-gray-400 text-sm mb-2">{prop.type}</p>
              <h3
                className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wide leading-tight"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.05em" }}
              >
                {prop.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{prop.desc}</p>

              {/* Specs */}
              <div className="space-y-4 mb-8">
                {specs.map((spec, i) => (
                  <div key={spec.label} className="flex items-center gap-4">
                    <span className="text-gray-500">{<SpecIcon type={spec.icon} />}</span>
                    <span className="text-gray-600 text-[14px] w-28">{spec.label}</span>
                    <span className="text-gray-400">:</span>
                    <span className="font-semibold text-gray-900 text-[14px]">{vals[i]}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-3 bg-stone-100 hover:bg-[#004835] text-gray-800 hover:text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-300 group shadow"
              >
                More About Us
                <span className="w-8 h-8 rounded-full bg-[#004835] group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                  <svg className="w-4 h-4 text-white group-hover:text-[#004835]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots */}
        <motion.div
          custom={0.5}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex justify-center gap-3 mt-10"
        >
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full ${
                i === active ? "w-8 h-3 bg-[#004835]" : "w-3 h-3 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}