"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "bulma/css/bulma.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.data.user.role === "admin") {
            router.push("/admin/dashboard");
          }
        }
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="section"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5-tablet is-4-desktop">
            <div className="card">
              <div className="card-content">
                <div
                  className="has-text-centered"
                  style={{ marginBottom: "30px" }}
                >
                  <p
                    className="title"
                    style={{ color: "#2d5016", marginBottom: "10px" }}
                  >
                    ☀️ Solar Store
                  </p>
                  <p className="subtitle is-6" style={{ color: "#666" }}>
                    Admin Dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="notification is-danger is-light">
                      <button
                        className="delete"
                        onClick={() => setError("")}
                        type="button"
                      ></button>
                      {error}
                    </div>
                  )}

                  <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="email"
                        placeholder="admin@solarstore.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <span className="icon is-left">
                        <i className="fas fa-envelope"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span className="icon is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <button
                        className="button is-fullwidth"
                        type="submit"
                        disabled={loading}
                        style={{
                          backgroundColor: "#2d5016",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="icon is-small">
                              <i className="fas fa-spinner fa-spin"></i>
                            </span>
                            <span>Logging in...</span>
                          </>
                        ) : (
                          <>
                            <span className="icon is-small">
                              <i className="fas fa-sign-in-alt"></i>
                            </span>
                            <span>Login</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <hr />

                <div className="has-text-centered">
                  <p
                    className="is-size-7"
                    style={{ color: "#999", marginBottom: "10px" }}
                  >
                    Demo Credentials:
                  </p>
                  <p className="is-size-7" style={{ color: "#666" }}>
                    Email: <code>admin@solarstore.com</code>
                  </p>
                  <p className="is-size-7" style={{ color: "#666" }}>
                    Password: <code>ChangeMe123!</code>
                  </p>
                </div>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <Link
                    href="/"
                    style={{ color: "#2d5016", textDecoration: "underline" }}
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
