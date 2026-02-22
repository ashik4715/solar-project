"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: { name: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    salePrice: "",
    sku: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          salePrice: parseFloat(formData.salePrice || formData.price),
        }),
      });

      if (response.ok) {
        alert("Product created successfully!");
        setFormData({
          name: "",
          slug: "",
          description: "",
          category: "",
          price: "",
          salePrice: "",
          sku: "",
        });
        setShowForm(false);
        fetchProducts();
      }
    } catch (error) {
      alert("Error creating product");
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
        }}
      >
        <h1 className="title">Products ({products.length})</h1>
        <button
          className="button is-success"
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: "#4CAF50" }}
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

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
                          setFormData({ ...formData, name: e.target.value })
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
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Price (₹)</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        placeholder="15000"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-6">
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
                Create Product
              </button>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
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
                    <td>₹{product.price.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>{product.category?.name || "N/A"}</td>
                    <td>
                      <button className="button is-info is-small">Edit</button>
                      <button className="button is-danger is-small">
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
