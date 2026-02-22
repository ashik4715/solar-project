import mongoose from "mongoose";

const seoTagSchema = new mongoose.Schema(
  {
    pageUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    pageType: {
      type: String,
      enum: [
        "home",
        "product",
        "category",
        "quote",
        "about",
        "blog",
        "contact",
      ],
      required: true,
    },
    title: String,
    description: String,
    keywords: String,
    ogImage: String,
    ogTitle: String,
    ogDescription: String,
    canonicalUrl: String,
  },
  { timestamps: true },
);

export default mongoose.models.SEOTag || mongoose.model("SEOTag", seoTagSchema);
