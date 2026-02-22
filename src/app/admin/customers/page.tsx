"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  createdAt: string;
}

interface Notice {
  type: "success" | "warning" | "danger";
  message: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    segment: "residential",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customers", { cache: "no-store" });
      const data = await response.json();
      setCustomers(data.data?.customers || []);
    } catch (_error) {
      setNotice({
        type: "danger",
        message: "Unable to load customers.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/customers/${editingId}` : "/api/customers";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setNotice({
          type: "success",
          message: editingId ? "Customer updated." : "Customer added.",
        });
        setFormData({ name: "", email: "", phone: "", segment: "residential" });
        setEditingId(null);
        setShowForm(false);
        fetchCustomers();
      } else {
        setNotice({
          type: "danger",
          message: data.message || "Save failed.",
        });
      }
    } catch (_error) {
      setNotice({ type: "danger", message: "Unexpected error." });
    }
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      segment: customer.segment,
    });
    setEditingId(customer._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotice({ type: "success", message: "Customer deleted." });
        fetchCustomers();
      } else {
        setNotice({ type: "danger", message: "Failed to delete customer." });
      }
    } catch (_error) {
      setNotice({ type: "danger", message: "Error deleting customer." });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="title">Customers ({customers.length})</h1>
        <div className="buttons">
          <button
            className="button is-success"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) setEditingId(null);
            }}
          >
            {showForm ? "Close form" : "+ Add Customer"}
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`notification is-${notice.type}`}
          style={{ marginBottom: "16px" }}
        >
          <button className="delete" onClick={() => setNotice(null)} />
          {notice.message}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-content">
            <form onSubmit={handleSubmit}>
              <div className="columns is-multiline">
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                      <input
                        className="input"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        className="input"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Phone</label>
                    <div className="control">
                      <input
                        className="input"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Segment</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={formData.segment}
                          onChange={(e) =>
                            setFormData({ ...formData, segment: e.target.value })
                          }
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="industrial">Industrial</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="button is-success">
                {editingId ? "Update Customer" : "Create Customer"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="button is-text"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      segment: "residential",
                    });
                  }}
                >
                  Cancel edit
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="has-text-centered">Loading customers...</p>
      ) : (
        <div className="table-container">
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Segment</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="has-text-centered has-text-grey-light"
                  >
                    No customers yet
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <span className="tag is-info">{customer.segment}</span>
                    </td>
                    <td>
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="buttons">
                      <button
                        className="button is-info is-light is-small"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className="button is-danger is-light is-small"
                        onClick={() => handleDelete(customer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
