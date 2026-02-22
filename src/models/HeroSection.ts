import mongoose from "mongoose";

const heroSectionSchema = new mongoose.Schema(
  {
    pageLocation: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    videoUrl: String,
    backgroundColor: String,
    ctaText: String,
    ctaLink: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.HeroSection ||
  mongoose.model("HeroSection", heroSectionSchema);
