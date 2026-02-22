"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchQuotes();
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
        alert("Quote sent successfully!");
        fetchQuotes();
      }
    } catch (error) {
      alert("Error sending quote");
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

  return (
    <div>
      <h1 className="title">Quotes ({quotes.length})</h1>

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
