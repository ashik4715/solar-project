import Link from "next/link";

const linkStyle = { color: "#fff", fontWeight: 600 };

/**
 * Public navigation bar shared across marketing pages.
 */
export function PublicNav() {
  return (
    <nav
      className="navbar has-shadow"
      style={{ backgroundColor: "#2d5016", color: "#fff" }}
    >
      <div className="navbar-brand">
        <Link
          href="/"
          className="navbar-item"
          style={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}
        >
          ☀️ Solar Store
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <Link href="/" className="navbar-item" style={linkStyle}>
            Home
          </Link>
          <Link href="/products" className="navbar-item" style={linkStyle}>
            Products
          </Link>
          <Link href="/after-sales" className="navbar-item" style={linkStyle}>
            Support
          </Link>
          <Link href="/blogs" className="navbar-item" style={linkStyle}>
            Blogs
          </Link>
          <Link href="/faqs" className="navbar-item" style={linkStyle}>
            FAQs
          </Link>
          <Link
            href="/?openQuote=1"
            className="navbar-item button is-light is-small"
            style={{ margin: "8px" }}
          >
            💬 Get a Quote
          </Link>
          <Link href="/login" className="navbar-item" style={linkStyle}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
