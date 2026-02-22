import mongoose from "mongoose";

const afterSaleServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    image: String,
    icon: String,
    serviceType: {
      type: String,
      enum: [
        "installation",
        "maintenance",
        "warranty",
        "repair",
        "support",
        "consultation",
      ],
      required: true,
    },
    pricing: {
      baseCost: Number,
      currency: {
        type: String,
        default: "INR",
      },
      description: String,
    },
    availability: {
      dayOfWeek: [Number], // 0-6 for days
      startTime: String,
      endTime: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.AfterSaleService ||
  mongoose.model("AfterSaleService", afterSaleServiceSchema);
