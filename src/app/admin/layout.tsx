"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "bulma/css/bulma.css";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Don't enforce auth on login page
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/page";

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.style.colorScheme = "dark";
    }
  }, []);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Check if user is authenticated and is admin
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/admin/login");
          return;
        }
        const data = await response.json();
        const user = data.data?.user || data.data;

        if (!user) {
          router.push("/admin/login");
          return;
        }

        // Check if user is admin
        if (user.role !== "admin") {
          router.push("/"); // Redirect non-admin users to home
          return;
        }

        setCurrentUser(user);
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  if (loading && !isLoginPage) {
    return (
      <div className="section">
        <p className="has-text-centered">Loading...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return children;
  }

  // If we reach here and no user, show loading (shouldn't happen due to redirect)
  if (!currentUser) {
    return (
      <div className="section">
        <p className="has-text-centered">Verifying access...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.style.colorScheme = newTheme ? "dark" : "light";
  };

  const sidebarBg = isDarkMode ? "#1a1a1a" : "#2d5016";
  const textColor = isDarkMode ? "#e0e0e0" : "#fff";
  const contentBg = isDarkMode ? "#2d2d2d" : "#f5f5f5";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: contentBg,
      }}
    >
      {/* Sidebar */}
      <aside
        className="menu"
        style={{
          width: "250px",
          backgroundColor: sidebarBg,
          padding: "20px",
          color: textColor,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <p
            className="menu-label"
            style={{ color: textColor, marginBottom: 0 }}
          >
            ☀️ Admin Panel
          </p>
          <button
            className="button is-small"
            onClick={toggleTheme}
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${textColor}`,
              color: textColor,
              cursor: "pointer",
            }}
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "20px",
            borderBottom: `1px solid ${isDarkMode ? "#444" : "#fff"}`,
          }}
        >
          <p style={{ fontSize: "14px", color: textColor }}>
            {currentUser?.name || currentUser?.email}
          </p>
          <p style={{ fontSize: "12px", color: isDarkMode ? "#999" : "#ddd" }}>
            {currentUser?.role === "admin" ? "Administrator" : "User"}
          </p>
        </div>

        <p className="menu-label" style={{ color: textColor }}>
          Management
        </p>
        <ul className="menu-list">
          <li>
            <Link href="/admin/dashboard" style={{ color: textColor }}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/products" style={{ color: textColor }}>
              📦 Products
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" style={{ color: textColor }}>
              🏷️ Categories
            </Link>
          </li>
          <li>
            <Link href="/admin/customers" style={{ color: textColor }}>
              👥 Customers
            </Link>
          </li>
          <li>
            <Link href="/admin/quotes" style={{ color: textColor }}>
              💬 Quotes
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" style={{ color: textColor }}>
              🛒 Orders
            </Link>
          </li>
        </ul>

        <p className="menu-label" style={{ color: textColor }}>
          Settings
        </p>
        <ul className="menu-list">
          <li>
            <Link href="/admin/settings" style={{ color: textColor }}>
              ⚙️ Site Settings
            </Link>
          </li>
          <li>
            <Link href="/admin/seo" style={{ color: textColor }}>
              🔍 SEO Tags
            </Link>
          </li>
          <li>
            <Link href="/admin/faqs" style={{ color: textColor }}>
              ❓ FAQs
            </Link>
          </li>
        </ul>

        <button
          className="button is-fullwidth"
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            backgroundColor: isDarkMode ? "#444" : "#fff",
            color: isDarkMode ? "#e0e0e0" : "#2d5016",
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "30px",
          backgroundColor: contentBg,
          color: textColor,
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
