"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "bulma/css/bulma.css";

type AdminSidebarProps = {
  minimized: boolean;
  onToggle: () => void;
  user?: { email?: string; role?: string; name?: string } | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

const managementItems = [
  { label: "Dashboard", icon: "📊", href: "/admin/dashboard" },
  { label: "Products", icon: "📦", href: "/admin/products" },
  { label: "Categories", icon: "🏷️", href: "/admin/categories" },
  { label: "Customers", icon: "👥", href: "/admin/customers" },
  { label: "Quotes", icon: "💬", href: "/admin/quotes" },
  { label: "Orders", icon: "🛒", href: "/admin/orders" },
  { label: "Blogs", icon: "📰", href: "/admin/blogs" },
  { label: "Users", icon: "👤", href: "/admin/users" },
  { label: "Roles", icon: "🔑", href: "/admin/roles" },
];

const settingsItems = [
  { label: "User Settings", icon: "👤", href: "/admin/user-settings" },
  { label: "Site Settings", icon: "⚙️", href: "/admin/settings" },
  { label: "SEO Tags", icon: "🔍", href: "/admin/seo" },
  { label: "Carousel Media", icon: "🖼️", href: "/admin/media" },
  { label: "FAQs", icon: "❓", href: "/admin/faqs" },
];

export function AdminSidebar({
  minimized,
  onToggle,
  user,
  onLogout,
  isDarkMode,
  onToggleTheme,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const bg = isDarkMode ? "#1e1e1e" : "#2d5016";
  const fg = "#ffffff";
  const divider = isDarkMode ? "#3a3a3a" : "#ffffff";

  const renderItems = (items: typeof managementItems) => (
    <ul className="menu-list">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.href} style={{ marginBottom: "4px" }}>
            <Link
              href={item.href}
              style={{
                color: fg,
                padding: "10px 12px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                backgroundColor: isActive
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
                transition: "background-color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: "1.1rem",
                  minWidth: "22px",
                  textAlign: "center",
                }}
              >
                {item.icon}
              </span>
              {!minimized && (
                <span style={{ fontSize: "0.95rem" }}>{item.label}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <aside
        className="menu"
        style={{
          width: minimized ? "80px" : "250px",
          backgroundColor: bg,
          padding: minimized ? "16px 10px" : "20px",
          color: fg,
          overflowY: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          transition: "width 0.25s ease",
          borderRight: `1px solid ${isDarkMode ? "#333" : "#1f3510"}`,
          zIndex: 999,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: minimized ? "center" : "space-between",
            alignItems: "center",
            marginBottom: "18px",
            gap: "6px",
          }}
        >
          {!minimized && (
            <p className="menu-label" style={{ color: fg, marginBottom: 0 }}>
              ☀️ Admin Panel
            </p>
          )}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              className="button is-small"
              title={isDarkMode ? "Light mode" : "Dark mode"}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${fg}`,
                color: fg,
                cursor: "pointer",
              }}
              onClick={onToggleTheme}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
              className="button is-small"
              onClick={onToggle}
              title={minimized ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${fg}`,
                color: fg,
                cursor: "pointer",
                minWidth: "36px",
              }}
            >
              {minimized ? "+" : "-"}
            </button>
          </div>
        </div>

        {!minimized && (
          <div
            style={{
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: `1px solid ${divider}`,
            }}
          >
            <p style={{ fontSize: "14px", color: fg }}>
              {user?.email || "admin@solarstore.com"}
            </p>
            <p style={{ fontSize: "12px", color: "#dddddd" }}>
              {user?.role || "Administrator"}
            </p>
          </div>
        )}

        {!minimized && (
          <p className="menu-label" style={{ color: fg }}>
            Management
          </p>
        )}
        {renderItems(managementItems)}

        {!minimized && (
          <p className="menu-label" style={{ color: fg, marginTop: "14px" }}>
            Settings
          </p>
        )}
        {renderItems(settingsItems)}

        <button
          className="button is-fullwidth"
          style={{
            marginTop: "18px",
            backgroundColor: "#ffffff",
            color: "#2d5016",
            fontWeight: "bold",
          }}
          onClick={onLogout}
        >
          🚪 Logout
        </button>
      </aside>

      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.12);
        }
        aside::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.35);
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        @media screen and (max-width: 768px) {
          aside {
            width: 70px !important;
            padding: 12px 8px !important;
          }
        }
      `}</style>
    </>
  );
}
