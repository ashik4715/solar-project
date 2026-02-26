"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import "bulma/css/bulma.css";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  stock: number;
  category: string;
  rating: number;
  reviewCount: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (searchTerm) query.set("q", searchTerm);
        if (selectedCategory) query.set("category", selectedCategory);
        const productsRes = await fetch(`/api/products?${query.toString()}`);
        const categoriesRes = await fetch("/api/categories");

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(
            Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.data?.products)
                ? data.data.products
                : [],
          );
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(Array.isArray(data.data) ? data.data : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategory]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const bgColor = isDarkMode ? "#1a1a1a" : "#ffffff";
  const textColor = isDarkMode ? "#e0e0e0" : "#333";
  const cardBg = isDarkMode ? "#2d2d2d" : "#f9f9f9";
  const borderColor = isDarkMode ? "#444" : "#e0e0e0";
  const filteredProducts = searchTerm
    ? products.filter((product) => {
        const term = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
        );
      })
    : products;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#0f0f0f" : "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Navigation Bar */}
      <nav
        className="navbar has-shadow"
        style={{ backgroundColor: "#2d5016", color: "#fff" }}
      >
        <div className="navbar-brand">
          <Link
            href="/"
            className="navbar-item"
            style={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}
          >
            ☀️ Solar Store
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <Link
                href="/products"
                className="navbar-item"
                style={{ color: "#fff", fontWeight: "bold" }}
              >
                Products
              </Link>
            </div>
            <div className="navbar-item">
              <Link href="/quotes" style={{ color: "#fff" }}>
                Quotes
              </Link>
            </div>
            <div className="navbar-item">
              <Link href="/login" style={{ color: "#fff" }}>
                Login
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/register"
                className="button is-light is-small has-text-weight-semibold"
                style={{ color: isDarkMode ? "#183013" : "#2d5016" }}
              >
                Register
              </Link>
            </div>
            <div className="navbar-item">
              <Link
                href="/admin/login"
                className="button is-outlined is-light is-small"
                style={{ color: "#e8f5e9", borderColor: "#e8f5e9" }}
              >
                Admin
              </Link>
            </div>
            <div className="navbar-item">
              <button
                className="button is-small"
                onClick={toggleTheme}
                style={{
                  backgroundColor: isDarkMode ? "#444" : "#ddd",
                  color: textColor,
                  border: "none",
                  cursor: "pointer",
                }}
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="container" style={{ padding: "20px 20px 0" }}>
        <div className="box">
          <div className="columns is-multiline">
            <div className="column is-6">
              <label className="label">Search products</label>
              <input
                className="input"
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="column is-4">
              <label className="label">Category</label>
              <div className="select is-fullwidth">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug || cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundColor: "#2d5016",
          color: "#fff",
          padding: "40px 20px",
        }}
      >
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1
              className="title"
              style={{ color: "#fff", fontSize: "48px", marginBottom: "20px" }}
            >
              🌞 Solar Energy Products
            </h1>
            <p
              className="subtitle"
              style={{ color: "#e8f5e9", fontSize: "18px" }}
            >
              Premium solar panels and energy solutions for your home or
              business
            </p>
          </div>
        </div>
      </section>

      <div
        className="container"
        style={{ paddingTop: "30px", paddingBottom: "30px" }}
      >
        <div className="columns">
          {/* Sidebar - Filters */}
          <div className="column is-3-desktop is-12-touch">
            <div
              style={{
                backgroundColor: cardBg,
                padding: "20px",
                borderRadius: "8px",
                border: `1px solid ${borderColor}`,
              }}
            >
              <h3
                style={{
                  color: textColor,
                  marginBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                🔍 Filters
              </h3>

              {/* Search */}
              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: textColor,
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "4px",
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Categories */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    color: textColor,
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  📦 Categories
                </label>
                <div style={{ marginBottom: "10px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ""}
                      onChange={() => setSelectedCategory("")}
                      style={{ marginRight: "8px" }}
                    />
                    <span style={{ color: textColor }}>All Products</span>
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category._id} style={{ marginBottom: "10px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category._id}
                        checked={selectedCategory === category._id}
                        onChange={() => setSelectedCategory(category._id)}
                        style={{ marginRight: "8px" }}
                      />
                      <span style={{ color: textColor }}>{category.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="column is-9-desktop is-12-touch">
            {/* Results Header */}
            <div
              style={{
                marginBottom: "30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  color: textColor,
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                Products ({filteredProducts.length})
              </h2>
            </div>

            {loading ? (
              <div
                className="has-text-centered"
                style={{ padding: "60px 20px" }}
              >
                <p style={{ color: textColor, fontSize: "18px" }}>
                  Loading products...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                className="has-text-centered"
                style={{ padding: "60px 20px" }}
              >
                <p style={{ color: textColor, fontSize: "18px" }}>
                  No products found
                </p>
              </div>
            ) : (
              <div className="columns is-multiline">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="column is-4-desktop is-6-tablet is-12-mobile"
                  >
                    <div
                      className="card"
                      style={{
                        backgroundColor: cardBg,
                        border: `1px solid ${borderColor}`,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Product Image */}
                      <div className="card-image">
                        <figure
                          className="image is-4by3"
                          style={{
                            backgroundColor: isDarkMode ? "#444" : "#e8e8e8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {product.images && product.images.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div style={{ fontSize: "48px", color: "#ccc" }}>
                              📦
                            </div>
                          )}
                        </figure>
                      </div>

                      {/* Product Info */}
                      <div
                        className="card-content"
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h3
                          style={{
                            color: textColor,
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginBottom: "10px",
                            minHeight: "40px",
                          }}
                        >
                          {product.name}
                        </h3>

                        <p
                          style={{
                            color: isDarkMode ? "#aaa" : "#666",
                            fontSize: "13px",
                            marginBottom: "10px",
                            flex: 1,
                          }}
                        >
                          {product.description?.substring(0, 60)}...
                        </p>

                        {/* Rating */}
                        <div style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{ color: "#ffc107", fontSize: "14px" }}
                            >
                              {"⭐".repeat(Math.round(product.rating))}
                            </span>
                            <span
                              style={{
                                color: isDarkMode ? "#999" : "#999",
                                fontSize: "12px",
                              }}
                            >
                              ({product.reviewCount} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ marginBottom: "15px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            {product.salePrice ? (
                              <>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#2d5016",
                                  }}
                                >
                                  ₹{product.salePrice.toLocaleString()}
                                </span>
                                <span
                                  style={{
                                    fontSize: "14px",
                                    color: isDarkMode ? "#999" : "#999",
                                    textDecoration: "line-through",
                                  }}
                                >
                                  ₹{product.price.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                  color: "#2d5016",
                                }}
                              >
                                ₹{product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div style={{ marginBottom: "15px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor:
                                product.stock > 0 ? "#e8f5e9" : "#ffebee",
                              color: product.stock > 0 ? "#2d5016" : "#c62828",
                              fontWeight: "bold",
                            }}
                          >
                            {product.stock > 0
                              ? `✓ In Stock (${product.stock})`
                              : "Out of Stock"}
                          </span>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="button is-fullwidth"
                            style={{
                              backgroundColor: "#2d5016",
                              color: "#fff",
                              fontWeight: "bold",
                              flex: 1,
                            }}
                            disabled={product.stock <= 0}
                          >
                            🛒 Add to Cart
                          </button>
                          <Link
                            href={`/products/${product.slug}`}
                            className="button is-outlined is-fullwidth"
                            style={{
                              borderColor: "#2d5016",
                              color: "#2d5016",
                              fontWeight: "bold",
                              flex: 1,
                            }}
                          >
                            👁️ View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <AppFooter isDarkMode={isDarkMode} />
    </div>
  );
}
