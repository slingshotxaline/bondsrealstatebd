import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ChevronRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getProject(id) {
  try {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (!res.ok || !data.success) return null;
    return data.project;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return {
    title: `${project.title} | BONDS Real Estate Ltd.`,
    description: project.description?.slice(0, 160),
    openGraph: {
      images: project.mainImage?.url ? [project.mainImage.url] : [],
    },
  };
}

function statusStyle(status) {
  return status === "Ready"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : status === "Upcoming"
    ? "bg-blue-50 text-blue-700 border border-blue-200"
    : "bg-amber-50 text-amber-700 border border-amber-200";
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const p = await getProject(id);
  if (!p) notFound();

  const FALLBACK =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70";

  // All spec rows: fixed fields + custom fields
  const specs = [
    p.area && { label: "Area", value: `${p.area} sqft` },
    p.rooms && { label: "Bedrooms", value: p.rooms },
    p.baths && { label: "Bathrooms", value: p.baths },
    p.floors && { label: "Total Floors", value: `${p.floors} Floors` },
    p.parking && { label: "Parking", value: p.parking },
    p.year && { label: "Completion", value: p.year },
    p.location && { label: "Location", value: p.location },
    // Dynamic custom fields
    ...(p.customFields || []).map((f) => ({ label: f.key, value: f.value })),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
          {["Home", "Projects", p.title].map((b, i, arr) => (
            <span key={i} className="flex items-center gap-1.5">
              <span
                className={
                  i === arr.length - 1
                    ? "text-[#004835] font-medium truncate max-w-[200px]"
                    : "hover:text-gray-600 cursor-pointer"
                }
              >
                {i === 0 ? (
                  <Link href="/">{b}</Link>
                ) : i === 1 ? (
                  <Link href="/projects">{b}</Link>
                ) : (
                  b
                )}
              </span>
              {i < arr.length - 1 && (
                <ChevronRight size={12} className="text-gray-300" />
              )}
            </span>
          ))}
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#004835] transition-colors mb-6 group"
        >
          ← Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — images + description */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 shadow-sm">
              <img
                src={p.mainImage?.url || FALLBACK}
                alt={p.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  p.accentColor || "from-emerald-900/60 to-transparent"
                }`}
                style={{ opacity: 0.6 }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {p.tag && p.tag !== "None" && (
                  <span className="text-xs font-bold bg-[#004835] text-white px-3 py-1 rounded-full">
                    {p.tag}
                  </span>
                )}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(
                    p.status
                  )}`}
                >
                  {p.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-0.5">
                  {p.type}
                </p>
                <h1
                  className="text-2xl sm:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {p.title}
                </h1>
              </div>
            </div>

            {/* Gallery */}
            {p.gallery?.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {p.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden aspect-video"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-3">
                About This Project
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {p.description}
              </p>
            </div>
          </div>

          {/* Right — specs */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:sticky lg:top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Project Details
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <MapPin size={13} className="text-[#004835] flex-shrink-0" />
                <p className="text-sm text-gray-600">{p.location}</p>
              </div>

              <div className="space-y-0">
                {specs.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      {s.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-[#004835] hover:bg-[#003828] text-white text-sm font-bold rounded-xl transition-colors"
              >
                Enquire About This Project
              </a>
              <Link
                href="/projects"
                className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
