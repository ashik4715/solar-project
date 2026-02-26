"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isPublished?: boolean;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => setFaqs((data.data || []).filter((f: FAQ) => f.isPublished !== false)));
  }, []);

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: "900px" }}>
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li className="is-active">
              <a aria-current="page">FAQs</a>
            </li>
          </ul>
        </nav>
        <h1 className="title">Frequently Asked Questions</h1>
        {faqs.length === 0 ? (
          <p className="has-text-grey">We’re preparing FAQs. Check back soon!</p>
        ) : (
          <div className="accordion" style={{ marginTop: "20px" }}>
            {faqs.map((faq) => (
              <details key={faq._id} style={{ marginBottom: "12px" }}>
                <summary className="has-text-weight-semibold">
                  {faq.question}
                  {faq.category ? (
                    <span className="tag is-light" style={{ marginLeft: "8px" }}>
                      {faq.category}
                    </span>
                  ) : null}
                </summary>
                <p style={{ marginTop: "8px" }}>{faq.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
