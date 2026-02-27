import mongoose from "mongoose";

const permissionsSchema = new mongoose.Schema(
  {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false },
);

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: String,
    permissions: {
      products: permissionsSchema,
      categories: permissionsSchema,
      customers: permissionsSchema,
      orders: permissionsSchema,
      faqs: permissionsSchema,
    settings: permissionsSchema,
    carousel: permissionsSchema,
    quotes: permissionsSchema,
    seo: permissionsSchema,
    roles: permissionsSchema,
    users: permissionsSchema,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Role || mongoose.model("Role", roleSchema);
