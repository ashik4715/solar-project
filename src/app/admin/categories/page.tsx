"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface Notice {
  type: "success" | "warning" | "danger";
  message: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories", { cache: "no-store" });
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      setNotice({
        type: "danger",
        message: "Unable to load categories. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, slug: slugify(formData.slug || formData.name) };
    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `/api/categories/${editingId}`
      : "/api/categories";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNotice({
          type: "success",
          message: `Category ${editingId ? "updated" : "created"} successfully.`,
        });
        setFormData({ name: "", slug: "", description: "" });
        setEditingId(null);
        setShowForm(false);
        fetchCategories();
      } else {
        const error = await response.json();
        setNotice({
          type: "danger",
          message: error.message || "Failed to save category.",
        });
      }
    } catch (_error) {
      setNotice({
        type: "danger",
        message: "Unexpected error while saving category.",
      });
    }
  };

  const handleEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
    setEditingId(cat._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotice({ type: "success", message: "Category deleted." });
        fetchCategories();
      } else {
        setNotice({ type: "danger", message: "Failed to delete category." });
      }
    } catch (_error) {
      setNotice({ type: "danger", message: "Error deleting category." });
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
        <h1 className="title">Categories ({categories.length})</h1>
        <div className="buttons">
          <button
            className="button is-success"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) setEditingId(null);
            }}
          >
            {showForm ? "Close form" : "+ Add Category"}
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
              <div className="field">
                <label className="label">Category Name</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Electronics"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: slugify(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Slug</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="electronics"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: slugify(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder="Category description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <button type="submit" className="button is-success">
                {editingId ? "Update Category" : "Create Category"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="button is-text"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", slug: "", description: "" });
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
        <p className="has-text-centered">Loading categories...</p>
      ) : (
        <div className="columns is-multiline">
          {categories.length === 0 ? (
            <div className="column is-12">
              <p className="has-text-centered has-text-grey-light">
                No categories yet. Create your first category!
              </p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="column is-4">
                <div className="card">
                  <div className="card-content">
                    <p className="title is-5">{cat.name}</p>
                    <p className="subtitle is-6" style={{ color: "#777" }}>
                      {cat.slug}
                    </p>
                    <p className="content">{cat.description}</p>
                    <div className="buttons">
                      <button
                        className="button is-info is-light is-small"
                        onClick={() => handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="button is-danger is-light is-small"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
