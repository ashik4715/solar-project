"use client";

import { useMemo, useState } from "react";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

const tagBase =
  "tag is-light is-medium has-text-weight-semibold is-clickable is-uppercase";

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const normalized = useMemo(
    () =>
      faqs.map((f) => ({
        ...f,
        category: f.category?.toLowerCase() || "general",
      })),
    [faqs],
  );

  const categories = useMemo(
    () => ["all", ...new Set(normalized.map((f) => f.category || "general"))],
    [normalized],
  );

  const filtered = normalized.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="box" style={{ borderRadius: "14px" }}>
      <div className="field has-addons" style={{ marginBottom: "16px" }}>
        <p className="control is-expanded">
          <input
            className="input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords (install, warranty, billing...)"
          />
        </p>
        <p className="control">
          <button
            className="button is-light"
            onClick={() => {
              setQuery("");
              setActiveCategory("all");
            }}
          >
            Reset
          </button>
        </p>
      </div>

      <div
        className="tags are-medium"
        style={{ gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}
      >
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              className={`${tagBase} ${isActive ? "is-success" : ""}`}
              style={{
                borderRadius: "20px",
                border: "1px solid #dce7d4",
                background: isActive ? "#e8f5e9" : "#fff",
                color: isActive ? "#1b4d16" : "#4b5b46",
              }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "all" ? "All" : cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="has-text-grey">
          No answers match that filter. Try another keyword or category.
        </p>
      ) : (
        <div className="accordion" style={{ marginTop: "12px" }}>
          {filtered.map((faq, idx) => (
            <details
              key={faq.id}
              open={idx === 0}
              style={{
                marginBottom: "10px",
                borderRadius: "10px",
                border: "1px solid #e0eadc",
                background: "#f7fbf6",
                padding: "14px 16px",
              }}
            >
              <summary
                className="has-text-weight-semibold"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  className="tag is-success is-light"
                  style={{ textTransform: "capitalize" }}
                >
                  {faq.category}
                </span>
                {faq.question}
              </summary>
              <p style={{ marginTop: "10px", lineHeight: 1.6 }}>{faq.answer}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
