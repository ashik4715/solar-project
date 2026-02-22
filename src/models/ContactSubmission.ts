import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    phone: String,
    message: {
      type: String,
      required: true,
    },
    submissionType: {
      type: String,
      enum: [
        "inquiry",
        "support",
        "feedback",
        "quotation_request",
        "partnership",
        "other",
      ],
      default: "inquiry",
    },
    status: {
      type: String,
      enum: ["new", "viewed", "in-progress", "resolved", "spam"],
      default: "new",
      index: true,
    },
    response: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    respondedAt: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

export default mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", contactSubmissionSchema);
