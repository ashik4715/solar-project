"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "bulma/css/bulma.css";

type SeoTag = {
  _id?: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  metaImage: string;
};

export default function SEOTagsPage() {
  const [tags, setTags] = useState<SeoTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SeoTag>({
    path: "",
    metaTitle: "",
    metaDescription: "",
    metaImage: "",
  });

  const loadTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo-tags");
      const data = await res.json();
      setTags(data.data || []);
    } catch (e) {
      Swal.fire("Error", "Failed to load SEO tags", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const saveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/seo-tags/${editingId}` : "/api/seo-tags";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      Swal.fire("Failed", "Could not save SEO tag", "error");
      return;
    }
    setForm({ path: "", metaTitle: "", metaDescription: "", metaImage: "" });
    setEditingId(null);
    Swal.fire("Saved", "SEO tag saved", "success");
    loadTags();
  };

  const handleEdit = (tag: SeoTag) => {
    setForm(tag);
    setEditingId(tag._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const ok = await Swal.fire({
      title: "Delete SEO entry?",
      icon: "warning",
      showCancelButton: true,
    });
    if (!ok.isConfirmed) return;
    await fetch(`/api/seo-tags/${id}`, { method: "DELETE" });
    loadTags();
  };

  return (
    <div>
      <div className="level">
        <div className="level-left">
          <h1 className="title">🔍 SEO Meta Tags</h1>
        </div>
        <div className="level-right">
          <span className="tag is-light">
            Manage page title, description, and social image per route.
          </span>
        </div>
      </div>

      <div className="columns">
        <div className="column is-5">
          <div className="card">
            <div className="card-content">
              <h3 className="subtitle">
                {editingId ? "Edit SEO entry" : "Create SEO entry"}
              </h3>
              <form onSubmit={saveTag}>
                <div className="field">
                  <label className="label">Path</label>
                  <input
                    className="input"
                    placeholder="/blogs"
                    value={form.path}
                    onChange={(e) => setForm({ ...form, path: e.target.value })}
                    required
                  />
                  <p className="help">Use the pathname (e.g., /faqs, /quote).</p>
                </div>
                <div className="field">
                  <label className="label">Meta title</label>
                  <input
                    className="input"
                    value={form.metaTitle}
                    onChange={(e) =>
                      setForm({ ...form, metaTitle: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label className="label">Meta description</label>
                  <textarea
                    className="textarea"
                    value={form.metaDescription}
                    onChange={(e) =>
                      setForm({ ...form, metaDescription: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label className="label">Meta image URL</label>
                  <input
                    className="input"
                    value={form.metaImage}
                    onChange={(e) =>
                      setForm({ ...form, metaImage: e.target.value })
                    }
                  />
                  <p className="help">Displayed for social sharing (OpenGraph).</p>
                </div>
                <div className="buttons">
                  <button className="button is-success" type="submit">
                    {editingId ? "Update" : "Save"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="button is-light"
                      onClick={() => {
                        setEditingId(null);
                        setForm({
                          path: "",
                          metaTitle: "",
                          metaDescription: "",
                          metaImage: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="column is-7">
          <h3 className="subtitle">SEO entries</h3>
          {loading ? (
            <p className="has-text-grey">Loading...</p>
          ) : tags.length === 0 ? (
            <p className="has-text-grey">No SEO entries yet.</p>
          ) : (
            <div className="table-container">
              <table className="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Path</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag._id}>
                      <td>{tag.path}</td>
                      <td>{tag.metaTitle}</td>
                      <td>
                        <span className="has-text-grey is-size-7">
                          {tag.metaDescription?.slice(0, 80)}
                        </span>
                      </td>
                      <td className="buttons">
                        <button
                          className="button is-small is-info is-light"
                          onClick={() => handleEdit(tag)}
                        >
                          Edit
                        </button>
                        <button
                          className="button is-small is-danger is-light"
                          onClick={() => handleDelete(tag._id)}
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
