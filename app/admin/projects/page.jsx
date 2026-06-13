"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  X,
  Upload,
  Loader2,
  GripVertical,
  Save,
} from "lucide-react";
import { useToast } from "@/app/components/ui/Toast";
import { adminProjectAPI } from "@/app/lib/api";
import { ConfirmDialog, Modal } from "@/app/components/ui/Modal";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";


const ACCENT_COLORS = [
  { label: "Emerald", value: "from-emerald-900/80 to-emerald-700/40" },
  { label: "Stone", value: "from-stone-900/80 to-stone-700/40" },
  { label: "Teal", value: "from-teal-900/80 to-teal-700/40" },
  { label: "Zinc", value: "from-zinc-900/80 to-zinc-700/40" },
  { label: "Slate", value: "from-slate-900/80 to-slate-700/40" },
  { label: "Rose", value: "from-rose-900/80 to-rose-700/40" },
];

const EMPTY_FORM = {
  title: "",
  type: "",
  description: "",
  location: "",
  status: "Ongoing",
  tag: "New",
  filter: "Apartments",
  area: "",
  rooms: "",
  baths: "",
  floors: "",
  parking: "Yes",
  year: "",
  accentColor: ACCENT_COLORS[0].value,
  isPublished: true,
  isFeatured: false,
};

// ── Input helper ──────────────────────────────────────────────────────────────
const Inp = ({ label, required, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    )}
    <input
      {...props}
      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all"
    />
  </div>
);

const Sel = ({ label, children, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
    )}
    <select
      {...props}
      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 appearance-none transition-all"
    >
      {children}
    </select>
  </div>
);

// ── Custom fields editor ───────────────────────────────────────────────────────
function CustomFieldsEditor({ fields, onChange }) {
  const add = () => onChange([...fields, { key: "", value: "" }]);
  const remove = (i) => onChange(fields.filter((_, idx) => idx !== i));
  const update = (i, k, v) =>
    onChange(fields.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Custom Fields{" "}
          <span className="text-gray-300 normal-case font-normal">
            (add any extra detail)
          </span>
        </label>
        <button
          onClick={add}
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-[#004835] hover:underline"
        >
          <Plus size={13} /> Add Field
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-gray-400 italic">
          No custom fields yet. Click "Add Field" to add extras like "Swimming
          Pool", "Gym", etc.
        </p>
      )}

      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={f.key}
              onChange={(e) => update(i, "key", e.target.value)}
              placeholder="Field name (e.g. Swimming Pool)"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10"
            />
            <input
              value={f.value}
              onChange={(e) => update(i, "value", e.target.value)}
              placeholder="Value (e.g. Yes)"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10"
            />
            <button
              onClick={() => remove(i)}
              type="button"
              className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Project Form Modal ────────────────────────────────────────────────────────
function ProjectFormModal({ open, onClose, onSaved, editProject }) {
  const toast = useToast();
  const mainImgRef = useRef();
  const galleryRef = useRef();

  const [form, setForm] = useState(EMPTY_FORM);
  const [customFields, setCustomFields] = useState([]);
  const [mainImg, setMainImg] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryPrev, setGalleryPrev] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editProject) {
      setForm({
        title: editProject.title || "",
        type: editProject.type || "",
        description: editProject.description || "",
        location: editProject.location || "",
        status: editProject.status || "Ongoing",
        tag: editProject.tag || "New",
        filter: editProject.filter || "Apartments",
        area: editProject.area || "",
        rooms: editProject.rooms || "",
        baths: editProject.baths || "",
        floors: editProject.floors || "",
        parking: editProject.parking || "Yes",
        year: editProject.year || "",
        accentColor: editProject.accentColor || ACCENT_COLORS[0].value,
        isPublished: editProject.isPublished ?? true,
        isFeatured: editProject.isFeatured ?? false,
      });
      setCustomFields(editProject.customFields || []);
      setMainPreview(editProject.mainImage?.url || null);
      setExistingGallery(editProject.gallery || []);
    } else {
      setForm(EMPTY_FORM);
      setCustomFields([]);
      setMainImg(null);
      setMainPreview(null);
      setGallery([]);
      setGalleryPrev([]);
      setExistingGallery([]);
    }
  }, [editProject, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setCheck = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.checked }));

  const handleMainImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImg(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      10 - existingGallery.length - gallery.length
    );
    setGallery((prev) => [...prev, ...files]);
    setGalleryPrev((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingGallery = (publicId) =>
    setExistingGallery((prev) => prev.filter((g) => g.publicId !== publicId));
  const removeNewGallery = (i) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== i));
    setGalleryPrev((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.type || !form.description || !form.location) {
      toast("Title, type, description and location are required", "error");
      return;
    }
    if (!editProject && !mainImg) {
      toast("Main image is required", "error");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("customFields", JSON.stringify(customFields));
      fd.append(
        "keepGallery",
        JSON.stringify(existingGallery.map((g) => g.publicId))
      );

      if (mainImg) fd.append("mainImage", mainImg);
      gallery.forEach((f) => fd.append("gallery", f));

      if (editProject) {
        await adminProjectAPI.update(editProject._id, fd);
        toast("Project updated");
      } else {
        await adminProjectAPI.create(fd);
        toast("Project created");
      }

      onSaved();
      onClose();
    } catch (err) {
      toast(err.message || "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editProject ? "Edit Project" : "Add New Project"}
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Inp
            label="Project Title"
            required
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. BONDS Khan Palace"
          />
          <Inp
            label="Project Type"
            required
            value={form.type}
            onChange={set("type")}
            placeholder="e.g. Premium Apartment"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={3}
            placeholder="Project description..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 resize-none transition-all"
          />
        </div>

        <Inp
          label="Location"
          required
          value={form.location}
          onChange={set("location")}
          placeholder="e.g. Sector-13, Jolshiri Abashon"
        />

        {/* Status / Tag / Filter */}
        <div className="grid grid-cols-3 gap-3">
          <Sel label="Status" value={form.status} onChange={set("status")}>
            <option>Ready</option>
            <option>Ongoing</option>
            <option>Upcoming</option>
          </Sel>
          <Sel label="Tag" value={form.tag} onChange={set("tag")}>
            <option>Featured</option>
            <option>New</option>
            <option>Premium</option>
            <option>Exclusive</option>
            <option>None</option>
          </Sel>
          <Inp
            label="Filter Category"
            value={form.filter}
            onChange={set("filter")}
            placeholder="Apartments"
          />
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <Inp
            label="Area (sqft)"
            value={form.area}
            onChange={set("area")}
            placeholder="2850"
          />
          <Inp
            label="Bedrooms"
            value={form.rooms}
            onChange={set("rooms")}
            placeholder="4"
          />
          <Inp
            label="Bathrooms"
            value={form.baths}
            onChange={set("baths")}
            placeholder="4"
          />
          <Inp
            label="Floors"
            value={form.floors}
            onChange={set("floors")}
            placeholder="12"
          />
          <Inp
            label="Parking"
            value={form.parking}
            onChange={set("parking")}
            placeholder="Yes"
          />
          <Inp
            label="Year"
            value={form.year}
            onChange={set("year")}
            placeholder="2024"
          />
        </div>

        {/* Accent color */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Card Accent Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, accentColor: c.value }))}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${
                    form.accentColor === c.value
                      ? "bg-[#004835] text-white border-[#004835]"
                      : "border-gray-200 text-gray-500 hover:border-[#004835]/40"
                  }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={setCheck("isPublished")}
              className="w-4 h-4 accent-[#004835]"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={setCheck("isFeatured")}
              className="w-4 h-4 accent-[#004835]"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        <hr className="border-gray-100" />

        {/* ── Custom Fields ── */}
        <CustomFieldsEditor fields={customFields} onChange={setCustomFields} />

        <hr className="border-gray-100" />

        {/* ── Main Image ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Main Image *
          </label>
          {mainPreview ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={mainPreview}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setMainImg(null);
                  setMainPreview(editProject?.mainImage?.url || null);
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full text-white flex items-center justify-center"
              >
                <X size={13} />
              </button>
              {mainImg && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#004835] text-white text-[10px] font-bold rounded-full">
                  New
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => mainImgRef.current.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#004835]/50 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-400">
                Click to upload main image
              </span>
            </button>
          )}
          <input
            ref={mainImgRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleMainImg}
          />
        </div>

        {/* ── Gallery ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Gallery ({existingGallery.length + gallery.length}/10)
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
            {existingGallery.map((img) => (
              <div
                key={img.publicId}
                className="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeExistingGallery(img.publicId)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full text-white flex items-center justify-center"
                >
                  <X size={9} />
                </button>
              </div>
            ))}
            {galleryPrev.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#004835]/30"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeNewGallery(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full text-white flex items-center justify-center"
                >
                  <X size={9} />
                </button>
              </div>
            ))}
            {existingGallery.length + gallery.length < 10 && (
              <button
                onClick={() => galleryRef.current.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#004835]/50 flex items-center justify-center"
              >
                <Plus size={18} className="text-gray-400" />
              </button>
            )}
          </div>
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleGallery}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#004835] text-white text-sm font-semibold hover:bg-[#003828] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading
              ? "Saving..."
              : editProject
              ? "Update Project"
              : "Create Project"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editProj, setEditProj] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminProjectAPI.getAll("limit=50");
      setProjects(data.data || []);
    } catch {
      toast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminProjectAPI.delete(deleteId);
      toast("Project deleted");
      setDeleteId(null);
      fetchProjects();
    } catch {
      toast("Failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const data = await adminProjectAPI.togglePublish(id);
      toast(data.message);
      setProjects((prev) => prev.map((p) => (p._id === id ? data.project : p)));
    } catch {
      toast("Failed", "error");
    }
  };

  const openEdit = (proj) => {
    setEditProj(proj);
    setFormOpen(true);
  };
  const openNew = () => {
    setEditProj(null);
    setFormOpen(true);
  };

  return (
    <DashboardLayout
      title="Projects"
      subtitle="Manage your real estate project listings"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors shadow-sm"
        >
          <Plus size={15} /> Add Project
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <p className="text-4xl mb-3">🏗</p>
          <p className="text-gray-500 font-medium mb-1">No projects yet</p>
          <p className="text-sm text-gray-400 mb-5">
            Add your first project to showcase it publicly
          </p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#004835] text-white text-sm font-semibold rounded-xl hover:bg-[#003828] transition-colors"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            {["Project", "Type", "Status", "Published", "Actions"].map(
              (h, i) => (
                <div
                  key={h}
                  className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest
                ${
                  i === 0
                    ? "col-span-4"
                    : i === 1
                    ? "col-span-3"
                    : i === 2
                    ? "col-span-2"
                    : "col-span-1"
                }`}
                >
                  {h}
                </div>
              )
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {projects.map((proj, i) => (
              <motion.div
                key={proj._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors"
              >
                {/* Project */}
                <div className="sm:col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={proj.mainImage?.url}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {proj.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {proj.location}
                    </p>
                  </div>
                </div>

                {/* Type */}
                <div className="sm:col-span-3 text-xs text-gray-500 truncate">
                  {proj.type}
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border
                    ${
                      proj.status === "Ready"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : proj.status === "Upcoming"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                {/* Published toggle */}
                <div className="sm:col-span-1">
                  <button
                    onClick={() => handleTogglePublish(proj._id)}
                    title={
                      proj.isPublished
                        ? "Published — click to unpublish"
                        : "Unpublished — click to publish"
                    }
                    className={`p-2 rounded-xl transition-colors ${
                      proj.isPublished
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {proj.isPublished ? (
                      <Eye size={14} />
                    ) : (
                      <EyeOff size={14} />
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="sm:col-span-2 flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(proj)}
                    className="p-2 rounded-xl bg-[#004835]/8 text-[#004835] hover:bg-[#004835]/15 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(proj._id)}
                    className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Form modal */}
      <ProjectFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchProjects}
        editProject={editProj}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Project"
        message="This will permanently delete this project and all its images. This cannot be undone."
      />
    </DashboardLayout>
  );
}
