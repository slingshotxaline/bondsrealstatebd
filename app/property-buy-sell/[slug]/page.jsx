import { properties } from "@/app/Others/PropertyData";
import PropertyDetailPage from "@/app/PublicPages/PropertyBuySellPublic/PropertyDetailsPage";
import { notFound } from "next/navigation";


export async function generateStaticParams() {
  return properties.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;                            
  const property = properties.find(p => p.slug === slug);
  if (!property) return {};
  return {
    title: `${property.title} | Dhaka Properties`,
    description: property.description,
  };
}

export default async function Page({ params }) {            
  const { slug } = await params;                            
  const property = properties.find(p => p.slug === slug);
  if (!property) notFound();
  return <PropertyDetailPage property={property} />;
}