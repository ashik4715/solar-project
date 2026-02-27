"use client";

import React from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

export default function SEOPage() {
  return (
    <div>
      <h1 className="title">SEO Tags</h1>
      <div className="card">
        <div className="card-content">
          <p className="subtitle is-6">
            Manage per-page meta titles, descriptions, and social images.
          </p>
          <Link href="/admin/seo-tags" className="button is-primary is-light">
            Open SEO Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
