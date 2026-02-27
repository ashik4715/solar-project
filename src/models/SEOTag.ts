import mongoose from "mongoose";

const seoTagSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, unique: true, index: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaImage: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.SeoTag || mongoose.model("SeoTag", seoTagSchema);
