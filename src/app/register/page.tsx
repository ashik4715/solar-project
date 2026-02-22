"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "bulma/css/bulma.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
        paddingTop: "40px",
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
                    Create an Account
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

                  {success && (
                    <div className="notification is-success is-light">
                      <button
                        className="delete"
                        onClick={() => setSuccess("")}
                        type="button"
                      ></button>
                      {success}
                    </div>
                  )}

                  <div className="field">
                    <label className="label">Full Name</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="John Doe"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <span className="icon is-left">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="email"
                        placeholder="john@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <span className="icon is-left">
                        <i className="fas fa-envelope"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Phone Number</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      <span className="icon is-left">
                        <i className="fas fa-phone"></i>
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <span className="icon is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                    <p
                      className="help"
                      style={{ fontSize: "11px", color: "#999" }}
                    >
                      Minimum 6 characters
                    </p>
                  </div>

                  <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        placeholder="••••••••"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span className="icon is-small">
                              <i className="fas fa-user-plus"></i>
                            </span>
                            <span>Register</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <hr />

                  <div className="has-text-centered">
                    <p className="is-size-7">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        style={{ color: "#2d5016", fontWeight: "bold" }}
                      >
                        Login here
                      </Link>
                    </p>
                  </div>

                  <div style={{ marginTop: "15px", textAlign: "center" }}>
                    <Link
                      href="/"
                      style={{
                        color: "#2d5016",
                        textDecoration: "underline",
                        fontSize: "14px",
                      }}
                    >
                      ← Back to Home
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
