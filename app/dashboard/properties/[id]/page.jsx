'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Eye, Star, CheckCircle, Share2,
  Phone, Mail, MessageSquare, Calendar,
  Wifi, Car, Dumbbell, Waves, X, ChevronLeft, ChevronRight, Play,
  Building2, Loader2,
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/ui/Toast';
import { propertyAPI } from '@/app/lib/api';

const AMENITY_ICONS = { Wifi, Parking: Car, Gym: Dumbbell, 'Swimming Pool': Waves };

// ── Image Lightbox ────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index);
  const prev = () => setCur(i => (i - 1 + images.length) % images.length);
  const next = () => setCur(i => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <motion.img
          key={cur}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={images[cur]}
          alt=""
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
          onClick={e => e.stopPropagation()}
        />
        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-4 text-sm text-white/60">{cur + 1} / {images.length}</div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Inquiry Modal ─────────────────────────────────────────────────────────────
function InquiryModal({ property, open, onClose, defaultType = 'General' }) {
  const { user } = useAuth();
  const toast    = useToast();

  const [form, setForm] = useState({
    name:               user?.name  || '',
    email:              user?.email || '',
    phone:              '',
    message:            '',
    inquiryType:        defaultType,
    preferredVisitDate: '',
  });
  const [loading, setLoading] = useState(false);

  // sync inquiryType when defaultType changes (Schedule Visit button)
  useEffect(() => {
    setForm(f => ({ ...f, inquiryType: defaultType }));
  }, [defaultType]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast('Name, email and message are required', 'error'); return;
    }
    setLoading(true);
    try {
      await propertyAPI.submitInquiry(property._id, form);
      toast('Inquiry submitted! We will contact you shortly.');
      onClose();
    } catch (err) {
      toast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#004835] focus:ring-2 focus:ring-[#004835]/10 transition-all';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#004835] to-[#C89A6C] flex-shrink-0" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-gray-900">Post an Inquiry</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{property?.title}</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* Inquiry type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Inquiry Type
                </label>
                <div className="flex gap-2">
                  {['General', 'Purchase', 'Visit'].map(t => (
                    <button
                      key={t}
                      onClick={() => setForm(f => ({ ...f, inquiryType: t }))}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all
                        ${form.inquiryType === t
                          ? 'bg-[#004835] text-white border-[#004835]'
                          : 'border-gray-200 text-gray-500 hover:border-[#004835]/40'}`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Name *</label>
                  <input value={form.name} onChange={set('name')} placeholder="Your name" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Phone</label>
                  <input value={form.phone} onChange={set('phone')} placeholder="+880..." className={inp} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inp} />
              </div>

              {form.inquiryType === 'Visit' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={form.preferredVisitDate}
                    onChange={set('preferredVisitDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className={inp}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Message *</label>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={4}
                  placeholder={
                    form.inquiryType === 'Purchase' ? 'I am interested in purchasing this property...' :
                    form.inquiryType === 'Visit'    ? 'I would like to schedule a visit...' :
                    'I have a question about this property...'
                  }
                  className={`${inp} resize-none`}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-[#004835] hover:bg-[#003828] text-white font-bold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-[#004835]/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const { id }  = useParams();
  const router  = useRouter();
  const toast   = useToast();

  const [property,      setProperty]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [inquiryOpen,   setInquiryOpen]   = useState(false);
  const [inquiryType,   setInquiryType]   = useState('General');
  const [activeTab,     setActiveTab]     = useState('details');

  useEffect(() => {
    if (!id) return;
    propertyAPI.getOne(id)
      .then(d => setProperty(d.property))
      .catch(() => { toast('Property not found', 'error'); router.push('/'); })
      .finally(() => setLoading(false));
  }, [id]);

  // ── Open inquiry with a specific type pre-selected ────────────────────────
  const openInquiry = (type = 'General') => {
    setInquiryType(type);
    setInquiryOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-[#004835] animate-spin" />
          <p className="text-sm text-gray-400">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) return null;

  // ── Build image array from Cloudinary objects { url, publicId } ──────────
  // thumbnail and photos are now objects, not plain filename strings
  const allImages = [
    property.thumbnail?.url,
    ...(property.photos || []).map(p => p.url),
  ].filter(Boolean);

  const getYouTubeId = (url) => {
    const match = url?.match(/(?:v=|\.be\/|embed\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-gray-900 h-72 sm:h-96 overflow-hidden">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[0]}
              alt={property.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 size={48} className="text-gray-600" />
          </div>
        )}

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-[#004835] text-white text-xs font-bold rounded-full">
            {property.listingType}
          </span>
          {property.isFeatured && (
            <span className="px-3 py-1 bg-[#C89A6C] text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
        </div>

        {allImages.length > 1 && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 text-white text-xs font-semibold rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm"
          >
            <Eye size={13} /> View all {allImages.length} photos
          </button>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/70 text-xs">
          <Eye size={12} /> {property.views} views
        </div>
      </div>

      {/* ── Photo strip ──────────────────────────────────────────────────── */}
      {allImages.length > 1 && (
        <div className="bg-white border-b border-gray-100 px-4 lg:px-8 py-3">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1">
            {allImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#004835] transition-colors"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title + price */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={14} className="text-[#004835]" />
                    {property.area}, {property.city}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#004835]">৳{property.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{property.priceLabel}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#004835]/8 text-[#004835] border border-[#004835]/15">
                  {property.propertyType}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  {property.propertyCategory}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C89A6C]/15 text-[#8B6035]">
                  For {property.listingType}
                </span>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1">
              {['details', 'amenities', 'location'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all
                    ${activeTab === tab ? 'bg-[#004835] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >{tab}</button>
              ))}
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              {activeTab === 'details' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                  {property.youtubeUrl && getYouTubeId(property.youtubeUrl) && (
                    <div className="mt-5">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Play size={16} className="text-red-500" /> Video Tour
                      </h3>
                      <div className="aspect-video rounded-xl overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(property.youtubeUrl)}`}
                          className="w-full h-full"
                          allowFullScreen
                          title="Property video"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'amenities' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Available Amenities</h3>
                  {property.amenities?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map(a => {
                        const Icon = AMENITY_ICONS[a];
                        return (
                          <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#004835]/8 text-[#004835] text-xs font-semibold border border-[#004835]/15">
                            {Icon && <Icon size={11} />}
                            <CheckCircle size={11} />
                            {a}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No amenities listed.</p>
                  )}
                </div>
              )}

              {activeTab === 'location' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Location Details</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Full Address', value: property.address },
                      { label: 'Area',         value: property.area   },
                      { label: 'City',         value: property.city   },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <MapPin size={14} className="text-[#004835] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{label}</p>
                          <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: sticky sidebar */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 lg:sticky lg:top-24"
            >
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Contact Owner</h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004835] to-[#004835]/60 flex items-center justify-center text-white font-bold text-sm">
                  {property.ownerName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{property.ownerName}</p>
                  <p className="text-xs text-gray-400">Property Owner</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <a
                  href={`mailto:${property.ownerEmail}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Mail size={14} className="text-[#004835]" />
                  <span className="truncate text-xs text-gray-700">{property.ownerEmail}</span>
                </a>
                {property.ownerPhone && (
                  <a
                    href={`tel:${property.ownerPhone}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Phone size={14} className="text-[#004835]" />
                    <span className="text-xs text-gray-700">{property.ownerPhone}</span>
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => openInquiry('General')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#004835] hover:bg-[#003828] text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#004835]/20"
                >
                  <MessageSquare size={15} />
                  Send Inquiry
                </button>

                {/* Schedule Visit opens modal with Visit type pre-selected */}
                <button
                  onClick={() => openInquiry('Visit')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#004835]/30 text-[#004835] text-sm font-semibold rounded-xl hover:bg-[#004835]/5 transition-colors"
                >
                  <Calendar size={14} />
                  Schedule Visit
                </button>
              </div>

              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast('Link copied!'); }}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 text-gray-500 text-xs font-medium hover:text-gray-700 transition-colors"
              >
                <Share2 size={13} />
                Copy link to share
              </button>
            </motion.div>
          </div>

        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={allImages} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <InquiryModal
        property={property}
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultType={inquiryType}
      />
    </div>
  );
}