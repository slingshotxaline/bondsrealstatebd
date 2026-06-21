"use client";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all";

const labelClass =
  "block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2";

const PROPERTY_CATEGORIES = [
  "Apartment",
  "Offices",
  "House",
  "Land",
  "Residential",
  "Other",
  "Building",
  "Restaurant",
  "Factory / Mill",
  "Commercial",
  "Agricultural",
  "Warehouse",
  "Shop",
  "Garage",
  "Hotel",
  "Flat",
];

function Section({ id, label, children, openSections, toggle }) {
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between text-left mb-3 group"
      >
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-amber-500 transition-colors">
          {label}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${
            openSections[id] ? "rotate-180" : ""
          }`}
        />
      </button>
      {openSections[id] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  setFilters,
  onSearch,
  onClear,
  lockListingType, // e.g. "Rent" or "Sale" — hides the toggle and forces this value
}) {
  const [openSections, setOpenSections] = useState({
    listingType: true,
    propertyType: true,
    category: false,
    location: true,
    price: true,
    amenities: false,
  });

  // Fetch distinct cities from API for the location dropdown
  const [cities, setCities] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/properties/meta`)
      .then((r) => r.json())
      .then((d) => setCities(d.cities || []))
      .catch(() => {});
  }, []);

  const toggle = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const set = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const setFromEvent = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-72 flex-shrink-0 self-start"
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
            <SlidersHorizontal size={14} className="text-amber-500" />
          </div>
          <span className="text-gray-800 font-semibold text-sm">Filters</span>
        </div>

        {/* Keyword search */}
        <div className="mb-4">
          <label className={labelClass}>Keyword Search</label>
          <input
            className={inputClass}
            placeholder="Title, location, keyword..."
            value={filters.keyword}
            onChange={setFromEvent("keyword")}
          />
        </div>

        {/* Listing Type — Sale / Rent — hidden when locked */}
        {!lockListingType && (
          <Section
            id="listingType"
            label="I want to"
            openSections={openSections}
            toggle={toggle}
          >
            <div className="flex gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Buy", value: "Sale" },
                { label: "Rent", value: "Rent" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => set("listingType")(value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
                    ${
                      filters.listingType === value
                        ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
                        : "bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Property Type — Residential / Commercial */}
        <Section
          id="propertyType"
          label="Property Type"
          openSections={openSections}
          toggle={toggle}
        >
          <div className="flex gap-2">
            {[
              { label: "All", value: "" },
              { label: "Residential", value: "Residential" },
              { label: "Commercial", value: "Commercial" },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => set("propertyType")(value)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
                  ${
                    filters.propertyType === value
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
                      : "bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Property Category */}
        <Section
          id="category"
          label="Category"
          openSections={openSections}
          toggle={toggle}
        >
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => set("propertyCategory")("")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${
                  filters.propertyCategory === ""
                    ? "bg-amber-500 text-white"
                    : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300"
                }`}
            >
              All
            </button>
            {PROPERTY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => set("propertyCategory")(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${
                    filters.propertyCategory === cat
                      ? "bg-amber-500 text-white"
                      : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Section>

        {/* Location — City + Area */}
        <Section
          id="location"
          label="Location"
          openSections={openSections}
          toggle={toggle}
        >
          <div className="space-y-2">
            {cities.length > 0 ? (
              <select
                className={inputClass}
                value={filters.city}
                onChange={setFromEvent("city")}
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={inputClass}
                placeholder="City (e.g. Dhaka)"
                value={filters.city}
                onChange={setFromEvent("city")}
              />
            )}
            <input
              className={inputClass}
              placeholder="Area (e.g. Gulshan)"
              value={filters.area}
              onChange={setFromEvent("area")}
            />
          </div>
        </Section>

        {/* Price Range */}
        <Section
          id="price"
          label="Price (৳)"
          openSections={openSections}
          toggle={toggle}
        >
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="Min"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={setFromEvent("minPrice")}
            />
            <input
              className={inputClass}
              placeholder="Max"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={setFromEvent("maxPrice")}
            />
          </div>
          {/* Quick price presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              { label: "< 50L", min: "", max: "5000000" },
              { label: "50L-1Cr", min: "5000000", max: "10000000" },
              { label: "1-2Cr", min: "10000000", max: "20000000" },
              { label: "> 2Cr", min: "20000000", max: "" },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: preset.min,
                    maxPrice: preset.max,
                  }))
                }
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all
                  ${
                    filters.minPrice === preset.min &&
                    filters.maxPrice === preset.max
                      ? "bg-amber-500 text-white"
                      : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300"
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Amenities quick picks */}
        <Section
          id="amenities"
          label="Amenities"
          openSections={openSections}
          toggle={toggle}
        >
          <div className="flex flex-wrap gap-1.5">
            {[
              "Parking",
              "Gym",
              "Swimming Pool",
              "Wifi",
              "Balcony",
              "Lift",
              "CCTV",
              "Generator",
              "Lawn",
              "Air Condition",
            ].map((a) => {
              const selected = (filters.amenities || []).includes(a);
              return (
                <button
                  key={a}
                  onClick={() => {
                    const current = filters.amenities || [];
                    set("amenities")(
                      selected
                        ? current.filter((x) => x !== a)
                        : [...current, a]
                    );
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${
                      selected
                        ? "bg-amber-500 text-white"
                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Active filters summary */}
        {(() => {
          const active = [
            !lockListingType &&
              filters.listingType &&
              filters.listingType !== "all" &&
              filters.listingType,
            filters.propertyType && filters.propertyType,
            filters.propertyCategory && filters.propertyCategory,
            filters.city && filters.city,
            filters.area && filters.area,
            filters.minPrice &&
              `From ৳${Number(filters.minPrice).toLocaleString()}`,
            filters.maxPrice &&
              `Up to ৳${Number(filters.maxPrice).toLocaleString()}`,
            ...(filters.amenities || []),
            filters.keyword && `"${filters.keyword}"`,
          ].filter(Boolean);

          return active.length > 0 ? (
            <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-2">
                Active filters ({active.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {active.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-semibold"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm rounded-xl transition-all hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-95"
          >
            Search
          </button>
          <button
            onClick={onClear}
            className="px-4 py-3 bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-700 rounded-xl transition-all hover:border-gray-300"
            title="Clear all filters"
          >
            <X size={15} />
          </button>
        </div>

        <button className="w-full mt-3 py-2.5 text-xs text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-50 transition-all font-semibold">
          Tell Us Your Requirement
        </button>
      </div>
    </motion.aside>
  );
}
