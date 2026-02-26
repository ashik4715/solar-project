"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "bulma/css/bulma.css";

interface Quote {
  _id: string;
  quoteNumber: string;
  customer: { name: string; email: string };
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<{ _id: string; name: string; email: string }[]>([]);
  const [products, setProducts] = useState<{ _id: string; name: string; price: number }[]>([]);
  const [newQuote, setNewQuote] = useState<{
    customerId: string;
    items: { productId: string; quantity: number; price: number }[];
  }>({
    customerId: "",
    items: [{ productId: "", quantity: 1, price: 0 }],
  });

  useEffect(() => {
    fetchQuotes();
    (async () => {
      const [custRes, prodRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/products?limit=200"),
      ]);
      if (custRes.ok) {
        const data = await custRes.json();
        setCustomers(data.data?.customers || data.data || []);
      }
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.data?.products || data.data || []);
      }
    })();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();
      setQuotes(data.data?.quotes || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      const response = await fetch("/api/quotes/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });

      if (response.ok) {
        Swal.fire("Sent", "Quote sent successfully", "success");
        fetchQuotes();
      } else {
        Swal.fire("Failed", "Could not send quote", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error sending quote", "error");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: "is-warning",
      sent: "is-info",
      accepted: "is-success",
      rejected: "is-danger",
    };
    return colors[status] || "is-grey";
  };

  const updateItem = (idx: number, key: "productId" | "quantity" | "price", value: any) => {
    setNewQuote((prev) => {
      const next = [...prev.items];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, items: next };
    });
  };

  const addItem = () =>
    setNewQuote((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, price: 0 }],
    }));

  const removeItem = (idx: number) =>
    setNewQuote((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  const createQuote = async () => {
    if (!newQuote.customerId) {
      Swal.fire("Select customer", "Customer is required", "warning");
      return;
    }
    const payloadItems = newQuote.items
      .filter((it) => it.productId)
      .map((it) => ({
        product: it.productId,
        quantity: Number(it.quantity) || 1,
        price:
          it.price ||
          products.find((p) => p._id === it.productId)?.price ||
          0,
      }));
    if (payloadItems.length === 0) {
      Swal.fire("Add items", "Add at least one line item", "warning");
      return;
    }
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: newQuote.customerId, items: payloadItems }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      Swal.fire("Failed", data.message || "Could not create quote", "error");
      return;
    }
    Swal.fire("Saved", "Quote created", "success");
    setNewQuote({ customerId: "", items: [{ productId: "", quantity: 1, price: 0 }] });
    fetchQuotes();
  };

  return (
    <div>
      <h1 className="title">Quotes ({quotes.length})</h1>

      <div className="box" style={{ marginBottom: "20px" }}>
        <div className="level">
          <div className="level-left">
            <h3 className="subtitle">Create Quote</h3>
          </div>
        </div>
        <div className="columns is-multiline">
          <div className="column is-6">
            <label className="label">Customer</label>
            <div className="select is-fullwidth">
              <select
                value={newQuote.customerId}
                onChange={(e) => setNewQuote({ ...newQuote, customerId: e.target.value })}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <label className="label">Items</label>
        {newQuote.items.map((item, idx) => (
          <div className="columns is-vcentered" key={idx}>
            <div className="column is-5">
              <div className="select is-fullwidth">
                <select
                  value={item.productId}
                  onChange={(e) => {
                    const productId = e.target.value;
                    const prod = products.find((p) => p._id === productId);
                    updateItem(idx, "productId", productId);
                    if (prod) updateItem(idx, "price", prod.price);
                  }}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="column is-2">
              <input
                className="input"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
              />
            </div>
            <div className="column is-3">
              <input
                className="input"
                type="number"
                value={item.price}
                onChange={(e) => updateItem(idx, "price", Number(e.target.value))}
                placeholder="Price"
              />
            </div>
            <div className="column is-2">
              <button
                className="button is-light is-small"
                onClick={() => removeItem(idx)}
                disabled={newQuote.items.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button className="button is-text" onClick={addItem}>
          + Add item
        </button>
        <div style={{ marginTop: "10px" }}>
          <button className="button is-primary" onClick={createQuote}>
            Create quote
          </button>
        </div>
      </div>

      {loading ? (
        <p className="has-text-centered">Loading quotes...</p>
      ) : (
        <div className="table-container">
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="has-text-centered has-text-grey-light"
                  >
                    No quotes yet
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote._id}>
                    <td>
                      <strong>{quote.quoteNumber}</strong>
                    </td>
                    <td>{quote.customer?.name || "Unknown"}</td>
                    <td>₹{quote.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`tag ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="button is-info is-small">View</button>
                      {quote.status === "draft" && (
                        <button
                          className="button is-success is-small"
                          onClick={() => handleSendQuote(quote._id)}
                        >
                          Send
                        </button>
                      )}
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
