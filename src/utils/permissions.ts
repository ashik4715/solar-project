type Action = "create" | "read" | "update" | "delete";
type Resource =
  | "products"
  | "categories"
  | "customers"
  | "orders"
  | "faqs"
  | "settings"
  | "carousel";

const roleMatrix: Record<string, Partial<Record<Resource, Action[]>>> = {
  admin: {
    products: ["create", "read", "update", "delete"],
    categories: ["create", "read", "update", "delete"],
    customers: ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete"],
    faqs: ["create", "read", "update", "delete"],
    settings: ["create", "read", "update"],
    carousel: ["create", "read", "update", "delete"],
  },
  manager: {
    products: ["create", "read", "update"],
    categories: ["create", "read", "update"],
    customers: ["create", "read", "update"],
    orders: ["create", "read", "update"],
    faqs: ["create", "read", "update"],
    settings: ["read", "update"],
    carousel: ["create", "read", "update"],
  },
  viewer: {
    products: ["read"],
    categories: ["read"],
    customers: ["read"],
    orders: ["read"],
    faqs: ["read"],
    settings: ["read"],
    carousel: ["read"],
  },
};

export function can(role: string, resource: Resource, action: Action) {
  const allowed = roleMatrix[role] || roleMatrix.viewer;
  return allowed[resource]?.includes(action) ?? false;
}
