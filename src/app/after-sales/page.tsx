"use client";

import React from "react";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
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
                    <Link href="/?openQuote=1">
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
          <div className="columns is-multiline" style={{ marginTop: "20px" }}>
            {[
              {
                title: "Expert Technicians",
                desc: "Certified solar technicians keep your system at peak output.",
              },
              {
                title: "Quick Response",
                desc: "24-hour response SLA for urgent tickets.",
              },
              {
                title: "Transparent Pricing",
                desc: "Upfront quotes with zero hidden charges.",
              },
              {
                title: "Warranty Coverage",
                desc: "Repairs covered within warranty window, hassle-free claims.",
              },
            ].map((card) => (
              <div className="column is-6" key={card.title}>
                <div className="box">
                  <h3 className="title is-5">✓ {card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AppFooter isDarkMode={false} />
    </div>
  );
}
