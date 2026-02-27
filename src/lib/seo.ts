import { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import SeoTag from "@/models/SEOTag";

export async function fetchSeoForPath(path: string): Promise<Metadata | null> {
  await connectDB();
  const tag = (await SeoTag.findOne({ path }).lean()) as any;
  if (!tag) return null;

  const meta: Metadata = {
    title: tag.metaTitle || undefined,
    description: tag.metaDescription || undefined,
    openGraph: {
      title: tag.metaTitle || undefined,
      description: tag.metaDescription || undefined,
      images: tag.metaImage ? [{ url: tag.metaImage }] : undefined,
    },
  };
  return meta;
}
