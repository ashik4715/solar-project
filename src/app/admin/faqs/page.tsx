"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  isPublished?: boolean;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );
  const [form, setForm] = useState<FAQ>({
    question: "",
    answer: "",
    category: "",
    isPublished: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchFaqs = async () => {
    const res = await fetch("/api/faqs");
    const data = await res.json();
    setFaqs(data.data || []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFaqs();
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      alert("Save failed");
      return;
    }
    setForm({ question: "", answer: "", category: "", isPublished: true });
    setEditingId(null);
    fetchFaqs();
  };

  const handleEdit = (faq: FAQ) => {
    setForm(faq);
    setEditingId(faq._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete FAQ?")) return;
    await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    fetchFaqs();
  };

  return (
    <div>
      <h1 className="title">FAQ Management</h1>
      <div className="columns">
        <div className="column is-5">
          <div className="card">
            <div className="card-content">
              <h3 className="subtitle">
                {editingId ? "Edit FAQ" : "Create FAQ"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Question</label>
                  <input
                    className="input"
                    value={form.question}
                    onChange={(e) =>
                      setForm({ ...form, question: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Answer</label>
                  <textarea
                    className="textarea"
                    value={form.answer}
                    onChange={(e) =>
                      setForm({ ...form, answer: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Category</label>
                  <div className="control has-icons-right">
                    <input
                      list="faq-categories"
                      className="input"
                      value={form.category || ""}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value || "general" })
                      }
                      placeholder="Type to add or pick (default: general)"
                    />
                    <datalist id="faq-categories">
                      <option value="general" />
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="field">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) =>
                        setForm({ ...form, isPublished: e.target.checked })
                      }
                    />{" "}
                    Published
                  </label>
                </div>
                <button className="button is-success" type="submit">
                  {editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                  <button
                    className="button is-text"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        question: "",
                        answer: "",
                        category: "",
                        isPublished: true,
                      });
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="column is-7">
          <h3 className="subtitle">FAQs</h3>
          {faqs.length === 0 ? (
            <p className="has-text-grey">No FAQs yet.</p>
          ) : (
            <div className="table-container">
              <table className="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq) => (
                    <tr key={faq._id}>
                      <td>{faq.question}</td>
                      <td>{faq.category || "General"}</td>
                      <td>
                        <span
                          className={`tag ${
                            faq.isPublished ? "is-success" : "is-light"
                          }`}
                        >
                          {faq.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="buttons">
                        <button
                          className="button is-small is-info is-light"
                          onClick={() => handleEdit(faq)}
                        >
                          Edit
                        </button>
                        <button
                          className="button is-small is-danger is-light"
                          onClick={() => handleDelete(faq._id)}
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
