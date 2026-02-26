"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

interface CarouselItem {
  _id?: string;
  title?: string;
  subtitle?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  hasAudio: boolean;
  ctaText?: string;
  ctaHref?: string;
  order?: number;
}

export default function MediaPage() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CarouselItem>({
    title: "",
    subtitle: "",
    mediaUrl: "",
    mediaType: "image",
    hasAudio: false,
    ctaText: "",
    ctaHref: "",
    order: 0,
  });
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/carousel");
    const data = await res.json();
    setItems(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/carousel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({
        title: "",
        subtitle: "",
        mediaUrl: "",
        mediaType: "image",
        hasAudio: false,
        ctaText: "",
        ctaHref: "",
        order: 0,
      });
      fetchItems();
      alert("Slide saved");
    } else {
      alert("Failed to save slide");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this slide?")) return;
    const res = await fetch(`/api/carousel/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm((f) => ({ ...f, mediaUrl: data.data.url }));
    } else {
      alert(data.message || "Upload failed");
    }
    setUploading(false);
  };

  return (
    <div>
      <h1 className="title">Homepage Carousel</h1>
      <div className="columns">
        <div className="column is-5">
          <div className="card">
            <div className="card-content">
              <h3 className="subtitle">Add / Edit Slide</h3>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Title</label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label className="label">Subtitle</label>
                  <input
                    className="input"
                    value={form.subtitle}
                    onChange={(e) =>
                      setForm({ ...form, subtitle: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label className="label">Media URL</label>
                  <input
                    className="input"
                    value={form.mediaUrl}
                    onChange={(e) =>
                      setForm({ ...form, mediaUrl: e.target.value })
                    }
                    required
                  />
                  <div className="field" style={{ marginTop: "10px" }}>
                    <div className="file">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handleFileUpload(e.target.files?.[0])}
                          disabled={uploading}
                        />
                        <span className="file-cta">
                          <span className="file-label">
                            {uploading ? "Uploading..." : "Upload file"}
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-body">
                    <div className="field">
                      <label className="label">Type</label>
                      <div className="select is-fullwidth">
                        <select
                          value={form.mediaType}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              mediaType: e.target.value as CarouselItem["mediaType"],
                            })
                          }
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Order</label>
                      <input
                        className="input"
                        type="number"
                        value={form.order ?? 0}
                        onChange={(e) =>
                          setForm({ ...form, order: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={form.hasAudio}
                      onChange={(e) =>
                        setForm({ ...form, hasAudio: e.target.checked })
                      }
                    />{" "}
                    Has audio controls
                  </label>
                </div>
                <div className="field is-horizontal">
                  <div className="field-body">
                    <div className="field">
                      <label className="label">CTA Text</label>
                      <input
                        className="input"
                        value={form.ctaText}
                        onChange={(e) =>
                          setForm({ ...form, ctaText: e.target.value })
                        }
                      />
                    </div>
                    <div className="field">
                      <label className="label">CTA Link</label>
                      <input
                        className="input"
                        value={form.ctaHref}
                        onChange={(e) =>
                          setForm({ ...form, ctaHref: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <button className="button is-success" type="submit">
                  Save Slide
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="column is-7">
          <h3 className="subtitle">Slides</h3>
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p className="has-text-grey">No slides yet.</p>
          ) : (
            <div className="columns is-multiline">
              {items.map((item) => (
                <div key={item._id} className="column is-6">
                  <div className="card">
                    <div className="card-content">
                      <p className="title is-5">{item.title || "Slide"}</p>
                      <p className="subtitle is-6">{item.subtitle}</p>
                      <p className="tag is-info">{item.mediaType}</p>
                      <p className="tag is-light">order {item.order}</p>
                      <div style={{ marginTop: "10px" }}>
                        <button
                          className="button is-danger is-light is-small"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
