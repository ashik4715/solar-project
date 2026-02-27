import mongoose from "mongoose";

const quoteItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    description: {
      type: String,
      default: "Custom quote item",
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const quoteSchema = new mongoose.Schema(
  {
    quoteNumber: {
      type: String,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [quoteItemSchema],
    subtotal: Number,
    tax: Number,
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: String,
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "accepted", "rejected", "expired"],
      default: "draft",
    },
    validUntil: Date,
    sentAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true },
);

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
