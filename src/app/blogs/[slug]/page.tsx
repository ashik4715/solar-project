import Link from "next/link";
import { notFound } from "next/navigation";
import "bulma/css/bulma.css";
import { PublicNav } from "@/components/PublicNav";
import { AppFooter } from "@/components/AppFooter";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { fetchSeoForPath } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogDetail = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  media?: { url: string; type: "image" | "video" }[];
  createdAt?: string;
};

async function getBlog(slug: string): Promise<BlogDetail | null> {
  await connectDB();
  const doc = (await Blog.findOne({ slug, isPublished: true }).lean()) as
    | (BlogDetail & { _id: string })
    | null;
  if (!doc) return null;

  return {
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary || "",
    content: doc.content || "",
    category: doc.category || "general",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    media: doc.media as BlogDetail["media"],
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as unknown as string).toISOString()
      : undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = await fetchSeoForPath(`/blogs/${slug}`);
  const blog = await getBlog(slug);
  if (!blog && !seo) {
    return { title: "Blog not found - Solar Store" };
  }
  if (seo) return seo;
  return {
    title: `${blog?.title} | Solar Store Blog`,
    description: blog?.summary?.slice(0, 140) || "Solar Store article",
    openGraph: {
      title: `${blog?.title} | Solar Store Blog`,
      description: blog?.summary?.slice(0, 140) || undefined,
      images:
        blog?.media?.find((m) => m.type === "image")?.url ||
        blog?.media?.[0]?.url
          ? [
              {
                url:
                  blog?.media?.find((m) => m.type === "image")?.url ||
                  blog?.media?.[0]?.url,
              },
            ]
          : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return notFound();

  const heroImage =
    blog.media?.find((m) => m.type === "image")?.url ||
    blog.media?.[0]?.url ||
    "";

  const formattedDate = blog.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(blog.createdAt))
    : undefined;

  const contentHtml =
    (blog.content
      ? blog.content.replace(/\n/g, "<br />")
      : blog.summary) || "Content coming soon.";

  return (
    <div style={{ backgroundColor: "#f7faf6", minHeight: "100vh" }}>
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
          <div className="container" style={{ maxWidth: "980px" }}>
            <p className="tag is-light is-medium" style={{ marginBottom: 10 }}>
              {blog.category}
            </p>
            <h1 className="title" style={{ color: "#fff", fontSize: "44px" }}>
              {blog.title}
            </h1>
            <p className="subtitle" style={{ color: "#e8f5e9" }}>
              {blog.summary || "Latest news from the Solar Store team."}
            </p>
            <div className="tags" style={{ gap: "8px" }}>
              {blog.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="tag is-success is-light"
                  style={{ textTransform: "capitalize" }}
                >
                  #{tag}
                </span>
              ))}
              {formattedDate ? (
                <span className="tag is-light">{formattedDate}</span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="columns">
            <div className="column is-8">
              {heroImage ? (
                <figure className="image is-16by9" style={{ marginBottom: 20 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt={blog.title}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #e0eadc",
                    }}
                  />
                </figure>
              ) : null}
              <article
                className="content"
                style={{
                  padding: "20px",
                  background: "#fff",
                  border: "1px solid #e0eadc",
                  borderRadius: "12px",
                  lineHeight: 1.7,
                }}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
            <div className="column is-4">
              <div
                className="box"
                style={{ border: "1px solid #e0eadc", background: "#fbfef9" }}
              >
                <p className="title is-6" style={{ color: "#2d5016" }}>
                  Quick links
                </p>
                <ul style={{ lineHeight: 2 }}>
                  <li>
                    <Link href="/blogs" className="has-text-success">
                      ← All blogs
                    </Link>
                  </li>
                  <li>
                    <Link href="/faqs" className="has-text-success">
                      FAQs &amp; Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="has-text-success">
                      Solar products
                    </Link>
                  </li>
                  <li>
                    <Link href="/after-sales" className="has-text-success">
                      After-sales service
                    </Link>
                  </li>
                </ul>
              </div>
              <div
                className="box"
                style={{
                  border: "1px solid #e0eadc",
                  background: "#fff",
                }}
              >
                <p className="title is-6" style={{ color: "#2d5016" }}>
                  Get a tailored quote
                </p>
                <p style={{ marginBottom: "12px" }}>
                  Need panels, batteries, or maintenance? We&apos;ll reply
                  within a business day.
                </p>
                <Link
                  href="/?openQuote=1"
                  className="button is-success is-fullwidth"
                >
                  Start a quote
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
