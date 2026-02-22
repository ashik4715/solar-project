"use client";

import React from "react";
import "bulma/css/bulma.css";

export default function SEOPage() {
  return (
    <div>
      <h1 className="title">🔍 SEO Management</h1>
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
              SEO Tags & Meta Management
            </p>
            <p className="help" style={{ marginBottom: "30px" }}>
              Manage SEO tags and meta information for all pages coming soon.
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
                <li>Manage page title and meta descriptions</li>
                <li>Meta keywords management</li>
                <li>Open Graph tags (social sharing)</li>
                <li>Structured data / Schema markup</li>
                <li>Robots.txt configuration</li>
                <li>Sitemap generation</li>
                <li>SEO audit and recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
