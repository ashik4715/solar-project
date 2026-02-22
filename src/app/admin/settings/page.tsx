"use client";

import React from "react";
import "bulma/css/bulma.css";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="title">⚙️ Site Settings</h1>
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
              Site Configuration
            </p>
            <p className="help" style={{ marginBottom: "30px" }}>
              Manage site-wide settings and configuration options coming soon.
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
                📅 Planned Settings:
              </h4>
              <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                <li>Site name and branding</li>
                <li>Logo and favicon upload</li>
                <li>Contact information</li>
                <li>Email configuration</li>
                <li>Payment gateway settings</li>
                <li>Tax and shipping rates</li>
                <li>Notification preferences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
