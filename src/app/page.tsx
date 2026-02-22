"use client";

import React, { useState } from "react";
import Link from "next/link";
import "bulma/css/bulma.css";
import "./globals.css";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar has-shadow" style={{ backgroundColor: "#2d5016" }}>
        <div className="navbar-brand">
          <Link
            href="/"
            className="navbar-item"
            style={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}
          >
            ☀️ Solar Store
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <Link
              href="/products"
              className="navbar-item"
              style={{ color: "#fff" }}
            >
              Products
            </Link>
            <Link
              href="/quotes"
              className="navbar-item"
              style={{ color: "#fff" }}
            >
              Get Quote
            </Link>
            <Link
              href="/after-sales"
              className="navbar-item"
              style={{ color: "#fff" }}
            >
              After Sales
            </Link>
            <Link
              href="/admin"
              className="navbar-item"
              style={{ color: "#fff" }}
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero is-large"
        style={{
          backgroundImage: "url(/assets/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="hero-body"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="container has-text-centered">
            <h1 className="title" style={{ color: "#fff", fontSize: "48px" }}>
              Premium Residential Solar
            </h1>
            <p className="subtitle" style={{ color: "#fff", fontSize: "24px" }}>
              Easy, Efficient, and Affordable Solar Solutions
            </p>
            <Link href="/quotes">
              <button
                className="button is-success is-large"
                style={{ backgroundColor: "#4CAF50" }}
              >
                Get Free Quote
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="container">
          <h2 className="title has-text-centered">What We Offer</h2>
          <div className="columns is-multiline">
            {[
              "Solar Panels",
              "Inverters",
              "Batteries",
              "Installation Service",
              "Maintenance",
              "Warranty Support",
            ].map((item, i) => (
              <div key={i} className="column is-4">
                <div className="card">
                  <div className="card-content">
                    <p className="title is-5">{item}</p>
                    <p>Comprehensive solutions for your solar energy needs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Best Range */}
      <section className="section">
        <div className="container">
          <h2 className="title has-text-centered">
            Our Best Range of Solar Packages
          </h2>
          <div className="columns is-multiline">
            {[
              {
                power: "6.6kW",
                price: "₹3,90,000",
                items: [
                  "6 x 1.1 kW Panels",
                  "1 x 6.6 kW Inverter",
                  "Installation",
                ],
              },
              {
                power: "10kW",
                price: "₹5,40,000",
                items: [
                  "10 x 1 kW Panels",
                  "1 x 10 kW Inverter",
                  "Installation",
                ],
              },
              {
                power: "13.3kW",
                price: "₹6,95,000",
                items: [
                  "13 x 1 kW Panels",
                  "1 x 13 kW Inverter",
                  "Installation",
                ],
              },
              {
                power: "20kW",
                price: "₹9,80,000",
                items: [
                  "20 x 1 kW Panels",
                  "1 x 20 kW Inverter",
                  "Installation",
                ],
              },
            ].map((pkg, i) => (
              <div key={i} className="column is-3">
                <div className="card" style={{ textAlign: "center" }}>
                  <div className="card-content">
                    <p className="title is-4" style={{ color: "#2d5016" }}>
                      {pkg.power}
                    </p>
                    <p
                      className="heading"
                      style={{ color: "#4CAF50", fontSize: "20px" }}
                    >
                      {pkg.price}
                    </p>
                    <ul
                      className="content"
                      style={{ textAlign: "left", fontSize: "14px" }}
                    >
                      {pkg.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                    <Link href="/quotes">
                      <button className="button is-success is-fullwidth">
                        Get Quote
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="container">
          <h2 className="title has-text-centered">Why Choose Us?</h2>
          <div className="columns">
            <div className="column is-6">
              <h3 className="title is-5">✓ Authentic Brands & Genuine</h3>
              <p>
                We work only with certified solar manufacturers and authentic
                products
              </p>
            </div>
            <div className="column is-6">
              <h3 className="title is-5">
                ✓ Measurable Value, Complete freedom
              </h3>
              <p>Transparent pricing with no hidden costs</p>
            </div>
          </div>
          <div className="columns">
            <div className="column is-6">
              <h3 className="title is-5">✓ High Quality After Service</h3>
              <p>Dedicated support team available 24/7</p>
            </div>
            <div className="column is-6">
              <h3 className="title is-5">✓ Installation & Testing</h3>
              <p>
                Professional installation with full testing and certification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <h2 className="title has-text-centered">
            Frequently Asked Questions
          </h2>
          <div className="content">
            <details>
              <summary>
                <strong>How much does a solar installation cost?</strong>
              </summary>
              <p>
                The cost depends on your power needs. We offer packages from
                6.6kW to 20kW. Contact us for a free quote.
              </p>
            </details>
            <details>
              <summary>
                <strong>What is the warranty on solar panels?</strong>
              </summary>
              <p>
                All our solar panels come with a 25-year manufacturer warranty
                and 5-year installation warranty.
              </p>
            </details>
            <details>
              <summary>
                <strong>How long does installation take?</strong>
              </summary>
              <p>
                Typically 3-7 days depending on system size and site conditions
              </p>
            </details>
            <details>
              <summary>
                <strong>Do you offer financing options?</strong>
              </summary>
              <p>
                Yes, we work with multiple financing partners to make solar
                affordable for everyone.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="section"
        style={{ backgroundColor: "#2d5016", color: "#fff" }}
      >
        <div className="container">
          <h2 className="title has-text-centered" style={{ color: "#fff" }}>
            Enquire For Free Quote
          </h2>
          <div className="columns">
            <div className="column is-8 is-offset-2">
              <form onSubmit={handleContactSubmit}>
                <div className="field">
                  <label className="label" style={{ color: "#fff" }}>
                    Email
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label" style={{ color: "#fff" }}>
                    Phone
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="tel"
                      placeholder="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label" style={{ color: "#fff" }}>
                    Message
                  </label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Tell us about your solar needs"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button
                      className="button is-success is-fullwidth"
                      style={{ backgroundColor: "#4CAF50" }}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Inquiry"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="footer"
        style={{ backgroundColor: "#1a3a0e", color: "#fff" }}
      >
        <div className="content has-text-centered">
          <p>
            <strong>Solar Store</strong> - Your trusted partner in solar energy.
            ©2024 All rights reserved.
          </p>
          <p>
            <Link href="/admin" style={{ color: "#4CAF50" }}>
              Admin Login
            </Link>{" "}
            |
            <Link href="/api/docs" style={{ color: "#4CAF50" }}>
              {" "}
              API Docs
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
