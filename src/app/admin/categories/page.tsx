"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Category created successfully!");
        setFormData({ name: "", slug: "", description: "" });
        setShowForm(false);
        fetchCategories();
      }
    } catch (error) {
      alert("Error creating category");
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
        <button
          className="button is-success"
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: "#4CAF50" }}
        >
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

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
                      setFormData({ ...formData, name: e.target.value })
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
                      setFormData({ ...formData, slug: e.target.value })
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
                Create Category
              </button>
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
                    <p className="subtitle is-6" style={{ color: "#999" }}>
                      {cat.slug}
                    </p>
                    <p className="content">{cat.description}</p>
                    <div>
                      <button className="button is-info is-small">Edit</button>
                      <button className="button is-danger is-small">
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
