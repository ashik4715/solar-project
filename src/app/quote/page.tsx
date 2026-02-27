import { PublicNav } from "@/components/PublicNav";
import { AppFooter } from "@/components/AppFooter";
import { QuoteForm } from "./QuoteForm";
import { fetchSeoForPath } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await fetchSeoForPath("/quote");
  return (
    seo || {
      title: "Get Your Free Solar Quote Today",
      description: "Request a tailored solar quote with panels, inverters, and batteries.",
    }
  );
}

export default async function QuotePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f8f1" }}>
      <PublicNav />
      <section
        className="hero is-medium"
        style={{
          background:
            "linear-gradient(120deg, #1f3511 0%, #2d5016 45%, #3a6c1f 100%)",
          color: "#fff",
        }}
      >
        <div className="hero-body">
          <div className="container" style={{ maxWidth: "960px" }}>
            <p className="tag is-light is-medium" style={{ marginBottom: 10 }}>
              📋 Get Your Free Solar Quote Today
            </p>
            <h1 className="title" style={{ color: "#fff", fontSize: "46px" }}>
              Fast, no‑obligation pricing tailored to your roof
            </h1>
            <p className="subtitle" style={{ color: "#e8f5e9", maxWidth: 720 }}>
              Tell us a few details and we’ll email a custom quote with the best
              panel, inverter, and battery options for your needs.
            </p>
          </div>
        </div>
      </section>

      <QuoteForm />

      <AppFooter isDarkMode={false} />
    </div>
  );
}
