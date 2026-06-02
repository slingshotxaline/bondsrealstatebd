"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const highlights = [
  "Premium Residential Developments",
  "Sustainable Urban Planning",
  "Contemporary Architectural Design",
  "Trusted Development Expertise",
];

const values = [
  {
    title: "Customer-Centricity",
    description:
      "Placing the needs and aspirations of our clients at the forefront, ensuring seamless experiences from booking to handover.",
    icon: "🤝",
  },
  {
    title: "Sustainable Innovation",
    description:
      "Integrating eco-friendly building practices, smart technologies, and forward-thinking designs.",
    icon: "🌱",
  },
  {
    title: "Community Enhancement",
    description:
      "Creating developments that improve infrastructure and quality of life for the surrounding community.",
    icon: "🏙️",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.13,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: -28 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function AboutUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="bg-white overflow-hidden">
      {/* HERO */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* IMAGE SECTION */}
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  grid
                  grid-cols-2
                  gap-3
                  h-[380px]
                  sm:h-[500px]
                  lg:h-[620px]
                "
              >
                {/* Image 1 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-[28px] group"
                >
                  <motion.img
                    src="/assets/About/about2.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                  />
                </motion.div>

                {/* Image 2 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-[28px] row-span-2 group"
                >
                  <motion.img
                    src="/assets/About/about1.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                    animate={{ y: [0, 12, 0] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    whileHover={{ scale: 1.06 }}
                  />

                  <div className="absolute bottom-5 left-5 bg-[#004835] text-white px-4 py-2 rounded-full text-xs font-medium">
                    Premium Living
                  </div>
                </motion.div>

                {/* Image 3 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-[28px] group"
                >
                  <motion.img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                  />
                </motion.div>
              </motion.div>

              {/* Decorative Rings */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-[#004835]/20"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />
            </div>

            {/* CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* <span className="text-[#004835] uppercase tracking-[3px] text-sm font-medium">
                About Us
              </span> */}

              <motion.h2
                custom={0.1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="text-[clamp(32px,4vw,48px)] font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                <em className="font-light italic text-[#004835]">About</em> Us
              </motion.h2>

              <motion.p
                custom={0.2}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-6 text-gray-600 leading-8"
              >
                Bonds Real Estate is driven by a commitment to modern urban
                living, combining innovative planning, premium construction
                standards, and sustainable development principles.
              </motion.p>

              <p className="mt-4 text-gray-600 leading-8">
                Every development reflects our focus on quality, functionality,
                and enduring value, transforming locations into thriving
                communities and refined living environments.
              </p>

              <div className="mt-8 border-l-4 border-[#004835] pl-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Our Business Advantages
                </h4>

                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#004835]/10 flex items-center justify-center text-[#004835] text-xs">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm">
              <h3 className="text-3xl font-bold mb-6 text-black">Vision</h3>

              <p className="text-gray-600 leading-8">
                To redefine the landscape of modern living and commerce by
                developing sustainable, innovative, and comfortable real estate
                projects that stand as enduring landmarks of excellence and
                community growth.
              </p>
            </div>

            <div className="bg-[#004835] text-white rounded-[32px] p-8 md:p-12">
              <h3 className="text-3xl font-bold mb-6">Mission</h3>

              <p className="leading-8 text-white/90">
                To deliver superior residential and commercial real estate
                solutions through meticulous planning, uncompromising structural
                quality, and ethical business practices while fostering
                environmentally responsible urban development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-14"> */}

          <motion.h2
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-[clamp(32px,4vw,48px)] font-bold text-gray-900 mb-6 leading-tight text-center"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em className="font-light italic text-[#004835]">Core</em> Values
          </motion.h2>
          {/* </div> */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {values.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="
                  bg-white
                  rounded-[32px]
                  p-8
                  border
                  border-gray-100
                  shadow-[0_15px_40px_rgba(0,0,0,0.05)] text-black
                "
              >
                <div className="text-5xl mb-6">{item.icon}</div>

                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>

                <p className="text-gray-600 leading-7">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
