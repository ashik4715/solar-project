"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "bulma/css/bulma.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5-tablet is-4-desktop">
            <div className="card">
              <div className="card-content">
                <p
                  className="title has-text-centered"
                  style={{ color: "#2d5016" }}
                >
                  ☀️ Solar Store Admin
                </p>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="notification is-danger">
                      <button
                        className="delete"
                        onClick={() => setError("")}
                      ></button>
                      {error}
                    </div>
                  )}

                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        className="input"
                        type="email"
                        placeholder="admin@solarstore.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <button
                        className="button is-success is-fullwidth"
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: "#4CAF50" }}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </div>
                </form>

                <p
                  className="has-text-grey-light has-text-centered"
                  style={{ marginTop: "20px", fontSize: "12px" }}
                >
                  Demo: Use the credentials from your .env file
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
