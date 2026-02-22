"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "bulma/css/bulma.css";

interface User {
  _id: string;
  email: string;
  name?: string;
  role: string;
}

export default function UserSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/login");
          return;
        }
        const data = await response.json();
        const userData = data.data?.user || data.data;
        setUser(userData);
        setName(userData.name || "");
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("✓ Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("✓ Password changed successfully. Please login again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: isDarkMode ? "#0f0f0f" : "#ffffff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="content"
          style={{ color: isDarkMode ? "#e0e0e0" : "#333" }}
        >
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          backgroundColor: isDarkMode ? "#0f0f0f" : "#ffffff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="content"
          style={{ color: isDarkMode ? "#e0e0e0" : "#333" }}
        >
          <p>Please log in to access user settings</p>
        </div>
      </div>
    );
  }

  const bgColor = isDarkMode ? "#0f0f0f" : "#ffffff";
  const textColor = isDarkMode ? "#e0e0e0" : "#333";
  const cardBg = isDarkMode ? "#2d2d2d" : "#f9f9f9";
  const borderColor = isDarkMode ? "#444" : "#e0e0e0";
  const inputBg = isDarkMode ? "#1a1a1a" : "#ffffff";

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <nav
        className="navbar has-shadow"
        style={{ backgroundColor: "#2d5016", color: "#fff" }}
      >
        <div className="navbar-brand">
          <Link href="/" className="navbar-item" style={{ color: "#fff" }}>
            <strong style={{ fontSize: "20px" }}>☀️ Solar Store</strong>
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <button
                onClick={toggleTheme}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </div>
            <div className="navbar-item">
              <Link href="/" style={{ color: "#fff" }}>
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Container */}
      <div className="section">
        <div className="container" style={{ maxWidth: "600px" }}>
          <h1 style={{ color: textColor, marginBottom: "30px" }}>
            ⚙️ User Settings
          </h1>

          {/* User Info */}
          <div
            className="box"
            style={{ backgroundColor: cardBg, borderColor: borderColor }}
          >
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: textColor, marginBottom: "10px" }}>
                <strong>Email:</strong> {user.email}
              </p>
              <p style={{ color: textColor, marginBottom: "10px" }}>
                <strong>Role:</strong>{" "}
                <span
                  style={{
                    backgroundColor:
                      user.role === "admin" ? "#d32f2f" : "#4CAF50",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  {user.role}
                </span>
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="notification is-danger"
              style={{ marginBottom: "20px" }}
            >
              <button className="delete" onClick={() => setError("")}></button>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              className="notification is-success"
              style={{ marginBottom: "20px" }}
            >
              <button
                className="delete"
                onClick={() => setSuccess("")}
              ></button>
              {success}
            </div>
          )}

          {/* Profile Update Form */}
          <div
            className="box"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
              marginBottom: "30px",
            }}
          >
            <h3 style={{ color: textColor, marginBottom: "20px" }}>
              📝 Update Profile
            </h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="field">
                <label className="label" style={{ color: textColor }}>
                  Full Name
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      backgroundColor: inputBg,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button
                    className="button"
                    type="submit"
                    disabled={saving}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      width: "100%",
                    }}
                  >
                    {saving ? "Saving..." : "💾 Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Password Change Form */}
          <div
            className="box"
            style={{ backgroundColor: cardBg, borderColor: borderColor }}
          >
            <h3 style={{ color: textColor, marginBottom: "20px" }}>
              🔐 Change Password
            </h3>
            <form onSubmit={handleChangePassword}>
              <div className="field">
                <label className="label" style={{ color: textColor }}>
                  Current Password
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      backgroundColor: inputBg,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" style={{ color: textColor }}>
                  New Password
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      backgroundColor: inputBg,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" style={{ color: textColor }}>
                  Confirm New Password
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      backgroundColor: inputBg,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button
                    className="button"
                    type="submit"
                    disabled={saving}
                    style={{
                      backgroundColor: "#2196F3",
                      color: "#fff",
                      width: "100%",
                    }}
                  >
                    {saving ? "Updating..." : "🔄 Update Password"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Back Link */}
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Link
              href="/"
              style={{
                color: "#2d5016",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
