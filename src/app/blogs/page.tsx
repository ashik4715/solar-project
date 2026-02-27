import Link from "next/link";
import "bulma/css/bulma.css";
import { PublicNav } from "@/components/PublicNav";
import { AppFooter } from "@/components/AppFooter";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

type BlogMedia = { url: string; type: "image" | "video" };

type BlogCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  createdAt?: string;
  media?: BlogMedia[];
};

const highlights = [
  {
    icon: "🎛️",
    title: "Roles & Users",
    blurb:
      "Create custom roles with module-level create/read/update/delete permissions for tight control.",
  },
  {
    icon: "🛒",
    title: "Orders",
    blurb:
      "Mock orders, track fulfilment statuses, and export PDF invoices. S3 upload ready.",
  },
  {
    icon: "❓",
    title: "FAQs",
    blurb:
      "Manage categorized FAQs that surface instantly on the public help center.",
  },
  {
    icon: "📝",
    title: "Blogs",
    blurb:
      "Publish articles with categories and tags to grow organic traffic and educate shoppers.",
  },
  {
    icon: "💬",
    title: "Quotes",
    blurb: "Lightweight quote capture to keep leads flowing into your inbox.",
  },
  {
    icon: "🏷️",
    title: "SEO Tags",
    blurb: "Meta titles, descriptions, and keywords to keep search engines happy.",
  },
  {
    icon: "🖼️",
    title: "Media",
    blurb:
      "Carousel-ready images or videos with optional audio; S3 sync when keys are configured.",
  },
];

async function getBlogs(): Promise<BlogCard[]> {
  await connectDB();
  const posts = (await Blog.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean()) as any[];

  return posts.map((post) => ({
    id: String(post._id),
    title: post.title,
    slug: post.slug,
    summary: post.summary || "",
    category: post.category || "general",
    tags: Array.isArray(post.tags) ? post.tags : [],
    createdAt: post.createdAt
      ? new Date(post.createdAt as unknown as string).toISOString()
      : undefined,
    media: post.media as BlogMedia[],
  }));
}

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : undefined;

const firstImage = (media?: BlogMedia[]) =>
  media?.find((m) => m.type === "image")?.url || media?.[0]?.url || "";

export default async function BlogsPage() {
  const posts = await getBlogs();

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
          <div className="container" style={{ maxWidth: "1100px" }}>
            <p className="tag is-light is-medium" style={{ marginBottom: 10 }}>
              📝 Solar Store Journal
            </p>
            <h1 className="title" style={{ color: "#fff", fontSize: "48px" }}>
              Product updates, solar tips, and customer stories
            </h1>
            <p className="subtitle" style={{ color: "#e8f5e9", maxWidth: 760 }}>
              Stay ahead with feature releases, configuration guides, and
              inspiration from the teams running on Solar Store.
            </p>
            <div className="buttons">
              <Link href="/faqs" className="button is-light">
                Visit FAQs
              </Link>
              <Link
                href="/?openQuote=1"
                className="button is-success"
                style={{ backgroundColor: "#b6f6c4", color: "#21431b" }}
              >
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: "24px" }}>
        <div className="container" style={{ maxWidth: "1150px" }}>
          <h2 className="title is-4">Platform highlights</h2>
          <div className="columns is-multiline">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="column is-4-desktop is-6-tablet is-12-mobile"
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    border: "1px solid #e0eadc",
                    background: "#fff",
                  }}
                >
                  <div className="card-content">
                    <p style={{ fontSize: "32px", marginBottom: "8px" }}>
                      {item.icon}
                    </p>
                    <p
                      className="title is-5"
                      style={{ color: "#2d5016", marginBottom: "6px" }}
                    >
                      {item.title}
                    </p>
                    <p className="content" style={{ marginBottom: 0 }}>
                      {item.blurb}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container" style={{ maxWidth: "1150px" }}>
          <div className="level" style={{ marginBottom: "20px" }}>
            <div className="level-left">
              <div>
                <p className="title is-4" style={{ color: "#2d5016" }}>
                  Latest articles
                </p>
                <p className="subtitle is-6">
                  Fresh tips, releases, and use cases from the Solar Store team.
                </p>
              </div>
            </div>
            <div className="level-right">
              <span className="tag is-success is-light">
                {posts.length} live posts
              </span>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="notification is-light">
              No published articles yet. Check back soon!
            </div>
          ) : (
            <div className="columns is-multiline">
              {posts.map((post) => {
                const thumb = firstImage(post.media);
                return (
                  <div
                    key={post.id}
                    className="column is-4-desktop is-6-tablet is-12-mobile"
                  >
                    <div
                      className="card"
                      style={{
                        height: "100%",
                        border: "1px solid #e0eadc",
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {thumb ? (
                        <div className="card-image">
                          <figure className="image is-4by3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={thumb} alt={post.title} />
                          </figure>
                        </div>
                      ) : null}
                      <div
                        className="card-content"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                          }}
                        >
                          <span className="tag is-success is-light is-uppercase">
                            {post.category}
                          </span>
                          {post.createdAt ? (
                            <small className="has-text-grey">
                              {formatDate(post.createdAt)}
                            </small>
                          ) : null}
                        </div>
                        <p
                          className="title is-5"
                          style={{ color: "#1f3511", marginBottom: "6px" }}
                        >
                          {post.title}
                        </p>
                        <p className="content" style={{ flex: 1 }}>
                          {post.summary?.slice(0, 180) ||
                            "Read more about this update."}
                        </p>
                        <div
                          className="tags"
                          style={{ gap: "6px", marginBottom: "10px" }}
                        >
                          {post.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="tag is-light"
                              style={{ textTransform: "capitalize" }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blogs/${post.slug}`}
                          className="button is-success is-outlined is-fullwidth"
                          style={{ marginTop: "auto" }}
                        >
                          View more →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <AppFooter isDarkMode={false} />
    </div>
  );
}
