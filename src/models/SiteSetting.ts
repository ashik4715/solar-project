import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Solar Store" },
    logoUrl: String,
    faviconUrl: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    paypalBusinessId: String,
    stripePublicKey: String,
    stripeSecretKey: String,
    bkashMerchantId: String,
    paymentNotes: String,
    taxRate: { type: Number, default: 0 },
    shippingRate: { type: Number, default: 0 },
    notificationEmail: String,
  },
  { timestamps: true },
);

export default mongoose.models.SiteSetting ||
  mongoose.model("SiteSetting", siteSettingSchema);
