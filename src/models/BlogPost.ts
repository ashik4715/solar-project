import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: String,
    image: String,
    excerpt: String,
    category: String,
    tags: [String],
    seoTags: {
      title: String,
      description: String,
      keywords: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", blogPostSchema);
