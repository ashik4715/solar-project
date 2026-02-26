import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    hasAudio: { type: Boolean, default: false },
    ctaText: String,
    ctaHref: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.CarouselItem ||
  mongoose.model("CarouselItem", carouselSchema);
