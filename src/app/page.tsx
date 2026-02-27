"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import "bulma/css/bulma.css";
import "./globals.css";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    systemSize: "",
    address: "",
  });
  const [slides, setSlides] = useState<
    {
      _id: string;
      title?: string;
      subtitle?: string;
      mediaUrl: string;
      mediaType: string;
      hasAudio?: boolean;
      ctaText?: string;
      ctaHref?: string;
    }[]
  >([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (searchParams?.get("openQuote")) {
      setShowQuoteModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const res = await fetch("/api/carousel");
        const data = await res.json();
        if (Array.isArray(data.data)) setSlides(data.data);
      } catch (e) {
        console.warn("carousel fetch failed", e);
      }
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const openQuote = () => setShowQuoteModal(true);
  const closeQuote = () => {
    setShowQuoteModal(false);
    const params = new URLSearchParams(window.location.search);
    params.delete("openQuote");
    router.replace(`/?${params.toString()}`);
  };

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteForm),
    }).catch(() => {});
    setLoading(false);
    alert("Quote submitted! We'll reach out soon.");
    setQuoteForm({
      name: "",
      email: "",
      phone: "",
      systemSize: "",
      address: "",
    });
    closeQuote();
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
                href="/blogs"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  marginRight: "15px",
                }}
              >
                📰 Blogs
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
                className="is-medium"
              >
                👤 Login
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/register"
                style={{
                  color: "#e8f5e9",
                  textDecoration: "none",
                  marginRight: "15px",
                  fontWeight: "bold",
                }}
              >
                ✍️ Register
              </Link>
            </div>
            <div className="navbar-item">
              <button
                className="button is-small is-rounded"
                onClick={toggleTheme}
                style={{
                  backgroundColor: isDarkMode ? "#7b0000" : "#b221e7",
                  color: textColor,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? "☀️ " : "🌙 "}
              </button>
            </div>
            <div className="navbar-item">
              <Link
                href="/admin/login"
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

      {/* Hero / Carousel */}
      <section
        className="hero is-large"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {slides.length > 0 ? (
          <div style={{ height: "600px" }}>
            {slides.map((slide, idx) => (
              <div
                key={slide._id}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: activeSlide === idx ? 1 : 0,
                  transition: "opacity 0.6s ease",
                  backgroundColor: "#0d2a0f",
                  backgroundImage:
                    slide.mediaType === "image"
                      ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${slide.mediaUrl})`
                      : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  padding: "40px",
                }}
              >
                <div className="container has-text-centered">
                  <span
                    className="tag is-success is-light"
                    style={{ marginBottom: "10px" }}
                  >
                    Renewable energy for everyone
                  </span>
                  <h1
                    className="title"
                    style={{
                      color: "#fff",
                      fontSize: "56px",
                      marginBottom: "20px",
                    }}
                  >
                    {slide.title || "Power your home with clean solar energy"}
                  </h1>
                  <p
                    className="subtitle"
                    style={{ color: "#e8f5e9", fontSize: "20px" }}
                  >
                    {slide.subtitle ||
                      "Premium solar panels, expert installation, and reliable maintenance services tailored to your needs."}
                  </p>
                  <div
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      gap: "12px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      className="button is-light is-large"
                      href={slide.ctaHref || "/products"}
                    >
                      {slide.ctaText || "Explore Products"}
                    </Link>
                    <button
                      className="button is-success is-large"
                      onClick={openQuote}
                    >
                      Get a Quote
                    </button>
                  </div>
                  {slide.mediaType === "video" ? (
                    <video
                      src={slide.mediaUrl}
                      autoPlay
                      muted={!slide.hasAudio}
                      controls={slide.hasAudio}
                      loop
                      style={{
                        marginTop: "20px",
                        maxHeight: "320px",
                        maxWidth: "100%",
                        borderRadius: "12px",
                        boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
              }}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`slide-${i}`}
                  onClick={() => setActiveSlide(i)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "none",
                    background:
                      activeSlide === i ? "#fff" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            className="hero-body"
            style={{
              textAlign: "center",
              backgroundImage: isDarkMode
                ? "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))"
                : "linear-gradient(rgba(45,80,22,0.3), rgba(45,80,22,0.3))",
              backgroundColor: "#2d5016",
              minHeight: "600px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
                <button
                  className="button is-large is-outlined"
                  style={{
                    borderColor: "#fff",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                  onClick={openQuote}
                >
                  💬 Get Quote
                </button>
                <button
                  className="button is-large is-light"
                  style={{
                    borderColor: "#fff",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                  onClick={() =>
                    window.scrollTo({
                      top: 1000,
                      behavior: "smooth",
                    })
                  }
                >
                  📞 Contact Us
                </button>
              </div>
            </div>
          </div>
        )}
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
                price: "৳198,000",
                items: ["8 x 400W Panels", "3kW Inverter", "Installation"],
              },
              {
                power: "5kW",
                price: "৳385,000",
                items: ["13 x 400W Panels", "5kW Inverter", "Installation"],
              },
              {
                power: "10kW",
                price: "৳850,000",
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

      {/* Quote Modal */}
      <div className={`modal ${showQuoteModal ? "is-active" : ""}`}>
        <div className="modal-background" onClick={closeQuote}></div>
        <div className="modal-card" style={{ width: "640px" }}>
          <header className="modal-card-head">
            <p className="modal-card-title">Request a Quote</p>
            <button
              className="delete"
              aria-label="close"
              onClick={closeQuote}
            ></button>
          </header>
          <section className="modal-card-body">
            <form onSubmit={submitQuote}>
              <div className="field">
                <label className="label">Full Name</label>
                <input
                  className="input"
                  value={quoteForm.name}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <label className="label">Email</label>
                    <input
                      className="input"
                      type="email"
                      value={quoteForm.email}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="label">Phone</label>
                    <input
                      className="input"
                      value={quoteForm.phone}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">System Size (kW)</label>
                <div className="select is-fullwidth">
                  <select
                    value={quoteForm.systemSize}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, systemSize: e.target.value })
                    }
                  >
                    <option value="">Select size</option>
                    <option value="6.6">6.6 kW</option>
                    <option value="10">10 kW</option>
                    <option value="13.3">13.3 kW</option>
                    <option value="20">20 kW</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label">Address</label>
                <input
                  className="input"
                  value={quoteForm.address}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, address: e.target.value })
                  }
                />
              </div>
              <button
                className={`button is-success ${loading ? "is-loading" : ""}`}
                type="submit"
              >
                Submit Quote
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
