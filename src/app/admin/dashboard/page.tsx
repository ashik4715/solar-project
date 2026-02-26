"use client";

import React, { useEffect, useState } from "react";
import "bulma/css/bulma.css";

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalProducts: 12,
    totalCustomers: 45,
    totalOrders: 23,
    totalRevenue: 8750000,
  });

  return (
    <div>
      <h1 className="title">Dashboard</h1>

      <div className="columns is-multiline">
        {[
          {
            label: "Total Products",
            value: stats.totalProducts,
            icon: "📦",
            color: "#3273dc",
          },
          {
            label: "Total Customers",
            value: stats.totalCustomers,
            icon: "👥",
            color: "#48c774",
          },
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: "📋",
            color: "#ffdd57",
          },
          {
            label: "Total Revenue",
            value: `৳${stats.totalRevenue.toLocaleString()}`,
            icon: "💰",
            color: "#f14668",
          },
        ].map((stat, i) => (
          <div key={i} className="column is-3">
            <div className="card" style={{ border: `3px solid ${stat.color}` }}>
              <div className="card-content">
                <p className="title">{stat.value}</p>
                <p className="heading">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "30px" }}>
        <div className="card-header">
          <p className="card-header-title">Recent Activity</p>
        </div>
        <div className="card-content">
          <p className="has-text-grey-light">
            No activity yet. Start by adding products or customers.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <div className="card-header">
          <p className="card-header-title">Admin Feature Guide</p>
        </div>
        <div className="card-content">
          <ul style={{ lineHeight: 1.5 }}>
            <li>🎛️ Roles & Users: Create custom roles with per-module create/read/update/delete access; assign roles to users.</li>
            <li>🛒 Orders: Create mock orders, update status, generate/download PDF invoices (uploads to S3 when configured).</li>
            <li>❓ FAQs: Manage questions with categories; published FAQs surface on the public FAQs page.</li>
            <li>🖼️ Media: Carousel images/videos with optional audio; sync to S3 if keys are set.</li>
            <li>⚙️ Settings: Site branding, contact info, payment keys (Stripe/PayPal/Bkash), logo & favicon upload.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
