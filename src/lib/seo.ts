import { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import SeoTag from "@/models/SEOTag";

export async function fetchSeoForPath(path: string): Promise<Metadata | null> {
  try {
    await connectDB();
    const tag = (await SeoTag.findOne({ path }).lean()) as any;
    if (!tag) return null;

    // Keep a fallback for typoed records where metaTitile was used.
    const title = (tag.metaTitle || tag.metaTitile || "").trim() || undefined;
    const description = (tag.metaDescription || "").trim() || undefined;
    const image = (tag.metaImage || "").trim() || undefined;

    const meta: Metadata = {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_US",
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
    return meta;
  } catch {
    return null;
  }
}
