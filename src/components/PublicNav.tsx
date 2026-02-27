"use client";

import Link from "next/link";
import { useState } from "react";

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle = { color: "#fff", textDecoration: "none" };

  return (
    <>
      <nav
        className="navbar has-shadow"
        style={{
          backgroundColor: "#2d5016",
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderBottom: "1px solid #1d3610",
          paddingBottom: "6px",
        }}
      >
        <div className="navbar-brand">
          <Link
            href="/"
            className="navbar-item"
            style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }}
          >
            ☀️ Solar Store
          </Link>
          <a
            role="button"
            className={`navbar-burger ${isOpen ? "is-active" : ""}`}
            aria-label="toggle navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </a>
        </div>

        <div
          id="navbarMenu"
          className={`navbar-menu ${isOpen ? "is-active" : ""}`}
        >
          <div className="navbar-end">
            <div className="navbar-item">
              <Link href="/faqs" style={linkStyle}>
                ❓ FAQs
              </Link>
            </div>
            <div className="navbar-item">
              <Link href="/blogs" style={linkStyle}>
                📝 Blogs
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/quote"
                className="button is-success"
                style={{
                  backgroundColor: "#3b6a1f",
                  color: "#fff",
                  border: "none",
                }}
              >
                Get a Quote
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/login"
                className="button is-medium"
                style={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  border: "1px solid #fff",
                }}
              >
                Login
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/register"
                className="button is-medium"
                style={{
                  backgroundColor: "#3b6a1f",
                  color: "#fff",
                  border: "none",
                }}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <style jsx>{`
        @media screen and (max-width: 1023px) {
          .navbar-burger {
            display: flex !important;
          }
          .navbar-menu {
            display: none !important;
          }
          .navbar-menu.is-active {
            display: block !important;
          }
        }
        @media screen and (min-width: 1024px) {
          .navbar-burger {
            display: none !important;
          }
          .navbar-menu {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
