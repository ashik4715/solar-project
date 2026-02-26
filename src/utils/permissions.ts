import { connectDB } from "@/lib/mongodb";
import Role from "@/models/Role";

export type Action = "create" | "read" | "update" | "delete";
export type Resource =
  | "products"
  | "categories"
  | "customers"
  | "orders"
  | "faqs"
  | "settings"
  | "carousel"
  | "quotes"
  | "roles"
  | "users";

const roleMatrix: Record<string, Partial<Record<Resource, Action[]>>> = {
  admin: {
    products: ["create", "read", "update", "delete"],
    categories: ["create", "read", "update", "delete"],
    customers: ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete"],
    faqs: ["create", "read", "update", "delete"],
    settings: ["create", "read", "update"],
    carousel: ["create", "read", "update", "delete"],
    quotes: ["create", "read", "update", "delete"],
    roles: ["create", "read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
  },
  manager: {
    products: ["create", "read", "update"],
    categories: ["create", "read", "update"],
    customers: ["create", "read", "update"],
    orders: ["create", "read", "update"],
    faqs: ["create", "read", "update"],
    settings: ["read", "update"],
    carousel: ["create", "read", "update"],
    quotes: ["create", "read", "update"],
    roles: ["read"],
    users: ["read", "update"],
  },
  viewer: {
    products: ["read"],
    categories: ["read"],
    customers: ["read"],
    orders: ["read"],
    faqs: ["read"],
    settings: ["read"],
    carousel: ["read"],
    quotes: ["read"],
    roles: ["read"],
    users: ["read"],
  },
};

export async function can(
  role: string | undefined,
  resource: Resource,
  action: Action,
) {
  if (!role) return false;
  if (role === "admin") return true;

  const builtIn = roleMatrix[role];
  if (builtIn && builtIn[resource]?.includes(action)) return true;

  // fallback to DB-defined roles
  try {
    await connectDB();
    const found = await Role.findOne({ name: role });
    const allowed: boolean =
      found?.permissions?.[resource]?.[action] === true ||
      found?.permissions?.[resource]?.[action] === 1;
    return !!allowed;
  } catch (e) {
    return false;
  }
}
