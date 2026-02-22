"use client";

import React from "react";
import "bulma/css/bulma.css";

export default function OrdersPage() {
  return (
    <div>
      <h1 className="title">📋 Order Management</h1>

      <div className="card">
        <div className="card-content">
          <div className="has-text-centered" style={{ padding: "60px 20px" }}>
            <h2
              className="help"
              style={{ fontSize: "48px", marginBottom: "20px" }}
            >
              🚀 Coming Soon
            </h2>
            <p className="subtitle is-5" style={{ marginBottom: "10px" }}>
              Order Management System
            </p>
            <p className="help" style={{ marginBottom: "30px" }}>
              Complete order tracking, customer management, and shipping
              integration coming soon.
            </p>
            <div
              style={{
                backgroundColor: "#f0f8ff",
                border: "1px solid #3273dc",
                borderRadius: "8px",
                padding: "20px",
                marginTop: "30px",
                textAlign: "left",
                maxWidth: "500px",
                margin: "30px auto",
              }}
            >
              <h4 style={{ fontWeight: "bold", marginBottom: "15px" }}>
                📅 Planned Features:
              </h4>
              <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                <li>View all orders with filters</li>
                <li>
                  Order status tracking (pending, processing, shipped,
                  delivered)
                </li>
                <li>Shipment tracking integration</li>
                <li>Invoice generation</li>
                <li>Customer communication tools</li>
                <li>Order analytics and reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
