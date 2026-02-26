"use client";

import React, { useEffect, useState, useCallback } from "react";
import "bulma/css/bulma.css";

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  customer?: { name: string; email: string };
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newOrder, setNewOrder] = useState<{
    customerId: string;
    items: { productId: string; quantity: number; price: number }[];
    paymentStatus: string;
    orderStatus: string;
    notes?: string;
  }>({
    customerId: "",
    items: [{ productId: "", quantity: 1, price: 0 }],
    paymentStatus: "pending",
    orderStatus: "pending",
    notes: "",
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const url = statusFilter
      ? `/api/orders?status=${statusFilter}`
      : "/api/orders";
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.data || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const loadRefs = async () => {
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
        const list = data.data?.products || data.data || [];
        setProducts(list);
      }
    };
    loadRefs();
  }, []);

  const updateStatus = async (id: string, orderStatus: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus }),
    });
    fetchOrders();
  };

  const generateInvoice = async (id: string) => {
    const res = await fetch(`/api/orders/${id}/invoice`, { method: "POST" });
    const data = await res.json();
    if (res.ok && (data.data?.pdfUrl || data.data?.pdfBase64)) {
      if (data.data.pdfUrl) {
        window.open(data.data.pdfUrl, "_blank");
      } else if (data.data.pdfBase64) {
        const blob = Uint8Array.from(
          atob(data.data.pdfBase64),
          (c) => c.charCodeAt(0),
        );
        const url = URL.createObjectURL(
          new Blob([blob], { type: "application/pdf" }),
        );
        window.open(url, "_blank");
      }
    } else {
      alert(data.message || "Invoice generation failed");
    }
  };

  const updateItem = (
    idx: number,
    key: "productId" | "quantity" | "price",
    value: any,
  ) => {
    setNewOrder((prev) => {
      const next = [...prev.items];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, items: next };
    });
  };

  const addItem = () =>
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, price: 0 }],
    }));

  const removeItem = (idx: number) =>
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  const createOrder = async () => {
    if (!newOrder.customerId) {
      alert("Select a customer");
      return;
    }
    const payloadItems = newOrder.items
      .filter((it) => it.productId)
      .map((it) => ({
        product: it.productId,
        quantity: Number(it.quantity) || 1,
        price:
          it.price || products.find((p) => p._id === it.productId)?.price || 0,
      }));
    if (payloadItems.length === 0) {
      alert("Add at least one item");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: newOrder.customerId,
        items: payloadItems,
        paymentStatus: newOrder.paymentStatus,
        orderStatus: newOrder.orderStatus,
        notes: newOrder.notes,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Failed to create order");
      return;
    }
    setNewOrder({
      customerId: "",
      items: [{ productId: "", quantity: 1, price: 0 }],
      paymentStatus: "pending",
      orderStatus: "pending",
      notes: "",
    });
    fetchOrders();
  };

  const createMockOrder = () => {
    if (!customers.length || !products.length) {
      alert("Need at least one customer and product to mock an order.");
      return;
    }
    const customerId = customers[0]._id;
    const product = products[0];
    setNewOrder({
      customerId,
      items: [{ productId: product._id, quantity: 1, price: product.price }],
      paymentStatus: "pending",
      orderStatus: "pending",
      notes: "Mock order",
    });
  };

  return (
    <div>
      <h1 className="title">Orders</h1>
      <div className="box" style={{ marginBottom: "20px" }}>
        <div className="level">
          <div className="level-left">
            <h3 className="subtitle">Create / Mock Order</h3>
          </div>
          <div className="level-right">
            <button
              className="button is-light is-small"
              onClick={createMockOrder}
            >
              Auto-fill mock order
            </button>
          </div>
        </div>

        <div className="columns is-multiline">
          <div className="column is-4">
            <label className="label">Customer</label>
            <div className="select is-fullwidth">
              <select
                value={newOrder.customerId}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, customerId: e.target.value })
                }
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
          <div className="column is-4">
            <label className="label">Order Status</label>
            <div className="select is-fullwidth">
              <select
                value={newOrder.orderStatus}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, orderStatus: e.target.value })
                }
              >
                {[
                  "pending",
                  "confirmed",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="column is-4">
            <label className="label">Payment Status</label>
            <div className="select is-fullwidth">
              <select
                value={newOrder.paymentStatus}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, paymentStatus: e.target.value })
                }
              >
                {["pending", "paid", "failed", "refunded"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <label className="label">Items</label>
        {newOrder.items.map((item, idx) => (
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
                      {p.name} (৳{p.price})
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
                onChange={(e) =>
                  updateItem(idx, "quantity", Number(e.target.value))
                }
              />
            </div>
            <div className="column is-3">
              <input
                className="input"
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(idx, "price", Number(e.target.value))
                }
                placeholder="Price"
              />
            </div>
            <div className="column is-2">
              <button
                className="button is-light is-small"
                onClick={() => removeItem(idx)}
                disabled={newOrder.items.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button className="button is-text" onClick={addItem}>
          + Add item
        </button>

        <div className="field" style={{ marginTop: "10px" }}>
          <label className="label">Notes</label>
          <textarea
            className="textarea"
            value={newOrder.notes}
            onChange={(e) =>
              setNewOrder({ ...newOrder, notes: e.target.value })
            }
          />
        </div>

        <button className="button is-primary" onClick={createOrder}>
          Create order
        </button>
      </div>

      <div className="field is-grouped" style={{ marginBottom: "20px" }}>
        <div className="control">
          <div className="select">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="has-text-grey">No orders yet.</p>
      ) : (
        <div className="table-container">
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customer?.name || "N/A"}</td>
                  <td>৳{order.totalAmount?.toLocaleString()}</td>
                  <td>
                    <span className="tag is-info">{order.paymentStatus}</span>
                  </td>
                  <td>
                    <div className="select is-small">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                      >
                        {[
                          "pending",
                          "confirmed",
                          "processing",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="buttons">
                    <button
                      className="button is-small is-link is-light"
                      onClick={() => generateInvoice(order._id)}
                    >
                      Invoice PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
