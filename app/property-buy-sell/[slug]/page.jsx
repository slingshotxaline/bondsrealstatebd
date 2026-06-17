import PropertyDetailPage from "@/app/PublicPages/PropertyBuySellPublic/PropertyDetailsPage";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getPropertyBySlug(slug) {
  try {
    // Try slug first
    const res  = await fetch(`${BASE_URL}/properties/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (res.ok && data.success) return data.property;

    // Fallback: if it looks like a MongoDB ID, try by ID
    // (handles old shared links that used _id)
    if (/^[a-f\d]{24}$/i.test(slug)) {
      const res2  = await fetch(`${BASE_URL}/properties/${slug}`, {
        next: { revalidate: 60 },
      });
      const data2 = await res2.json();
      if (res2.ok && data2.success) return data2.property;
    }

    return null;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return {
    title:       `${property.title} | BONDS Real Estate Ltd.`,
    description: property.description?.slice(0, 160),
    openGraph: {
      title:       property.title,
      description: property.description?.slice(0, 160),
      images:      property.thumbnail?.url ? [property.thumbnail.url] : [],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  return <PropertyDetailPage property={property} />;
}