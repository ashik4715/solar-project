"use client";

import React from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

export default function AfterSalesPage() {
  const services = [
    {
      name: "Installation Service",
      description:
        "Professional door-to-door solar panel installation with testing",
      icon: "🔧",
    },
    {
      name: "Maintenance & Support",
      description: "Regular maintenance and 24/7 customer support",
      icon: "🛠️",
    },
    {
      name: "Warranty Service",
      description: "25-year panel warranty and 5-year installation warranty",
      icon: "✅",
    },
    {
      name: "System Upgrade",
      description: "Upgrade or expand your existing solar system",
      icon: "📈",
    },
  ];

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
          <h1 className="title has-text-centered">After-Sales Services</h1>
          <p className="subtitle has-text-centered">
            Comprehensive support for your solar investment
          </p>

          <div className="columns is-multiline" style={{ marginTop: "40px" }}>
            {services.map((service, i) => (
              <div key={i} className="column is-6">
                <div
                  className="card"
                  style={{ cursor: "pointer", transition: "transform 0.3s" }}
                >
                  <div className="card-content">
                    <p style={{ fontSize: "48px", textAlign: "center" }}>
                      {service.icon}
                    </p>
                    <p className="title is-5">{service.name}</p>
                    <p className="content">{service.description}</p>
                    <Link href="/quotes">
                      <button
                        className="button is-success"
                        style={{ backgroundColor: "#4CAF50" }}
                      >
                        Book Service
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: "#fff" }}>
        <div className="container">
          <h2 className="title has-text-centered">
            Why Choose Our After-Sales Service?
          </h2>
          <div className="columns">
            <div className="column is-6">
              <div className="content">
                <h3>✓ Expert Technicians</h3>
                <p>
                  Our team of certified solar technicians ensures optimal system
                  performance
                </p>
              </div>
            </div>
            <div className="column is-6">
              <div className="content">
                <h3>✓ Quick Response</h3>
                <p>24-hour response time for urgent service requests</p>
              </div>
            </div>
            <div className="column is-6">
              <div className="content">
                <h3>✓ Transparent Pricing</h3>
                <p>
                  No hidden charges. All services come with detailed quotation
                </p>
              </div>
            </div>
            <div className="column is-6">
              <div className="content">
                <h3>✓ Warranty Coverage</h3>
                <p>All repairs covered under warranty period</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
