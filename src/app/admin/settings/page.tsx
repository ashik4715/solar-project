"use client";

import React, { useEffect, useState, useCallback } from "react";
import "bulma/css/bulma.css";

interface Settings {
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  paypalBusinessId?: string;
  stripePublicKey?: string;
  stripeSecretKey?: string;
  bkashMerchantId?: string;
  paymentNotes?: string;
  tinymceApiKey?: string;
  taxRate?: number;
  shippingRate?: number;
  notificationEmail?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "Solar Store",
    taxRate: 0,
    shippingRate: 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    if (data.data) setSettings({ ...settings, ...data.data });
  }, [settings]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (!res.ok) return alert("Failed to save settings");
    alert("Settings saved");
  };

  const handleUpload = async (
    file: File | null,
    target: "logoUrl" | "faviconUrl",
  ) => {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    setUploading(false);
    if (!res.ok) {
      alert("Upload failed");
      return;
    }
    const data = await res.json();
    const url = data.data?.url || data.data;
    if (url) handleChange(target, url);
  };

  return (
    <div>
      <h1 className="title">Site Configuration</h1>
      <form onSubmit={handleSave}>
        <div className="columns">
          <div className="column is-6">
            <div className="field">
              <label className="label">Site Name</label>
              <input
                className="input"
                value={settings.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label">Logo URL</label>
              <input
                className="input"
                value={settings.logoUrl || ""}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
              />
              <div className="file is-small" style={{ marginTop: "8px" }}>
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleUpload(e.target.files?.[0] || null, "logoUrl")
                    }
                  />
                  <span className="file-cta">
                    <span className="file-label">
                      {uploading ? "Uploading..." : "Upload Logo"}
                    </span>
                  </span>
                </label>
              </div>
            </div>
            <div className="field">
              <label className="label">Favicon URL</label>
              <input
                className="input"
                value={settings.faviconUrl || ""}
                onChange={(e) => handleChange("faviconUrl", e.target.value)}
              />
              <div className="file is-small" style={{ marginTop: "8px" }}>
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleUpload(e.target.files?.[0] || null, "faviconUrl")
                    }
                  />
                  <span className="file-cta">
                    <span className="file-label">
                      {uploading ? "Uploading..." : "Upload Favicon"}
                    </span>
                  </span>
                </label>
              </div>
            </div>
            <div className="field">
              <label className="label">Contact Email</label>
              <input
                className="input"
                value={settings.contactEmail || ""}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label">Contact Phone</label>
              <input
                className="input"
                value={settings.contactPhone || ""}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label">Address</label>
              <textarea
                className="textarea"
                value={settings.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
          <div className="column is-6">
            <div className="field">
              <label className="label">PayPal Business ID</label>
              <input
                className="input"
                value={settings.paypalBusinessId || ""}
                onChange={(e) =>
                  handleChange("paypalBusinessId", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label className="label">Stripe Publishable Key</label>
              <input
                className="input"
                value={settings.stripePublicKey || ""}
                onChange={(e) =>
                  handleChange("stripePublicKey", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label className="label">Stripe Secret Key</label>
              <input
                className="input"
                value={settings.stripeSecretKey || ""}
                onChange={(e) =>
                  handleChange("stripeSecretKey", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label className="label">Bkash Merchant ID</label>
              <input
                className="input"
                value={settings.bkashMerchantId || ""}
                onChange={(e) =>
                  handleChange("bkashMerchantId", e.target.value)
                }
              />
            </div>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <label className="label">Tax Rate (%)</label>
                  <input
                    className="input"
                    type="number"
                    value={settings.taxRate ?? 0}
                    onChange={(e) =>
                      handleChange("taxRate", Number(e.target.value))
                    }
                  />
                </div>
                <div className="field">
                  <label className="label">Shipping Rate</label>
                  <input
                    className="input"
                    type="number"
                    value={settings.shippingRate ?? 0}
                    onChange={(e) =>
                      handleChange("shippingRate", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Notification Email</label>
              <input
                className="input"
                value={settings.notificationEmail || ""}
                onChange={(e) =>
                  handleChange("notificationEmail", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label className="label">Payment Notes</label>
              <textarea
                className="textarea"
                value={settings.paymentNotes || ""}
                onChange={(e) =>
                  handleChange("paymentNotes", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label className="label">TinyMCE API Key</label>
              <input
                className="input"
                value={settings.tinymceApiKey || ""}
                onChange={(e) =>
                  handleChange("tinymceApiKey", e.target.value)
                }
                placeholder="Enter your TinyMCE cloud API key"
              />
            </div>
          </div>
        </div>
        <button className={`button is-success ${saving ? "is-loading" : ""}`}>
          Save Settings
        </button>
      </form>
    </div>
  );
}
