"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const advantages = [
    "Premium Residential Developments",
    "Sustainable Urban Planning",
    "Contemporary Architectural Design",
    "Trusted Development Expertise",
  ];

  return (
    <section id="about" ref={ref} className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative grid grid-cols-2 gap-3 h-[520px]"
          >
            {/* Small top left */}
            <motion.div
              custom={0}
              variants={fadeUp}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                 src="/assets/About/about2.jpg"
                alt="Modern interior kitchen"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Tall right spanning 2 rows */}
            <motion.div
              custom={0.1}
              variants={fadeUp}
              className="row-span-2 rounded-2xl overflow-hidden"
            >
              <img
               src="/assets/About/about1.jpg"
                alt="Modern house exterior"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Small bottom left */}
            <motion.div
              custom={0.2}
              variants={fadeUp}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                alt="House keys blueprint"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex items-center gap-3 mb-4"
            >
              {/* <span className="w-7 h-[1.5px] bg-[#004835]" /> */}
              {/* <span className="text-gray-500 text-sm font-medium tracking-wider uppercase">
                About Us
              </span> */}
            </motion.div>

            <motion.h2
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
               
              <em className="font-light italic">About</em>  Us
             
            </motion.h2>

            <motion.p
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-gray-500 text-[15px] leading-relaxed mb-8"
            >
              Bonds Real Estate is driven by a commitment to modern urban
              living, combining innovative planning, premium construction
              standards, and sustainable development principles. Every
              development reflects our focus on quality, functionality, and
              enduring value, transforming locations into thriving communities
              and refined living environments.
            </motion.p>

            {/* Advantages box */}
            <motion.div
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="border-l-4 border-[#004835] pl-6 mb-10 bg-stone-50 py-5 pr-6 rounded-r-xl"
            >
              <h4
                className="font-semibold italic text-gray-800 mb-4 text-lg"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Our Business Advantages
              </h4>
              <ul className="space-y-2">
                {advantages.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-gray-600 text-[14.5px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004835] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CTA + Signature */}
            <motion.div
              custom={0.4}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex items-center gap-6 flex-wrap"
            >
              <a
                href="#team"
                className="inline-flex items-center gap-3 bg-stone-100 hover:bg-[#004835] text-gray-800 hover:text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-300 group shadow"
              >
                More About Us
                <span className="w-8 h-8 rounded-full bg-[#004835] group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-white group-hover:text-[#004835]"
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
              {/* <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 80 30"
                  className="w-16 h-8 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M5 25 C15 5, 25 5, 35 15 S55 25, 75 5"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Michael Anderson
                  </p>
                  <p className="text-gray-400 text-xs">Managing Director</p>
                </div>
              </div> */}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
