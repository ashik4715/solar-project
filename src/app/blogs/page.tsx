"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bulma/css/bulma.css";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  isPublished: boolean;
  media?: { url: string; type: "image" | "video" }[];
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => setPosts(data.data || []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Blogs</h1>
        {posts.length === 0 ? (
          <p className="has-text-grey">No articles yet.</p>
        ) : (
          <div className="columns is-multiline">
            {posts.map((post) => {
              const thumb =
                post.media?.find((m) => m.type === "image")?.url ||
                post.media?.[0]?.url;
              return (
                <div key={post._id} className="column is-4">
                  <div className="card" style={{ height: "100%" }}>
                    {thumb && (
                      <div className="card-image">
                        <figure className="image is-4by3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt={post.title} />
                        </figure>
                      </div>
                    )}
                    <div className="card-content">
                      <p className="tag is-light">{post.category || "general"}</p>
                      <p className="title is-5" style={{ marginTop: "6px" }}>
                        {post.title}
                      </p>
                      <p className="content" style={{ fontSize: "14px" }}>
                        {post.summary?.slice(0, 140) || "Read more..."}
                      </p>
                      <Link href={`/blogs/${post.slug}`} className="button is-text is-small">
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
