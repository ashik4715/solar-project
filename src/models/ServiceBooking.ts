import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AfterSaleService",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    notes: String,
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completionNotes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
  },
  { timestamps: true },
);

export default mongoose.models.ServiceBooking ||
  mongoose.model("ServiceBooking", serviceBookingSchema);
