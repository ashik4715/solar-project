"use client";

import "bulma/css/bulma.css";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

type SeoTag = {
  _id?: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  metaImage: string;
};

const emptyTag: SeoTag = {
  path: "",
  metaTitle: "",
  metaDescription: "",
  metaImage: "",
};

export default function SEOTagsPage() {
  const [tags, setTags] = useState<SeoTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [form, setForm] = useState<SeoTag>(emptyTag);
  const [rowForm, setRowForm] = useState<SeoTag>(emptyTag);

  const loadTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo-tags");
      const data = await res.json();
      setTags(data.data || []);
    } catch {
      Swal.fire("Error", "Failed to load SEO tags", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const saveTag = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/seo-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        Swal.fire("Failed", "Could not save SEO tag", "error");
        return;
      }

      setForm(emptyTag);
      Swal.fire("Saved", "SEO tag saved", "success");
      await loadTags();
    } finally {
      setSaving(false);
    }
  };

  const startRowEdit = (tag: SeoTag) => {
    setActiveRowId(tag._id || null);
    setRowForm({
      path: tag.path || "",
      metaTitle: tag.metaTitle || "",
      metaDescription: tag.metaDescription || "",
      metaImage: tag.metaImage || "",
    });
  };

  const cancelRowEdit = () => {
    setActiveRowId(null);
    setRowForm(emptyTag);
  };

  const saveRowEdit = async () => {
    if (!activeRowId) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/seo-tags/${activeRowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rowForm),
      });

      if (!res.ok) {
        Swal.fire("Failed", "Could not update this SEO tag", "error");
        return;
      }

      Swal.fire("Updated", "SEO tag updated", "success");
      cancelRowEdit();
      await loadTags();
    } finally {
      setSaving(false);
    }
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

    if (activeRowId === id) {
      cancelRowEdit();
    }

    await loadTags();
  };

  const activeCountLabel = useMemo(
    () => `${tags.length} ${tags.length === 1 ? "entry" : "entries"} total`,
    [tags.length],
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7faf6" }}>
      <section
        className="hero is-medium"
        style={{
          background:
            "linear-gradient(120deg, #1f3511 0%, #2d5016 45%, #3a6c1f 100%)",
          color: "#fff",
        }}
      >
        <div className="hero-body">
          <div className="container" style={{ maxWidth: "1080px" }}>
            <p className="tag is-light is-medium" style={{ marginBottom: 10 }}>
              Admin SEO Control
            </p>
            <h1 className="title" style={{ color: "#fff", fontSize: "44px" }}>
              Manage route metadata from one screen
            </h1>
            <p className="subtitle" style={{ color: "#e8f5e9", maxWidth: 720 }}>
              Add SEO rules per route and edit each path row directly for title,
              description, and social image.
            </p>
            <div className="buttons">
              <Link href="/admin/seo" className="button is-light">
                Back to SEO Home
              </Link>
              <span className="tag is-success is-light">{activeCountLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container" style={{ maxWidth: "1120px" }}>
          <div className="columns">
            <div className="column is-12">
              <div
                className="card"
                style={{ border: "1px solid #e0eadc", borderRadius: "12px" }}
              >
                <div className="card-content">
                  <div className="level" style={{ marginBottom: 14 }}>
                    <div className="level-left">
                      <h3 className="title is-5" style={{ color: "#2d5016" }}>
                        SEO entries
                      </h3>
                    </div>
                    <div className="level-right">
                      <span className="tag is-success is-light">
                        Click path to edit
                      </span>
                    </div>
                  </div>

                  {loading ? (
                    <p className="has-text-grey">Loading...</p>
                  ) : tags.length === 0 ? (
                    <p className="has-text-grey">No SEO entries yet.</p>
                  ) : (
                    <div className="table-container">
                      <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                          <tr>
                            <th>Path</th>
                            <th>Meta title</th>
                            <th>Meta description</th>
                            <th>Meta image</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {tags.map((tag) => {
                            const isEditing = activeRowId === tag._id;

                            return (
                              <tr key={tag._id || tag.path}>
                                <td style={{ minWidth: "140px" }}>
                                  {isEditing ? (
                                    <input
                                      className="input is-small"
                                      value={rowForm.path}
                                      onChange={(e) =>
                                        setRowForm({
                                          ...rowForm,
                                          path: e.target.value,
                                        })
                                      }
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      className="button is-text"
                                      onClick={() => startRowEdit(tag)}
                                      style={{ padding: 0, color: "#2d5016" }}
                                    >
                                      {tag.path}
                                    </button>
                                  )}
                                </td>
                                <td>
                                  {isEditing ? (
                                    <input
                                      className="input is-small"
                                      value={rowForm.metaTitle}
                                      onChange={(e) =>
                                        setRowForm({
                                          ...rowForm,
                                          metaTitle: e.target.value,
                                        })
                                      }
                                    />
                                  ) : (
                                    tag.metaTitle || (
                                      <span className="has-text-grey-light">-</span>
                                    )
                                  )}
                                </td>
                                <td style={{ minWidth: "220px" }}>
                                  {isEditing ? (
                                    <textarea
                                      className="textarea is-small"
                                      rows={2}
                                      value={rowForm.metaDescription}
                                      onChange={(e) =>
                                        setRowForm({
                                          ...rowForm,
                                          metaDescription: e.target.value,
                                        })
                                      }
                                    />
                                  ) : (
                                    <span className="has-text-grey is-size-7">
                                      {tag.metaDescription
                                        ? `${tag.metaDescription.slice(0, 90)}${tag.metaDescription.length > 90 ? "..." : ""}`
                                        : "-"}
                                    </span>
                                  )}
                                </td>
                                <td style={{ minWidth: "170px" }}>
                                  {isEditing ? (
                                    <input
                                      className="input is-small"
                                      value={rowForm.metaImage}
                                      onChange={(e) =>
                                        setRowForm({
                                          ...rowForm,
                                          metaImage: e.target.value,
                                        })
                                      }
                                    />
                                  ) : tag.metaImage ? (
                                    <a
                                      href={tag.metaImage}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="is-size-7"
                                    >
                                      View image
                                    </a>
                                  ) : (
                                    <span className="has-text-grey-light">-</span>
                                  )}
                                </td>
                                <td>
                                  <div className="buttons are-small">
                                    {isEditing ? (
                                      <>
                                        <button
                                          className={`button is-success is-light ${saving ? "is-loading" : ""}`}
                                          type="button"
                                          onClick={saveRowEdit}
                                          disabled={saving}
                                        >
                                          Save
                                        </button>
                                        <button
                                          className="button is-light"
                                          type="button"
                                          onClick={cancelRowEdit}
                                          disabled={saving}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          className="button is-info is-light"
                                          type="button"
                                          onClick={() => startRowEdit(tag)}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="button is-danger is-light"
                                          type="button"
                                          onClick={() => handleDelete(tag._id)}
                                        >
                                          Delete
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>           
          </div>
          <div className="columns">
            
            <div className="column is-12">
              <div
                className="card"
                style={{ border: "1px solid #e0eadc", borderRadius: "12px" }}
              >
                <div className="card-content">
                  <h3 className="title is-5" style={{ color: "#2d5016" }}>
                    Create SEO entry
                  </h3>
                  <p className="subtitle is-6">
                    Add metadata for a route like <code>/blogs</code> or{" "}
                    <code>/blogs/my-post</code>.
                  </p>
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
                    </div>
                    <div className="field">
                      <label className="label">Meta title</label>
                      <input
                        className="input"
                        value={form.metaTitle}
                        onChange={(e) =>
                          setForm({ ...form, metaTitle: e.target.value })
                        }
                        placeholder="Solar Store blog updates"
                      />
                    </div>
                    <div className="field">
                      <label className="label">Meta description</label>
                      <textarea
                        className="textarea"
                        rows={4}
                        value={form.metaDescription}
                        onChange={(e) =>
                          setForm({ ...form, metaDescription: e.target.value })
                        }
                        placeholder="Fresh solar articles and product updates."
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
                        placeholder="https://example.com/og-cover.jpg"
                      />
                    </div>
                    <button
                      className={`button is-success is-fullwidth ${saving ? "is-loading" : ""}`}
                      type="submit"
                      disabled={saving}
                    >
                      Save entry
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
