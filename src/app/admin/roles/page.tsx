"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

type Action = "create" | "read" | "update" | "delete";

interface Role {
  _id?: string;
  name: string;
  description?: string;
  permissions: Record<string, Record<Action, boolean>>;
}

const MODULES: { key: string; label: string }[] = [
  { key: "categories", label: "Categories" },
  { key: "products", label: "Products" },
  { key: "faqs", label: "FAQs" },
  { key: "orders", label: "Orders" },
  { key: "customers", label: "Customers" },
  { key: "carousel", label: "Media" },
  { key: "quotes", label: "Quotes" },
  { key: "settings", label: "Settings" },
  { key: "roles", label: "Roles" },
  { key: "users", label: "Users" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Role>({
    name: "",
    description: "",
    permissions: {},
  });

  const loadRoles = async () => {
    const res = await fetch("/api/roles");
    const data = await res.json();
    setRoles(data.data || []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRoles();
  }, []);

  const togglePermission = (module: string, action: Action) => {
    setForm((prev) => {
      const current = prev.permissions[module]?.[action] ?? false;
      const base =
        prev.permissions[module] || {
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      const permissions = {
        ...prev.permissions,
        [module]: { ...base, [action]: !current },
      };
      return { ...prev, permissions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      alert("Failed to save role");
      return;
    }
    setForm({ name: "", description: "", permissions: {} });
    loadRoles();
  };

  const deleteRole = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this role?")) return;
    const res = await fetch(`/api/roles/${id}`, { method: "DELETE" });
    if (res.ok) loadRoles();
  };

  return (
    <div>
      <h1 className="title">Role Management</h1>
      <div className="columns">
        <div className="column is-6">
          <div className="card">
            <div className="card-content">
              <h3 className="subtitle">Create Role</h3>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Description</label>
                  <input
                    className="input"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div className="field">
                  <label className="label">Permissions</label>
                  <div className="table-container">
                    <table className="table is-striped is-fullwidth">
                      <thead>
                        <tr>
                          <th>Feature</th>
                          {(["create", "read", "update", "delete"] as Action[]).map(
                            (act) => (
                              <th key={act} style={{ textTransform: "capitalize" }}>
                                {act}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {MODULES.map((module) => (
                          <tr key={module.key}>
                            <td>{module.label}</td>
                            {(["create", "read", "update", "delete"] as Action[]).map(
                              (act) => (
                                <td key={act}>
                                  <input
                                    type="checkbox"
                                    checked={
                                      form.permissions[module.key]?.[act] ?? false
                                    }
                                    onChange={() => togglePermission(module.key, act)}
                                  />
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <button
                  className={`button is-success ${loading ? "is-loading" : ""}`}
                  type="submit"
                >
                  Save Role
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="column is-6">
          <h3 className="subtitle">Existing Roles</h3>
          {roles.length === 0 ? (
            <p className="has-text-grey">No roles yet.</p>
          ) : (
            <div className="table-container">
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role._id}>
                      <td>{role.name}</td>
                      <td>{role.description || "—"}</td>
                      <td className="buttons">
                        <button
                          className="button is-small is-danger is-light"
                          onClick={() => deleteRole(role._id)}
                          disabled={role.name === "admin"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
