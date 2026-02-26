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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const url = statusFilter ? `/api/orders?status=${statusFilter}` : "/api/orders";
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.data || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

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
    if (res.ok && data.data?.pdfUrl) {
      window.open(data.data.pdfUrl, "_blank");
    } else {
      alert(data.message || "Invoice generation failed");
    }
  };

  return (
    <div>
      <h1 className="title">Orders</h1>
      <div className="field is-grouped" style={{ marginBottom: "20px" }}>
        <div className="control">
          <div className="select">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
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
                  <td>₹{order.totalAmount?.toLocaleString()}</td>
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
