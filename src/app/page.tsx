"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import "bulma/css/bulma.css";
import "./globals.css";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Visitor", email, phone, message }),
      });

      if (response.ok) {
        alert("Thank you for your inquiry! We will contact you soon.");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch (error) {
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDarkMode ? "#0f0f0f" : "#ffffff";
  const textColor = isDarkMode ? "#e0e0e0" : "#333";
  const cardBg = isDarkMode ? "#2d2d2d" : "#f9f9f9";
  const sectionBg = isDarkMode ? "#1a1a1a" : "#f5f5f5";
  const borderColor = isDarkMode ? "#444" : "#e0e0e0";

  return (
    <div style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Navigation */}
      <nav
        className="navbar has-shadow"
        style={{
          backgroundColor: "#2d5016",
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="navbar-brand">
          <Link
            href="/"
            className="navbar-item"
            style={{ fontWeight: "bold", fontSize: "24px", color: "#fff" }}
          >
            ☀️ Solar Store
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end" style={{ alignItems: "center" }}>
            <div className="navbar-item">
              <Link
                href="/"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  marginRight: "15px",
                }}
              >
                🏠 Home
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/products"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  marginRight: "15px",
                }}
              >
                📦 Products
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/quotes"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  marginRight: "15px",
                }}
              >
                💬 Quotes
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/after-sales"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  marginRight: "15px",
                }}
              >
                🔧 Support
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/login"
                style={{
                  color: "#e8f5e9",
                  textDecoration: "none",
                  marginRight: "15px",
                  fontWeight: "bold",
                }}
              >
                👤 Login
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/register"
                className="button is-light has-text-weight-semibold"
                style={{
                  backgroundColor: "#e8f5e9",
                  color: isDarkMode ? "#183013" : "#2d5016",
                  marginRight: "15px",
                  fontWeight: "bold",
                }}
              >
                ✍️ Register
              </Link>
            </div>
            <div className="navbar-item">
              <button
                className="button is-small"
                onClick={toggleTheme}
                style={{
                  backgroundColor: isDarkMode ? "#444" : "#ddd",
                  color: textColor,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
            <div className="navbar-item">
              <Link
                href="/admin/login"
                className="button is-outlined is-light"
                style={{
                  borderColor: "#e8f5e9",
                  color: "#e8f5e9",
                  marginLeft: "10px",
                }}
              >
                🔐 Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero is-large"
        style={{
          backgroundImage: isDarkMode
            ? "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))"
            : "linear-gradient(rgba(45,80,22,0.3), rgba(45,80,22,0.3))",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#2d5016",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="hero-body" style={{ textAlign: "center" }}>
          <div className="container">
            <h1
              className="title"
              style={{
                color: "#fff",
                fontSize: "56px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              🌞 Premium Residential Solar Solutions
            </h1>
            <p
              className="subtitle"
              style={{
                color: "#e8f5e9",
                fontSize: "20px",
                marginBottom: "30px",
              }}
            >
              Go Green, Save Green - Easy, Efficient, and Affordable Solar
              Energy for Your Home
            </p>
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/products">
                <button
                  className="button is-large"
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  🛍️ Shop Now
                </button>
              </Link>
              <Link href="/quotes">
                <button
                  className="button is-large is-outlined"
                  style={{
                    borderColor: "#fff",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  📋 Get Free Quote
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section" style={{ backgroundColor: sectionBg }}>
        <div className="container">
          <h2
            className="title has-text-centered"
            style={{ color: textColor, fontSize: "40px", marginBottom: "40px" }}
          >
            ✨ What We Offer
          </h2>
          <div className="columns is-multiline">
            {[
              {
                icon: "📊",
                title: "Solar Panels",
                desc: "High-efficiency monocrystalline panels",
              },
              {
                icon: "⚡",
                title: "Inverters",
                desc: "Smart power conversion systems",
              },
              {
                icon: "🔋",
                title: "Batteries",
                desc: "Energy storage solutions",
              },
              {
                icon: "🔧",
                title: "Installation",
                desc: "Professional installation service",
              },
              {
                icon: "🛠️",
                title: "Maintenance",
                desc: "Regular system maintenance",
              },
              {
                icon: "🛡️",
                title: "Warranty",
                desc: "Extended warranty support",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="column is-4-desktop is-6-tablet is-12-mobile"
              >
                <div
                  className="card"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    textAlign: "center",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(45,80,22,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="card-content">
                    <p style={{ fontSize: "48px", marginBottom: "15px" }}>
                      {item.icon}
                    </p>
                    <p
                      className="title is-5"
                      style={{ color: "#2d5016", marginBottom: "10px" }}
                    >
                      {item.title}
                    </p>
                    <p style={{ color: isDarkMode ? "#aaa" : "#666" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ backgroundColor: bgColor }}>
        <div className="container">
          <h2
            className="title has-text-centered"
            style={{ color: textColor, fontSize: "40px", marginBottom: "40px" }}
          >
            💡 Why Choose Solar Store?
          </h2>
          <div className="columns is-multiline">
            {[
              {
                icon: "✓",
                title: "Authentic Brands",
                desc: "We work only with certified manufacturers",
              },
              {
                icon: "✓",
                title: "Best Value",
                desc: "Transparent pricing with no hidden costs",
              },
              {
                icon: "✓",
                title: "Expert Support",
                desc: "Dedicated 24/7 customer support",
              },
              {
                icon: "✓",
                title: "Professional Installation",
                desc: "Expert installation and testing",
              },
              {
                icon: "✓",
                title: "25-Year Warranty",
                desc: "Industry-leading warranty coverage",
              },
              {
                icon: "✓",
                title: "After Sales Service",
                desc: "Comprehensive maintenance programs",
              },
            ].map((item, i) => (
              <div key={i} className="column is-6">
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: cardBg,
                    borderRadius: "8px",
                    border: `1px solid ${borderColor}`,
                    display: "flex",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      color: "#2d5016",
                      fontWeight: "bold",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        color: "#2d5016",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p style={{ color: isDarkMode ? "#aaa" : "#666" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Best Range */}
      <section className="section" style={{ backgroundColor: sectionBg }}>
        <div className="container">
          <h2
            className="title has-text-centered"
            style={{ color: textColor, fontSize: "40px", marginBottom: "40px" }}
          >
            📦 Our Best Solar Packages
          </h2>
          <div className="columns is-multiline">
            {[
              {
                power: "3kW",
                price: "₹198,000",
                items: ["8 x 400W Panels", "3kW Inverter", "Installation"],
              },
              {
                power: "5kW",
                price: "₹385,000",
                items: ["13 x 400W Panels", "5kW Inverter", "Installation"],
              },
              {
                power: "10kW",
                price: "₹850,000",
                items: ["20 x 550W Panels", "10kW Inverter", "10kWh Battery"],
              },
              {
                power: "Custom",
                price: "Contact Us",
                items: ["Custom Size", "Expert Planning", "Free Consultation"],
              },
            ].map((pkg, i) => (
              <div
                key={i}
                className="column is-3-desktop is-6-tablet is-12-mobile"
              >
                <div
                  className="card"
                  style={{
                    backgroundColor: cardBg,
                    border:
                      i === 2
                        ? `3px solid #4CAF50`
                        : `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    textAlign: "center",
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(45,80,22,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {i === 2 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      ⭐ POPULAR
                    </div>
                  )}
                  <div className="card-content">
                    <p
                      className="title is-4"
                      style={{ color: "#2d5016", marginBottom: "10px" }}
                    >
                      {pkg.power}
                    </p>
                    <p
                      style={{
                        color: "#4CAF50",
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                      }}
                    >
                      {pkg.price}
                    </p>
                    <ul
                      style={{
                        textAlign: "left",
                        fontSize: "14px",
                        marginBottom: "20px",
                      }}
                    >
                      {pkg.items.map((item, j) => (
                        <li
                          key={j}
                          style={{
                            color: isDarkMode ? "#aaa" : "#666",
                            marginBottom: "8px",
                          }}
                        >
                          ✓ {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/products">
                      <button
                        className="button is-fullwidth"
                        style={{
                          backgroundColor: "#2d5016",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Learn More →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        style={{
          backgroundColor: "#2d5016",
          color: "#fff",
          padding: "60px 20px",
        }}
      >
        <div className="container">
          <h2
            className="title has-text-centered"
            style={{ color: "#fff", fontSize: "40px", marginBottom: "40px" }}
          >
            📋 Get Your Free Solar Quote Today
          </h2>
          <div className="columns">
            <div className="column is-8 is-offset-2">
              <form onSubmit={handleContactSubmit}>
                <div className="columns is-multiline">
                  <div className="column is-6">
                    <div className="field">
                      <label className="label" style={{ color: "#e8f5e9" }}>
                        📧 Email Address
                      </label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{
                            backgroundColor: isDarkMode ? "#333" : "#fff",
                          }}
                        />
                        <span className="icon is-left">
                          <i>✉️</i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label className="label" style={{ color: "#e8f5e9" }}>
                        📱 Phone Number
                      </label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="tel"
                          placeholder="Your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          style={{
                            backgroundColor: isDarkMode ? "#333" : "#fff",
                          }}
                        />
                        <span className="icon is-left">
                          <i>📞</i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="column is-12">
                    <div className="field">
                      <label className="label" style={{ color: "#e8f5e9" }}>
                        💬 Message
                      </label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          placeholder="Tell us about your solar needs (roof size, energy requirement, budget, etc.)"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={4}
                          style={{
                            backgroundColor: isDarkMode ? "#333" : "#fff",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column is-12">
                    <button
                      className="button is-fullwidth is-large"
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                      disabled={loading}
                    >
                      {loading ? "⏳ Sending..." : "🚀 Send Free Quote Request"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <AppFooter isDarkMode={isDarkMode} />
    </div>
  );
}
