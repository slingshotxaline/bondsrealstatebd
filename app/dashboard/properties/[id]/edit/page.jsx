'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, X, Plus, Building2, MapPin, DollarSign, Star, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/ui/Toast';
import { propertyAPI } from '@/app/lib/api';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';


const BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CATEGORIES = ['Apartment','Offices','House','Land','Residential','Other','Building','Restaurant','Factory / Mill','Commercial','Agricultural','Warehouse','Shop','Garage','Hotel','Flat'];
const AMENITIES  = ['Lawn','Drainage','Jacuzzi','Garage','Parking','Air Condition','Balcony','Deck','Fencing','Water Supply','Garden','CCTV','Gym','Microwave','Modular Kitchen','Swimming Pool','TV Cable','Washing Machine','Wifi','Solar Water','Water Well','Water Tank','Cafeteria','Electricity Backup','Intercom','Internet','Kids Playground','Lift','Maintenance','Security Staff','Store Room','Common Room','Study Room','Laundry','Terrace','Locker/Cloak Room','Dining Room','Doorman','Elevator','Family Room','Pets Allowed','Basement','Car Garage','Spa','Unit Washer/Dryer','Fireplace','Cleaning Service','Onsite Parking','Stunning Views','Ventilation','Gas'];

// ── Shared small components ───────────────────────────────────────────────────
const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all ${className}`}
  />
);

const Select = ({ children, className = '', ...props }) => (
  <select
    {...props}
    className={`w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all appearance-none ${className}`}
  >
    {children}
  </select>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
    <div className="w-7 h-7 rounded-lg bg-[#004835]/8 flex items-center justify-center">
      <Icon size={14} className="text-[#004835]" />
    </div>
    <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EditPropertyPage() {
  const router   = useRouter();
  const { id }   = useParams();           // gets the [id] from the URL
  const toast    = useToast();
  const { user } = useAuth();
  const thumbRef  = useRef();
  const photosRef = useRef();

  // ── State ─────────────────────────────────────────────────────────────────
  const [fetching, setFetching] = useState(true); // loading existing data
  const [loading,  setLoading]  = useState(false); // saving / submitting

  const [form, setForm] = useState({
    listingType: 'Sale', propertyType: 'Residential', propertyCategory: 'Apartment',
    address: '', city: '', area: '',
    title: '', description: '', price: '', priceLabel: 'Fixed',
    amenities: [], youtubeUrl: '',
    ownerName: '', ownerEmail: '', ownerPhone: '',
  });

  // New files picked by user (File objects)
  const [newThumbnail,    setNewThumbnail]    = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState(null);
  const [newPhotos,       setNewPhotos]       = useState([]);
  const [newPhotosPreviews, setNewPhotosPreviews] = useState([]);

  // Existing files already on the server (strings — filenames)
  const [existingThumb,  setExistingThumb]  = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);

  const [errors, setErrors] = useState({});

  // ── Load existing property on mount ──────────────────────────────────────
  // Calls GET /api/properties/:id
  // Pre-fills every form field with the existing values
  useEffect(() => {
    if (!id) return;
    propertyAPI.getOne(id)
      .then(data => {
        const p = data.property;

        // Guard: only the owner (or admin) should be here
        const isOwner = p.submittedBy === user?._id || p.submittedBy?._id === user?._id;
        const isAdmin  = user?.role === 'admin' || user?.role === 'superadmin';
        if (!isOwner && !isAdmin) {
          toast('Not authorized to edit this property', 'error');
          router.push('/dashboard/properties');
          return;
        }

        // Pre-fill all text fields
        setForm({
          listingType:      p.listingType      || 'Sale',
          propertyType:     p.propertyType     || 'Residential',
          propertyCategory: p.propertyCategory || 'Apartment',
          address:          p.address          || '',
          city:             p.city             || '',
          area:             p.area             || '',
          title:            p.title            || '',
          description:      p.description      || '',
          price:            p.price            || '',
          priceLabel:       p.priceLabel       || 'Fixed',
          amenities:        p.amenities        || [],
          youtubeUrl:       p.youtubeUrl       || '',
          ownerName:        p.ownerName        || '',
          ownerEmail:       p.ownerEmail       || '',
          ownerPhone:       p.ownerPhone       || '',
        });

        // Store existing media filenames so we can show previews
        setExistingThumb(p.thumbnail  || null);
        setExistingPhotos(p.photos    || []);
      })
      .catch(() => {
        toast('Failed to load property', 'error');
        router.push('/dashboard/properties');
      })
      .finally(() => setFetching(false));
  }, [id]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAmenity = (a) =>
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a],
    }));

  // Replace thumbnail with a new local file
  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewThumbnail(file);
    setNewThumbPreview(URL.createObjectURL(file));
    setExistingThumb(null); // hide the old one
  };

  // Clear the existing server thumbnail (user wants to remove it)
  const clearExistingThumb = () => {
    setExistingThumb(null);
    setNewThumbnail(null);
    setNewThumbPreview(null);
  };

  // Add new local photos (on top of existing)
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 10 - existingPhotos.length - newPhotos.length;
    const picked    = files.slice(0, remaining);
    setNewPhotos(prev => [...prev, ...picked]);
    setNewPhotosPreviews(prev => [...prev, ...picked.map(f => URL.createObjectURL(f))]);
  };

  // Remove an existing server photo
  const removeExistingPhoto = (photo) =>
    setExistingPhotos(prev => prev.filter(f => (f.publicId || f) !== (photo.publicId || photo)));

  // Remove a newly picked (not yet uploaded) photo
  const removeNewPhoto = (i) => {
    setNewPhotos(prev => prev.filter((_, idx) => idx !== i));
    setNewPhotosPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.address.trim())     e.address     = 'Address is required';
    if (!form.city.trim())        e.city        = 'City is required';
    if (!form.area.trim())        e.area        = 'Area is required';
    if (!form.price)              e.price       = 'Price is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.ownerName.trim())   e.ownerName   = 'Owner name is required';
    if (!form.ownerEmail.trim())  e.ownerEmail  = 'Owner email is required';
    if (!form.ownerPhone.trim())  e.ownerPhone  = 'Owner phone is required';
    // Thumbnail required: either an existing one is kept OR a new one picked
    if (!existingThumb && !newThumbnail) e.thumbnail = 'Thumbnail is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  // Builds FormData and calls PUT /api/properties/:id
  // Backend multer reads new files; existing filenames are kept server-side
  const handleSubmit = async () => {
    if (!validate()) { toast('Please fix the errors below', 'error'); return; }
    setLoading(true);
    try {
      const fd = new FormData();

      // All text fields
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'amenities') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });

      // New files (only if user picked replacements)
      if (newThumbnail)         fd.append('thumbnail', newThumbnail);
      newPhotos.forEach(f =>   fd.append('photos', f));

      // Tell backend which existing photos to keep
      // (backend can use this to delete the rest from disk)
      fd.append('keepPhotos', JSON.stringify(existingPhotos.map(p => p.publicId || p)));

      await propertyAPI.update(id, fd);
      toast('Property updated successfully!');
      router.push('/dashboard/properties');
    } catch (err) {
      toast(err.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state while fetching property ─────────────────────────────────
  if (fetching) {
    return (
      <DashboardLayout title="Edit Property" subtitle="Loading property data...">
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="text-[#004835] animate-spin" />
            <p className="text-sm text-gray-400">Loading property...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalPhotos = existingPhotos.length + newPhotos.length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Edit Property" subtitle="Update your property listing details">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          {/* ── Section 1: Listing Info ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={Building2} title="Listing Information" />
            <div className="space-y-4">

              <Field label="I want to" required>
                <div className="flex gap-3">
                  {['Sale', 'Rent'].map(t => (
                    <button
                      key={t}
                      onClick={() => set('listingType', t)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all
                        ${form.listingType === t
                          ? 'bg-[#004835] text-white border-[#004835]'
                          : 'border-gray-200 text-gray-500 hover:border-[#004835]/40'}`}
                    >{t}</button>
                  ))}
                </div>
              </Field>

              <Field label="Property Type" required>
                <div className="flex gap-3">
                  {['Residential', 'Commercial'].map(t => (
                    <button
                      key={t}
                      onClick={() => set('propertyType', t)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all
                        ${form.propertyType === t
                          ? 'bg-[#004835] text-white border-[#004835]'
                          : 'border-gray-200 text-gray-500 hover:border-[#004835]/40'}`}
                    >{t}</button>
                  ))}
                </div>
              </Field>

              <Field label="Property Category" required>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => set('propertyCategory', c)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                        ${form.propertyCategory === c
                          ? 'bg-[#004835] text-white border-[#004835]'
                          : 'border-gray-200 text-gray-500 hover:border-[#004835]/40 bg-gray-50'}`}
                    >{c}</button>
                  ))}
                </div>
              </Field>

            </div>
          </div>

          {/* ── Section 2: Location ──────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={MapPin} title="Location" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <Field label="Address" required>
                  <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. House no, Street name" />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </Field>
              </div>
              <Field label="City" required>
                <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </Field>
              <Field label="Area" required>
                <Input value={form.area} onChange={e => set('area', e.target.value)} placeholder="Area" />
                {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
              </Field>
            </div>
          </div>

          {/* ── Section 3: Amenities ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={Star} title="Amenities" />
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                    ${form.amenities.includes(a)
                      ? 'bg-[#004835] text-white border-[#004835]'
                      : 'border-gray-200 text-gray-500 hover:border-[#004835]/40 bg-gray-50'}`}
                >{a}</button>
              ))}
            </div>
            {form.amenities.length > 0 && (
              <p className="text-xs text-[#004835] font-medium mt-3">{form.amenities.length} amenities selected</p>
            )}
          </div>

          {/* ── Section 4: Photos & Media ────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={ImageIcon} title="Photos & Media" />
            <div className="space-y-5">

              {/* Thumbnail */}
              <Field label="Thumbnail" required hint="Only property-related photos. Max 5MB.">
                {/* Show existing server thumbnail */}
                {existingThumb && !newThumbPreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                    <img
                     src={existingThumb?.url || existingThumb}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {/* Replace button */}
                    <button
                      onClick={() => thumbRef.current.click()}
                      className="absolute bottom-2 left-2 px-3 py-1.5 bg-black/60 text-white text-xs font-semibold rounded-lg hover:bg-black/80 transition-colors"
                    >Replace</button>
                    {/* Remove button */}
                    <button
                      onClick={clearExistingThumb}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                    ><X size={13} /></button>
                  </div>
                )}

                {/* Show newly picked thumbnail preview */}
                {newThumbPreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                    <img src={newThumbPreview} alt="New Thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#004835] text-white text-[10px] font-bold rounded-full">New</div>
                    <button
                      onClick={() => { setNewThumbnail(null); setNewThumbPreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                    ><X size={13} /></button>
                  </div>
                )}

                {/* Upload zone: shown only when no thumb at all */}
                {!existingThumb && !newThumbPreview && (
                  <button
                    onClick={() => thumbRef.current.click()}
                    className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors
                      ${errors.thumbnail ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-[#004835]/50'}`}
                  >
                    <Upload size={20} className={errors.thumbnail ? 'text-red-400' : 'text-gray-400'} />
                    <span className="text-sm text-gray-400">Click to upload thumbnail</span>
                  </button>
                )}

                {errors.thumbnail && <p className="text-xs text-red-500 mt-1">{errors.thumbnail}</p>}
                <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
              </Field>

              {/* Photos gallery */}
              <Field label={`Photos (${totalPhotos}/10)`} hint="Only property-related photos. Max 5MB each.">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">

                  {/* Existing server photos */}
                  {existingPhotos.map((filename) => (
                    <div key={filename} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={photo?.url || photo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeExistingPhoto(filename)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                      ><X size={10} /></button>
                    </div>
                  ))}

                  {/* Newly picked photos */}
                  {newPhotosPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#004835]/30">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 w-4 h-4 bg-[#004835] rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">N</span>
                      </div>
                      <button
                        onClick={() => removeNewPhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                      ><X size={10} /></button>
                    </div>
                  ))}

                  {/* Add more button */}
                  {totalPhotos < 10 && (
                    <button
                      onClick={() => photosRef.current.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#004835]/50 flex items-center justify-center"
                    ><Plus size={18} className="text-gray-400" /></button>
                  )}
                </div>
                <input ref={photosRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
              </Field>

              {/* YouTube URL */}
              <Field label="YouTube Video URL">
                <Input
                  value={form.youtubeUrl}
                  onChange={e => set('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </Field>

            </div>
          </div>

          {/* ── Section 5: Property Details ──────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={DollarSign} title="Property Details" />
            <div className="space-y-4">

              <Field label="Property Title" required>
                <Input
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Spacious 3BHK Apartment in Gulshan"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </Field>

              <Field label="Description" required>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={5}
                  placeholder="Describe the property in detail..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 resize-none transition-all"
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (৳)" required>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    placeholder="5000000"
                    min="0"
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </Field>
                <Field label="Price Label">
                  <Select value={form.priceLabel} onChange={e => set('priceLabel', e.target.value)}>
                    {['Fixed','Negotiable','On Request','Per Month','Per Year'].map(l => (
                      <option key={l}>{l}</option>
                    ))}
                  </Select>
                </Field>
              </div>

            </div>
          </div>

          {/* ── Section 6: Owner Info ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <SectionHeader icon={Building2} title="Owner Information" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Owner Name" required>
                <Input value={form.ownerName} onChange={e => set('ownerName', e.target.value)} placeholder="Full Name" />
                {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
              </Field>
              <Field label="Owner Email" required>
                <Input type="email" value={form.ownerEmail} onChange={e => set('ownerEmail', e.target.value)} placeholder="email@example.com" />
                {errors.ownerEmail && <p className="text-xs text-red-500 mt-1">{errors.ownerEmail}</p>}
              </Field>
              <Field label="Owner Phone" required>
                <Input value={form.ownerPhone} onChange={e => set('ownerPhone', e.target.value)} placeholder="+880..." />
                {errors.ownerPhone && <p className="text-xs text-red-500 mt-1">{errors.ownerPhone}</p>}
              </Field>
            </div>
          </div>

          {/* ── Action buttons ───────────────────────────────────────────── */}
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
              className="flex-1 sm:flex-none px-8 py-3 bg-[#004835] hover:bg-[#003828] text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#004835]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </motion.div>
      </div>
    </DashboardLayout>
  );
}