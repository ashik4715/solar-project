import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    type: { type: String, enum: ["image", "video"], default: "image" },
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: String, default: "general" },
    tags: [{ type: String }],
    media: [mediaSchema],
    isPublished: { type: Boolean, default: false },
    author: { type: String, default: "Admin" },
  },
  { timestamps: true },
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
