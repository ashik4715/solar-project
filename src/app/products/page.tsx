"use client";

import React from "react";
import "bulma/css/bulma.css";

export default function ProductsPage() {
  return (
    <div>
      <h1 className="title">Products</h1>
      <div className="columns">
        <div className="column is-3">
          <div className="card">
            <div className="card-image">
              <figure className="image is-4by3">
                <div style={{ backgroundColor: "#ddd", height: "200px" }} />
              </figure>
            </div>
            <div className="card-content">
              <p className="title is-5">6.6kW Solar Panel</p>
              <p className="subtitle is-6">₹3,90,000</p>
              <button className="button is-info is-fullwidth">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
