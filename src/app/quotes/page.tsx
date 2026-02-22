"use client";

import React, { useState } from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

export default function QuotesPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    systemSize: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit quote request
    alert("Quote request submitted! We will contact you soon.");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <nav className="navbar" style={{ backgroundColor: "#2d5016" }}>
        <div className="navbar-brand">
          <Link
            href="/"
            className="navbar-item"
            style={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}
          >
            ☀️ Solar Store
          </Link>
        </div>
      </nav>

      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-6">
              <div className="card">
                <div className="card-header">
                  <p className="card-header-title">Free Solar Quote</p>
                </div>
                <div className="card-content">
                  <form onSubmit={handleSubmit}>
                    <div className="field">
                      <label className="label">Full Name</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Email</label>
                      <div className="control">
                        <input
                          className="input"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Phone</label>
                      <div className="control">
                        <input
                          className="input"
                          type="tel"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">System Size (kW)</label>
                      <div className="control">
                        <select
                          className="input"
                          value={formData.systemSize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              systemSize: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select system size</option>
                          <option value="6.6">6.6 kW</option>
                          <option value="10">10 kW</option>
                          <option value="13.3">13.3 kW</option>
                          <option value="20">20 kW</option>
                        </select>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Address</label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          placeholder="Your address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <button
                      className="button is-success is-fullwidth"
                      style={{ backgroundColor: "#4CAF50" }}
                    >
                      Get Free Quote
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
