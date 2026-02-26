"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface RoleOption {
  name: string;
  _id: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
  });

  const loadUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (res.ok) setUsers(data.data || []);
  };

  const loadRoles = async () => {
    const res = await fetch("/api/roles");
    const data = await res.json();
    if (res.ok) setRoles(data.data || []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
    loadRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      alert("Failed to create user");
      return;
    }
    setForm({ name: "", email: "", password: "", role: "manager" });
    loadUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) loadUsers();
  };

  return (
    <div>
      <h1 className="title">User & Admin Management</h1>
      <div className="columns">
        <div className="column is-5">
          <div className="card">
            <div className="card-content">
              <h3 className="subtitle">Create User</h3>
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
                  <label className="label">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value.toLowerCase() })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <input
                    className="input"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Role</label>
                  <div className="select is-fullwidth">
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="admin">Admin (full access)</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                      {roles
                        .filter((r) => !["admin", "manager", "viewer"].includes(r.name))
                        .map((r) => (
                          <option key={r._id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <button
                  className={`button is-primary ${loading ? "is-loading" : ""}`}
                  type="submit"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="column is-7">
          <h3 className="subtitle">All Users</h3>
          {users.length === 0 ? (
            <p className="has-text-grey">No users yet.</p>
          ) : (
            <div className="table-container">
              <table className="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="tag is-info is-light">{user.role}</span>
                      </td>
                      <td className="buttons">
                        <button
                          className="button is-small is-danger is-light"
                          onClick={() => deleteUser(user._id)}
                          disabled={user.role === "admin"}
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
