"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "bulma/css/bulma.css";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/admin");
          return;
        }
        const data = await response.json();
        setCurrentUser(data.data.user);
      } catch (error) {
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="section">
        <p className="has-text-centered">Loading...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="section">
        <p className="has-text-danger">Access Denied</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="menu"
        style={{
          width: "250px",
          backgroundColor: "#2d5016",
          padding: "20px",
          color: "#fff",
        }}
      >
        <p className="menu-label" style={{ color: "#fff" }}>
          ☀️ Solar Store Admin
        </p>
        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "20px",
            borderBottom: "1px solid #fff",
          }}
        >
          <p style={{ fontSize: "14px" }}>
            {currentUser?.name || currentUser?.email}
          </p>
        </div>

        <p className="menu-label" style={{ color: "#fff" }}>
          Management
        </p>
        <ul className="menu-list">
          <li>
            <Link href="/admin/dashboard" style={{ color: "#fff" }}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/products" style={{ color: "#fff" }}>
              Products
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" style={{ color: "#fff" }}>
              Categories
            </Link>
          </li>
          <li>
            <Link href="/admin/customers" style={{ color: "#fff" }}>
              Customers
            </Link>
          </li>
          <li>
            <Link href="/admin/quotes" style={{ color: "#fff" }}>
              Quotes
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" style={{ color: "#fff" }}>
              Orders
            </Link>
          </li>
        </ul>

        <p className="menu-label" style={{ color: "#fff" }}>
          Settings
        </p>
        <ul className="menu-list">
          <li>
            <Link href="/admin/settings" style={{ color: "#fff" }}>
              Site Settings
            </Link>
          </li>
          <li>
            <Link href="/admin/seo" style={{ color: "#fff" }}>
              SEO Tags
            </Link>
          </li>
          <li>
            <Link href="/admin/faqs" style={{ color: "#fff" }}>
              FAQs
            </Link>
          </li>
        </ul>

        <button
          className="button is-light is-fullwidth"
          onClick={handleLogout}
          style={{ marginTop: "20px" }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5" }}>
        {children}
      </main>
    </div>
  );
}
