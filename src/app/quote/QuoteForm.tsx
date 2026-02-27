"use client";

import React, { useState } from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

type QuoteFormState = {
  name: string;
  email: string;
  phone: string;
  systemSize: string;
  message: string;
};

export function QuoteForm() {
  const [form, setForm] = useState<QuoteFormState>({
    name: "",
    email: "",
    phone: "",
    systemSize: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        systemSize: form.systemSize,
        address: form.message,
        items: [],
      }),
    }).catch(() => {});
    setLoading(false);
    setSent(true);
    setForm({ name: "", email: "", phone: "", systemSize: "", message: "" });
  };

  return (
    <div className="section" style={{ paddingTop: "40px" }}>
      <div className="container" style={{ maxWidth: "720px" }}>
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li className="is-active">
              <a aria-current="page">Quote</a>
            </li>
          </ul>
        </nav>

        {sent ? (
          <div className="notification is-success">
            🎉 Thanks! Your request is in. A specialist will reach out within one
            business day.
          </div>
        ) : null}

        <div className="box" style={{ border: "1px solid #e0eadc" }}>
          <form onSubmit={submit}>
            <div className="columns is-multiline">
              <div className="column is-6">
                <label className="label">Full name</label>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="column is-6">
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div className="column is-6">
                <label className="label">Phone</label>
                <input
                  className="input"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <div className="column is-6">
                <label className="label">Desired system size (kW)</label>
                <input
                  className="input"
                  placeholder="e.g., 5 kW"
                  value={form.systemSize}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, systemSize: e.target.value }))
                  }
                />
              </div>
              <div className="column is-12">
                <label className="label">Project details / address</label>
                <textarea
                  className="textarea"
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Roof type, address, timeline, or any extra notes"
                  rows={4}
                />
              </div>
            </div>
            <div className="buttons">
              <button
                className={`button is-success ${loading ? "is-loading" : ""}`}
                type="submit"
              >
                Submit quote request
              </button>
              <Link href="/" className="button is-light">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
