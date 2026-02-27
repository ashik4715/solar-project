import Link from "next/link";
import "bulma/css/bulma.css";
import { PublicNav } from "@/components/PublicNav";
import { AppFooter } from "@/components/AppFooter";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { fetchSeoForPath } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await fetchSeoForPath("/faqs");
  return (
    seo || {
      title: "FAQs - Solar Store",
      description: "Answers to common questions about Solar Store.",
    }
  );
}

async function getFaqs(): Promise<FaqItem[]> {
  await connectDB();
  const docs = (await FAQ.find({ isPublished: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean()) as any[];

  return docs.map((doc) => ({
    id: String(doc._id),
    question: doc.question,
    answer: doc.answer,
    category: doc.category || "general",
  }));
}

export default async function FAQsPage() {
  const faqs = await getFaqs();
  const uniqueCategories = Array.from(
    new Set(faqs.map((f) => f.category || "general")),
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f8f1" }}>
      <PublicNav />

      <section
        className="hero is-medium"
        style={{
          background:
            "linear-gradient(120deg, #2d5016 0%, #3b6a1f 45%, #1d3610 100%)",
          color: "#fff",
        }}
      >
        <div className="hero-body">
          <div className="container" style={{ maxWidth: "960px" }}>
            <p className="tag is-light is-medium" style={{ marginBottom: 12 }}>
              ❓ FAQs & Support
            </p>
            <h1 className="title" style={{ fontSize: "46px", color: "#fff" }}>
              Answers to keep your solar store running smoothly
            </h1>
            <p className="subtitle" style={{ color: "#e8f5e9", maxWidth: 680 }}>
              Browse by category, search for a keyword, or scan the highlights
              below. We keep this page synced with the latest support articles
              so you never hit a dead end.
            </p>
            <div className="tags" style={{ gap: "8px", flexWrap: "wrap" }}>
              {uniqueCategories.map((cat) => (
                <span
                  key={cat}
                  className="tag is-success is-light"
                  style={{ textTransform: "capitalize" }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "40px" }}>
        <div className="container" style={{ maxWidth: "980px" }}>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li className="is-active">
                <a aria-current="page">FAQs</a>
              </li>
            </ul>
          </nav>

          {faqs.length === 0 ? (
            <p className="has-text-grey">
              We&apos;re preparing FAQs. Check back soon!
            </p>
          ) : (
            <FaqAccordion faqs={faqs} />
          )}

          <div
            className="box"
            style={{
              marginTop: "30px",
              border: "1px solid #e0eadc",
              background: "#fff",
            }}
          >
            <div className="level">
              <div className="level-left">
                <div>
                  <p className="title is-5" style={{ color: "#2d5016" }}>
                    Still stuck?
                  </p>
                  <p className="subtitle is-6">
                    Our team replies in under 24 hours for most tickets.
                  </p>
                </div>
              </div>
              <div className="level-right">
                <Link
                  href="/after-sales"
                  className="button is-success"
                  style={{ backgroundColor: "#2d5016", color: "#fff" }}
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppFooter isDarkMode={false} />
    </div>
  );
}
