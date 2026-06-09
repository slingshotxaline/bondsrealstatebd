"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  X,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/app/components/ui/Toast";
import { propertyAPI } from "@/app/lib/api";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";

const CATEGORIES = [
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
const AMENITIES = [
  "Lawn",
  "Drainage",
  "Jacuzzi",
  "Garage",
  "Parking",
  "Air Condition",
  "Balcony",
  "Deck",
  "Fencing",
  "Water Supply",
  "Garden",
  "CCTV",
  "Gym",
  "Microwave",
  "Modular Kitchen",
  "Swimming Pool",
  "TV Cable",
  "Washing Machine",
  "Wifi",
  "Solar Water",
  "Water Well",
  "Water Tank",
  "Cafeteria",
  "Electricity Backup",
  "Intercom",
  "Internet",
  "Kids Playground",
  "Lift",
  "Maintenance",
  "Security Staff",
  "Store Room",
  "Common Room",
  "Study Room",
  "Laundry",
  "Terrace",
  "Locker/Cloak Room",
  "Dining Room",
  "Doorman",
  "Elevator",
  "Family Room",
  "Pets Allowed",
  "Basement",
  "Car Garage",
  "Spa",
  "Unit Washer/Dryer",
  "Fireplace",
  "Cleaning Service",
  "Onsite Parking",
  "Stunning Views",
  "Ventilation",
  "Gas",
];

const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all ${className}`}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <select
    {...props}
    className={`w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all appearance-none ${className}`}
  >
    {children}
  </select>
);

export default function AddPropertyPage() {
  const router = useRouter();
  const toast = useToast();
  const thumbRef = useRef();
  const photosRef = useRef();

  const [form, setForm] = useState({
    listingType: "Sale",
    propertyType: "Residential",
    propertyCategory: "Apartment",
    address: "",
    city: "",
    area: "",
    title: "",
    description: "",
    price: "",
    priceLabel: "Fixed",
    amenities: [],
    youtubeUrl: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photosPreviews, setPhotosPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setPhotos(files);
    setPhotosPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (i) => {
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPhotosPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.area.trim()) e.area = "Area is required";
    if (!form.price) e.price = "Price is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!form.ownerEmail.trim()) e.ownerEmail = "Owner email is required";
    if (!form.ownerPhone.trim()) e.ownerPhone = "Owner phone is required";
    if (!thumbnail) e.thumbnail = "Thumbnail is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast("Please fix the errors below", "error");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "amenities") fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      fd.append("thumbnail", thumbnail);
      photos.forEach((f) => fd.append("photos", f));

      await propertyAPI.create(fd);
      toast("Property submitted for review!");
      router.push("/dashboard/properties");
    } catch (err) {
      toast(err.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
      <div className="w-7 h-7 rounded-lg bg-[#004835]/8 flex items-center justify-center">
        <Icon size={14} className="text-[#004835]" />
      </div>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
    </div>
  );

  return (
    <DashboardLayout
      title="Post Property"
      subtitle="Fill in the details to list your property"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Section 1: Listing Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={Building2} title="Listing Information" />
            <div className="space-y-4">
              {/* I want to */}
              <Field label="I want to" required>
                <div className="flex gap-3">
                  {["Sale", "Rent"].map((t) => (
                    <button
                      key={t}
                      onClick={() => set("listingType", t)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all
                        ${
                          form.listingType === t
                            ? "bg-[#004835] text-white border-[#004835]"
                            : "border-gray-200 text-gray-500 hover:border-[#004835]/40"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Property Type */}
              <Field label="Property Type" required>
                <div className="flex gap-3">
                  {["Residential", "Commercial"].map((t) => (
                    <button
                      key={t}
                      onClick={() => set("propertyType", t)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all
                        ${
                          form.propertyType === t
                            ? "bg-[#004835] text-white border-[#004835]"
                            : "border-gray-200 text-gray-500 hover:border-[#004835]/40"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Category */}
              <Field label="Property Category" required>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => set("propertyCategory", c)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                        ${
                          form.propertyCategory === c
                            ? "bg-[#004835] text-white border-[#004835]"
                            : "border-gray-200 text-gray-500 hover:border-[#004835]/40 bg-gray-50"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={MapPin} title="Location" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <Field label="Address" required>
                  <Input
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="e.g. House no, Street name"
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.address}
                    </p>
                  )}
                </Field>
              </div>
              <Field label="City" required>
                <Input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
              </Field>
              <Field label="Area" required>
                <Input
                  value={form.area}
                  onChange={(e) => set("area", e.target.value)}
                  placeholder="Area"
                />
                {errors.area && (
                  <p className="text-xs text-red-500 mt-1">{errors.area}</p>
                )}
              </Field>
            </div>
          </div>

          {/* Section 3: Amenities */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={Star} title="Amenities" />
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                    ${
                      form.amenities.includes(a)
                        ? "bg-[#004835] text-white border-[#004835]"
                        : "border-gray-200 text-gray-500 hover:border-[#004835]/40 bg-gray-50"
                    }`}
                >
                  {a}
                </button>
              ))}
            </div>
            {form.amenities.length > 0 && (
              <p className="text-xs text-[#004835] font-medium mt-3">
                {form.amenities.length} amenities selected
              </p>
            )}
          </div>

          {/* Section 4: Media */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={ImageIcon} title="Photos & Media" />
            <div className="space-y-5">
              {/* Thumbnail */}
              <Field
                label="Thumbnail"
                required
                hint="Only property-related photos. Max 5MB."
              >
                {thumbPreview ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={thumbPreview}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setThumbnail(null);
                        setThumbPreview(null);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => thumbRef.current.click()}
                    className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors
                      ${
                        errors.thumbnail
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-[#004835]/50 hover:bg-[#004835]/2"
                      }`}
                  >
                    <Upload
                      size={20}
                      className={
                        errors.thumbnail ? "text-red-400" : "text-gray-400"
                      }
                    />
                    <span className="text-sm text-gray-400">
                      Click to upload thumbnail
                    </span>
                  </button>
                )}
                {errors.thumbnail && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.thumbnail}
                  </p>
                )}
                <input
                  ref={thumbRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnail}
                />
              </Field>

              {/* Photos */}
              <Field
                label="Photos (up to 10)"
                hint="Only property-related photos. Max 5MB each."
              >
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                  {photosPreviews.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {photosPreviews.length < 10 && (
                    <button
                      onClick={() => photosRef.current.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#004835]/50 flex items-center justify-center"
                    >
                      <Plus size={18} className="text-gray-400" />
                    </button>
                  )}
                </div>
                <input
                  ref={photosRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotos}
                />
              </Field>

              {/* YouTube */}
              <Field label="YouTube Video URL">
                <Input
                  value={form.youtubeUrl}
                  onChange={(e) => set("youtubeUrl", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </Field>
            </div>
          </div>

          {/* Section 5: Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={DollarSign} title="Property Details" />
            <div className="space-y-4">
              <Field label="Property Title" required>
                <Input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Spacious 3BHK Apartment in Gulshan"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </Field>

              <Field label="Description" required>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={5}
                  placeholder="Describe the property in detail..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 resize-none transition-all"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (৳)" required>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="5000000"
                    min="0"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </Field>
                <Field label="Price Label">
                  <Select
                    value={form.priceLabel}
                    onChange={(e) => set("priceLabel", e.target.value)}
                  >
                    {[
                      "Fixed",
                      "Negotiable",
                      "On Request",
                      "Per Month",
                      "Per Year",
                    ].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>
          </div>

          {/* Section 6: Owner Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={Building2} title="Owner Information" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Owner Name" required>
                <Input
                  value={form.ownerName}
                  onChange={(e) => set("ownerName", e.target.value)}
                  placeholder="Full Name"
                />
                {errors.ownerName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.ownerName}
                  </p>
                )}
              </Field>
              <Field label="Owner Email" required>
                <Input
                  type="email"
                  value={form.ownerEmail}
                  onChange={(e) => set("ownerEmail", e.target.value)}
                  placeholder="email@example.com"
                />
                {errors.ownerEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.ownerEmail}
                  </p>
                )}
              </Field>
              <Field label="Owner Phone" required>
                <Input
                  value={form.ownerPhone}
                  onChange={(e) => set("ownerPhone", e.target.value)}
                  placeholder="+880..."
                />
                {errors.ownerPhone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.ownerPhone}
                  </p>
                )}
              </Field>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pb-4">
            <button
              onClick={() => router.back()}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 sm:flex-none px-8 py-3 bg-[#004835] hover:bg-[#003828] text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#004835]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Property"}
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
