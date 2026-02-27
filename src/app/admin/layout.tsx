"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "bulma/css/bulma.css";
import { AdminSidebar } from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
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
  const sidebarWidth = sidebarMinimized ? 80 : 250;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: contentBg,
      }}
    >
      <AdminSidebar
        minimized={sidebarMinimized}
        onToggle={() => setSidebarMinimized((p) => !p)}
      />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "30px",
          backgroundColor: contentBg,
          color: textColor,
          overflowY: "auto",
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
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
          <button className="button is-small" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
        {children}
      </main>
      <style jsx>{`
        @media screen and (max-width: 768px) {
          main {
            margin-left: 65px !important;
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
