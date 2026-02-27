"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "bulma/css/bulma.css";

const menuItems = [
  { label: "Dashboard", icon: "📊", href: "/admin/dashboard" },
  { label: "Orders", icon: "🛒", href: "/admin/orders" },
  { label: "Blogs", icon: "📝", href: "/admin/blogs" },
  { label: "FAQs", icon: "❓", href: "/admin/faqs" },
  { label: "Quotes", icon: "💬", href: "/admin/quotes" },
  { label: "Roles & Users", icon: "🎛️", href: "/admin/roles" },
  { label: "SEO Tags", icon: "🏷️", href: "/admin/seo" },
  { label: "Media", icon: "🖼️", href: "/admin/media" },
  { label: "Settings", icon: "⚙️", href: "/admin/settings" },
];

export function AdminSidebar({
  minimized,
  onToggle,
}: {
  minimized: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <aside
        style={{
          backgroundColor: "#2d5016",
          color: "#fff",
          padding: minimized ? "1rem 0.5rem" : "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: minimized ? "80px" : "250px",
          overflowY: "auto",
          transition: "width 0.3s ease-in-out",
          zIndex: 999,
          borderRight: "1px solid #1d3610",
        }}
      >
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <button
            className="button is-small"
            onClick={onToggle}
            title={minimized ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              width: "100%",
              backgroundColor: "#3b6a1f",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
            }}
          >
            {minimized ? "→" : "←"}
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={item.href}
                  style={{
                    color: "#fff",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#3b6a1f" : "transparent",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(59, 106, 31, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.2rem",
                      minWidth: "24px",
                      textAlign: "center",
                    }}
                  >
                    {item.icon}
                  </span>
                  {!minimized && (
                    <span
                      style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        aside::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        @media screen and (max-width: 768px) {
          aside {
            width: 65px !important;
            padding: 0.75rem 0.25rem !important;
          }
        }
      `}</style>
    </>
  );
}
