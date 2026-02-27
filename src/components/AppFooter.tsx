import Link from "next/link";

export function AppFooter({ isDarkMode }: { isDarkMode: boolean }) {
  const bgColor = isDarkMode ? "#1a1a1a" : "#f5f5f5";
  const textColor = isDarkMode ? "#e0e0e0" : "#333";
  const borderColor = isDarkMode ? "#444" : "#e0e0e0";

  return (
    <footer
      style={{
        backgroundColor: bgColor,
        borderTop: `1px solid ${borderColor}`,
        padding: "40px 20px",
        marginTop: "60px",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <div className="columns">
          {/* Column 1: Quick Links */}
          <div className="column is-one-quarter">
            <h5
              style={{
                color: textColor,
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Quick Links
            </h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/products"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Products
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/quotes"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Quotes
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/after-sales"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Account */}
          <div className="column is-one-quarter">
            <h5
              style={{
                color: textColor,
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Account
            </h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/login"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Login
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/register"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Register
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/admin/login"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="column is-one-quarter">
            <h5
              style={{
                color: textColor,
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Resources
            </h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "8px" }}>
                <a
                  href="#"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Documentation
                </a>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/blogs"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Blogs
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  href="/faqs"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  FAQ
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <a
                  href="#"
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="column is-one-quarter">
            <h5
              style={{
                color: textColor,
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Contact
            </h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "8px", color: textColor }}>
                📧 support@solarstore.com
              </li>
              <li style={{ marginBottom: "8px", color: textColor }}>
                📱 +1 (555) 123-4567
              </li>
              <li style={{ marginBottom: "8px", color: textColor }}>
                📍 123 Solar Lane, Green City
              </li>
              <li style={{ marginBottom: "8px", color: textColor }}>
                ⏰ Mon-Fri 9AM-6PM EST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            borderTop: `1px solid ${borderColor}`,
            paddingTop: "20px",
            marginTop: "30px",
            textAlign: "center",
            color: textColor,
          }}
        >
          <p style={{ marginBottom: "10px" }}>
            © 2024 Solar Store. All rights reserved. | Built with ☀️ for
            sustainable future
          </p>
          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            <a href="#" style={{ color: "#4CAF50", marginRight: "15px" }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: "#4CAF50", marginRight: "15px" }}>
              Terms of Service
            </a>
            <a href="#" style={{ color: "#4CAF50" }}>
              Cookies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
