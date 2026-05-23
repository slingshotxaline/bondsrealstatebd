"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
  X,
} from "lucide-react";

import FilterSidebar from "./FilterSidebar";
import PropertyCard from "./PropertyCard";
import { properties } from "@/app/Others/PropertyData";

const defaultFilters = {
  keyword: "",
  purpose: "all",
  location: "All",
  minPrice: "",
  maxPrice: "",
  minSize: "",
  maxSize: "",
  beds: "Any",
  postedBy: "All",
};

export default function PropertyBuySellPublicPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [isGrid, setIsGrid] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...properties];
    const f = activeFilters;

    if (f.keyword)
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(f.keyword.toLowerCase()) ||
          p.location.toLowerCase().includes(f.keyword.toLowerCase())
      );
    if (f.purpose !== "all") list = list.filter((p) => p.purpose === f.purpose);
    if (f.location !== "All")
      list = list.filter((p) => p.location === f.location);
    if (f.minPrice) list = list.filter((p) => p.price >= Number(f.minPrice));
    if (f.maxPrice) list = list.filter((p) => p.price <= Number(f.maxPrice));
    if (f.minSize) list = list.filter((p) => p.size >= Number(f.minSize));
    if (f.maxSize) list = list.filter((p) => p.size <= Number(f.maxSize));
    if (f.beds !== "Any") {
      const n = f.beds === "5+" ? 5 : Number(f.beds);
      list =
        f.beds === "5+"
          ? list.filter((p) => p.bedrooms >= n)
          : list.filter((p) => p.bedrooms === n);
    }
    if (f.postedBy === "Owner")
      list = list.filter((p) => p.ownerType === "Property owner");
    if (f.postedBy === "Company")
      list = list.filter((p) => p.ownerType === "Company");

    if (sortBy === "latest")
      list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    else if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "size") list.sort((a, b) => b.size - a.size);

    return list;
  }, [activeFilters, sortBy]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-['Sora',_sans-serif] mt-16">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl" />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden overflow-y-auto"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X size={16} className="text-gray-600" />
                </button>
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onSearch={() => {
                    setActiveFilters(filters);
                    setSidebarOpen(false);
                  }}
                  onClear={() => {
                    setFilters(defaultFilters);
                    setActiveFilters(defaultFilters);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 flex-wrap">
            {["Home", "Properties", "Residential", "Apartment Flats"].map(
              (b, i, arr) => (
                <span key={b} className="flex items-center gap-1.5">
                  <span
                    className={
                      i === arr.length - 1
                        ? "text-amber-600"
                        : "hover:text-gray-600 cursor-pointer transition-colors"
                    }
                  >
                    {b}
                  </span>
                  {i < arr.length - 1 && (
                    <ChevronRight size={12} className="text-gray-300" />
                  )}
                </span>
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Find Your <span className="text-amber-500">Perfect</span>{" "}
                Property
              </h1>
              <p className="text-gray-500 text-sm">
                {filtered.length} properties found in Dhaka
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-400 transition-colors"
              >
                <SlidersHorizontal size={13} />
                Filters
              </button>

              <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setIsGrid(true)}
                  className={`p-2 rounded-lg transition-all ${
                    isGrid
                      ? "bg-amber-500 text-white"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setIsGrid(false)}
                  className={`p-2 rounded-lg transition-all ${
                    !isGrid
                      ? "bg-amber-500 text-white"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <List size={15} />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2">
                <ArrowUpDown size={13} className="text-amber-500" />
                <select
                  className="bg-transparent text-xs text-gray-600 focus:outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="size">Largest First</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="flex gap-6 items-start">
          {/* Desktop sidebar — fixed, doesn't scroll */}
          <div
            className="hidden lg:flex w-72 flex-shrink-0 flex-col"
            style={{
              position: "sticky",
              top: "88px",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onSearch={() => setActiveFilters(filters)}
              onClear={() => {
                setFilters(defaultFilters);
                setActiveFilters(defaultFilters);
              }}
            />
          </div>

          {/* Results — scrolls with page */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <div className="text-5xl mb-4">🏠</div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your search filters
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={isGrid ? "grid" : "list"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    isGrid
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {filtered.map((p, i) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      index={i}
                      isGrid={isGrid}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
