"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  salePrice?: number;
  stock?: number;
  category?: { _id: string; name: string };
  images?: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Notice {
  type: "success" | "warning" | "danger";
  message: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    price: "",
    salePrice: "",
    sku: "",
    stock: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData.data?.products || []);
      setCategories(categoriesData.data || []);
    } catch (_error) {
      setNotice({
        type: "danger",
        message: "Unable to load products. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: slugify(formData.slug || formData.name),
      description: formData.description,
      category: formData.categoryId,
      price: Number(formData.price),
      salePrice: formData.salePrice
        ? Number(formData.salePrice)
        : Number(formData.price),
      sku: formData.sku,
      stock: formData.stock ? Number(formData.stock) : 0,
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };

    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/products/${editingId}` : "/api/products";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setNotice({
          type: "success",
          message: editingId ? "Product updated." : "Product created.",
        });
        setFormData({
          name: "",
          slug: "",
          description: "",
          categoryId: "",
          price: "",
          salePrice: "",
          sku: "",
          stock: "",
          imageUrl: "",
        });
        setEditingId(null);
        setShowForm(false);
        fetchInitialData();
      } else {
        setNotice({
          type: "danger",
          message: data.message || "Failed to save product.",
        });
      }
    } catch (_error) {
      setNotice({
        type: "danger",
        message: "Unexpected error while saving product.",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.name,
      description: product.description || "",
      categoryId: product.category?._id || "",
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : "",
      sku: product.sku,
      stock: product.stock ? String(product.stock) : "",
      imageUrl: product.images?.[0] || "",
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotice({ type: "success", message: "Product deleted." });
        fetchInitialData();
      } else {
        setNotice({ type: "danger", message: "Failed to delete product." });
      }
    } catch (_error) {
      setNotice({ type: "danger", message: "Error deleting product." });
    }
  };

  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
        setNotice({
          type: "success",
          message: data.message || "Uploaded media successfully.",
        });
      } else {
        setNotice({
          type: "warning",
          message: data.message || "Upload failed. Please check AWS config.",
        });
      }
    } catch (_error) {
      setNotice({ type: "danger", message: "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const handleSync = async () => {
    setNotice(null);
    try {
      const res = await fetch("/api/media/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setNotice({
          type: "success",
          message: data.message || "Sync completed.",
        });
      } else {
        setNotice({
          type: "warning",
          message:
            data.message ||
            "Could not sync. Ensure AWS credentials and bucket are set.",
        });
      }
    } catch (_error) {
      setNotice({
        type: "danger",
        message: "Failed to sync media.",
      });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <h1 className="title">Products ({products.length})</h1>
        <div className="buttons">
          <button className="button is-link is-light" onClick={handleSync}>
            🔄 Sync images/videos to S3
          </button>
          <button
            className="button is-success"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) setEditingId(null);
            }}
          >
            {showForm ? "Close form" : "+ Add Product"}
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`notification is-${notice.type}`}
          style={{ marginBottom: "16px" }}
        >
          <button className="delete" onClick={() => setNotice(null)} />
          {notice.message}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-content">
            <form onSubmit={handleSubmit}>
              <div className="columns is-multiline">
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Product Name</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Solar Panel 400W"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: slugify(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-6">
                  <div className="field">
                    <label className="label">SKU</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="SOL-400W-001"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-4">
                  <div className="field">
                    <label className="label">Price (₹)</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-4">
                  <div className="field">
                    <label className="label">Sale Price (₹)</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={formData.salePrice}
                        onChange={(e) =>
                          setFormData({ ...formData, salePrice: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-4">
                  <div className="field">
                    <label className="label">Stock</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Category</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categoryId: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Image URL</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="https://your-s3-bucket/..."
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                      />
                    </div>
                    <div className="field" style={{ marginTop: "10px" }}>
                      <div className="file has-name is-fullwidth">
                        <label className="file-label">
                          <input
                            className="file-input"
                            type="file"
                            accept="image/*,video/mp4,video/quicktime"
                            onChange={(e) => handleFileUpload(e.target.files?.[0])}
                            disabled={uploading}
                          />
                          <span className="file-cta">
                            <span className="file-label">
                              {uploading ? "Uploading..." : "Upload media"}
                            </span>
                          </span>
                          <span className="file-name">
                            {formData.imageUrl || "No file selected"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="column is-12">
                  <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="Product description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="button is-success">
                {editingId ? "Update Product" : "Create Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="button is-text"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      slug: "",
                      description: "",
                      categoryId: "",
                      price: "",
                      salePrice: "",
                      sku: "",
                      stock: "",
                      imageUrl: "",
                    });
                  }}
                >
                  Cancel edit
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="has-text-centered">Loading products...</p>
      ) : (
        <div className="table-container">
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Media</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="has-text-centered has-text-grey-light"
                  >
                    No products yet. Create your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>
                      ₹{product.salePrice || product.price}{" "}
                      {product.salePrice && (
                        <span className="has-text-grey">
                          (MRP ₹{product.price})
                        </span>
                      )}
                    </td>
                    <td>{product.stock ?? 0}</td>
                    <td>{product.category?.name || "N/A"}</td>
                    <td>
                      {product.images?.[0] ? (
                        <Link href={product.images[0]} target="_blank">
                          View
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="buttons">
                      <button
                        className="button is-info is-light is-small"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="button is-danger is-light is-small"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
