"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { propertyAPI } from "@/app/lib/api";
import FilterSidebar from "./FilterSidebar";
import PropertyCard from "./PropertyCard";


const SORT_OPTIONS = [
  { value: "newest", label: "Latest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function PropertyBuySellPublicPage() {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Filter state — matches FilterSidebar fields
  const [filters, setFilters] = useState({
    keyword: "",
    listingType: "all", // Sale | Rent | all
    city: "",
    area: "",
    minPrice: "",
    maxPrice: "",
    propertyCategory: "",
  });
  const [activeFilters, setActiveFilters] = useState(filters);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9, sort: sortBy });
      if (activeFilters.listingType !== "all")
        params.set("listingType", activeFilters.listingType);
      if (activeFilters.city) params.set("city", activeFilters.city);
      if (activeFilters.area) params.set("area", activeFilters.area);
      if (activeFilters.minPrice)
        params.set("minPrice", activeFilters.minPrice);
      if (activeFilters.maxPrice)
        params.set("maxPrice", activeFilters.maxPrice);
      if (activeFilters.propertyCategory)
        params.set("propertyCategory", activeFilters.propertyCategory);
      if (activeFilters.keyword) params.set("search", activeFilters.keyword);

      const data = await propertyAPI.getAll(params.toString());
      setProperties(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, activeFilters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = () => {
    setPage(1);
    setActiveFilters(filters);
    setSidebarOpen(false);
  };

  const handleClear = () => {
    const empty = {
      keyword: "",
      listingType: "all",
      city: "",
      area: "",
      minPrice: "",
      maxPrice: "",
      propertyCategory: "",
    };
    setFilters(empty);
    setActiveFilters(empty);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-['Sora',_sans-serif] mt-16">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl" />
      </div>

      {/* Mobile sidebar */}
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
                  onSearch={handleSearch}
                  onClear={handleClear}
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
            {["Home", "Properties", "All Listings"].map((b, i, arr) => (
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
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Find Your <span className="text-amber-500">Perfect</span>{" "}
                Property
              </h1>
              <p className="text-gray-500 text-sm">
                {loading
                  ? "Searching..."
                  : `${pagination.total || 0} properties found`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-400 transition-colors"
              >
                <SlidersHorizontal size={13} /> Filters
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
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="flex gap-6 items-start">
          {/* Desktop sidebar */}
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
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={28} className="text-amber-500 animate-spin" />
                  <p className="text-sm text-gray-400">Loading properties...</p>
                </div>
              </div>
            ) : properties.length === 0 ? (
              <motion.div
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
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={
                    isGrid
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {properties.map((p, i) => (
                    <PropertyCard
                      key={p._id}
                      property={p}
                      index={i}
                      isGrid={isGrid}
                    />
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    )
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === pagination.totalPages ||
                          Math.abs(p - page) <= 1
                      )
                      .map((p, i, arr) => (
                        <span key={p} className="flex items-center gap-2">
                          {i > 0 && arr[i - 1] !== p - 1 && (
                            <span className="text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors
                              ${
                                p === page
                                  ? "bg-amber-500 text-white"
                                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                          >
                            {p}
                          </button>
                        </span>
                      ))}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
