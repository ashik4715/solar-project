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
            href="/quote"
            className="navbar-item button is-light is-medium"
            style={{ margin: "8px" }}
          >
            💬 Get a Quote
          </Link>
          <Link
            href="/login"
            className="navbar-item button is-ghost is-medium"
            style={{ color: "#fff" }}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="navbar-item button is-success is-medium"
            style={{ marginLeft: "6px" }}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
