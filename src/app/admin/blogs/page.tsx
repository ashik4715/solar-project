"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import "bulma/css/bulma.css";

interface Blog {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  isPublished: boolean;
  media: { url: string; type: "image" | "video" }[];
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Blog>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "general",
    isPublished: false,
    media: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tinymceKey, setTinymceKey] = useState<string>("no-api-key");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.data?.tinymceApiKey) setTinymceKey(data.data.tinymceApiKey);
      })
      .catch(() => {});
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/blogs?published=false");
    const data = await res.json();
    setPosts(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts();
  }, []);

  const savePost = async () => {
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      Swal.fire("Failed", "Could not save blog", "error");
      return;
    }
    Swal.fire("Saved", "Blog saved successfully", "success");
    setForm({
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "general",
      isPublished: false,
      media: [],
    });
    setEditingId(null);
    loadPosts();
  };

  const deletePost = async (id?: string) => {
    if (!id) return;
    const ok = await Swal.fire({
      title: "Delete blog?",
      icon: "warning",
      showCancelButton: true,
    });
    if (!ok.isConfirmed) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      Swal.fire("Deleted", "Blog removed", "success");
      loadPosts();
    }
  };

  const handleMediaUpload = async (file: File, type: "image" | "video") => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      Swal.fire("Upload failed", "Could not upload media", "error");
      return;
    }
    const data = await res.json();
    const url = data.data?.url || data.data;
    if (url) {
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, { url, type }],
      }));
    }
  };

  return (
    <div>
      <h1 className="title">Blogs</h1>
      <div className="columns">
        <div className="column is-6">
          <div className="card">
            <div className="card-content">
              <h3 className="subtitle">{editingId ? "Edit" : "Create"} Blog</h3>
              <div className="field">
                <label className="label">Title</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="label">Slug</label>
                <input
                  className="input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="label">Summary</label>
                <textarea
                  className="textarea"
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label className="label">Category</label>
                <input
                  className="input"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value || "general" })
                  }
                />
              </div>
              <div className="field">
                <label className="label">Status</label>
                <button
                  type="button"
                  className={`button is-small ${form.isPublished ? "is-success" : "is-light"}`}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))
                  }
                >
                  {form.isPublished ? "Published" : "Draft"}
                </button>
              </div>
              <div className="field">
                <label className="label">Content</label>
                <Editor
                  apiKey={tinymceKey || "no-api-key"}
                  init={{
                    height: 240,
                    menubar: false,
                    plugins: ["link", "lists", "code"],
                    toolbar:
                      "undo redo | bold italic | bullist numlist | link | code",
                  }}
                  value={form.content}
                  onEditorChange={(v) => setForm({ ...form, content: v })}
                />
              </div>
              <div className="field">
                <label className="label">Media</label>
                <div className="buttons">
                  <label className="button is-small">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleMediaUpload(e.target.files[0], "image")
                      }
                    />
                  </label>
                  <label className="button is-small">
                    Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleMediaUpload(e.target.files[0], "video")
                      }
                    />
                  </label>
                </div>
                <div className="tags">
                  {form.media.map((m, i) => (
                    <span key={i} className="tag is-light">
                      {m.type} {i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <button className="button is-primary" onClick={savePost} disabled={loading}>
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
        <div className="column is-6">
          <h3 className="subtitle">All Blogs</h3>
          {loading ? (
            <p>Loading...</p>
          ) : posts.length === 0 ? (
            <p className="has-text-grey">No posts yet.</p>
          ) : (
            <div className="table-container">
              <table className="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>
                        <span className={`tag ${p.isPublished ? "is-success" : ""}`}>
                          {p.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="buttons">
                        <button
                          className="button is-small is-info is-light"
                          onClick={() => {
                            setEditingId(p._id || null);
                            setForm({
                              title: p.title,
                              slug: p.slug,
                              summary: p.summary,
                              content: p.content,
                              category: p.category,
                              isPublished: p.isPublished,
                              media: p.media || [],
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="button is-small is-danger is-light"
                          onClick={() => deletePost(p._id)}
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
