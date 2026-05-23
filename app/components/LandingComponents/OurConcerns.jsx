"use client";

import { useState, useEffect, useRef } from "react";

const concerns = [
  {
    id: 1,
    name: "Unified Holdings Limited",
    image:
      "https://bondsinternationalltd.com/uploads/concern/iM4a7EVCiy3jK6vn.webp",
    tag: "Holdings",
  },
  {
    id: 2,
    name: "Sky Logistics (BD) Ltd.",
    image:
      "https://bondsinternationalltd.com/uploads/concern/lyO3yg8tzGw1MwsX.webp",
    tag: "Logistics",
  },
  {
    id: 3,
    name: "M. S. Line",
    image:
      "https://bondsinternationalltd.com/uploads/concern/GMHmO58IO2P0xU2e.webp",
    tag: "Shipping",
  },
  {
    id: 4,
    name: "United Global Forwarding (BD) Ltd.",
    image:
      "https://bondsinternationalltd.com/uploads/concern/lyO3yg8tzGw1MwsX.webp",
    tag: "Forwarding",
  },
  {
    id: 5,
    name: "Freightage Global Ltd",
    image:
      "https://bondsinternationalltd.com/uploads/concern/xV978D3gbRcxpxte.webp",
    tag: "Freight",
  },
  {
    id: 6,
    name: "Falcon Shipping & Logistics Ltd.",
    image:
      "https://bondsinternationalltd.com/uploads/concern/PhV6Teq8GRc21BWO.webp",
    tag: "Logistics",
  },
];

const AUTO_PLAY_INTERVAL = 4000;

export default function OurConcerns() {
  const [current, setCurrent] = useState(0);

  // Default 1 for SSR hydration safety
  const [cardsPerView, setCardsPerView] = useState(1);

  const timerRef = useRef(null);
  const ref = useRef(null);

  // Responsive cards per view
  useEffect(() => {
    const updateView = () => {
      setCardsPerView(window.innerWidth >= 1024 ? 3 : 1);
    };

    updateView();

    window.addEventListener("resize", updateView);

    return () => window.removeEventListener("resize", updateView);
  }, []);

  const total = concerns.length;
  const maxIndex = Math.max(total - cardsPerView, 0);

  // Auto slider
  useEffect(() => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timerRef.current);
  }, [maxIndex]);

  const restartTimer = () => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_PLAY_INTERVAL);
  };

  const goTo = (index) => {
    setCurrent(Math.max(0, Math.min(index, maxIndex)));
    restartTimer();
  };

  const goPrev = () => {
    goTo(current <= 0 ? maxIndex : current - 1);
  };

  const goNext = () => {
    goTo(current >= maxIndex ? 0 : current + 1);
  };

  const translateX = `${-(current * (100 / cardsPerView))}%`;

  return (
    <section id="ourconcerns" ref={ref} className="py-20 md:py-28" style={{ background: "#fafaf8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className="inline-block h-px w-7"
              style={{ background: "#C49B40" }}
            />
            <span className="text-gray-500 text-sm font-medium tracking-widest uppercase">
              Since 2000
            </span>
            <span
              className="inline-block h-px w-7"
              style={{ background: "#C49B40" }}
            />
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <em
              className="font-light italic"
              style={{ color: "#004835" }}
            >
              Our
            </em>{" "}
            Concerns
          </h2>

          <div
            className="mx-auto mt-4 h-0.5 rounded-full"
            style={{
              width: 80,
              background:
                "linear-gradient(90deg, transparent, #004835, transparent)",
            }}
          />

          <p className="text-gray-400 text-base md:text-lg mt-5">
            We are proud of our service since 2000
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Prev Button */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 hidden lg:flex
                       items-center justify-center w-10 h-10 rounded-full shadow-md bg-white
                       border border-gray-200 hover:border-[#C49B40] transition-colors"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 hidden lg:flex
                       items-center justify-center w-10 h-10 rounded-full shadow-md bg-white
                       border border-gray-200 hover:border-[#C49B40] transition-colors"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(${translateX})`,
              }}
            >
              {concerns.map((concern) => (
                <div
                  key={concern.id}
                  className="flex-shrink-0 rounded-2xl overflow-hidden bg-white shadow-md group"
                  style={{
                    width:
                      cardsPerView === 3
                        ? "calc(33.333% - 1rem)"
                        : "100%",
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={concern.image}
                      alt={concern.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <span
                      className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-widest
                                 px-3 py-1 rounded-full text-white"
                      style={{ background: "rgba(196,155,64,0.9)" }}
                    >
                      {concern.tag}
                    </span>
                  </div>

                  {/* Name */}
                  <div
                    className="px-5 py-4 border-t-2"
                    style={{ borderColor: "#f4f0e8" }}
                  >
                    <h3
                      className="font-semibold text-gray-800 text-base leading-snug
                                 group-hover:text-[#C49B40] transition-colors duration-300"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {concern.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Buttons */}
        <div className="flex justify-center gap-4 mt-6 lg:hidden">
          <button
            onClick={goPrev}
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white border border-gray-200"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white border border-gray-200"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="#C49B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 10,
                height: 10,
                background: i === current ? "#C49B40" : "#d1cbbf",
                opacity: i === current ? 1 : 0.6,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}