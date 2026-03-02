import { CATEGORIES } from "@/data/categories";
import { PlayContent } from "./PlayContent";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categorySlug: c.slug }));
}

interface PlayPageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { categorySlug } = await params;
  return <PlayContent categorySlug={categorySlug} />;
}
