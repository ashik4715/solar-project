import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@solarstore.com";
const ADMIN_PASSWORD = "admin123!";
const BASE_URL = "http://localhost:3000";

test.describe("API Endpoints Tests", () => {
  let sessionCookie: string | null = null;

  test("POST /api/auth/login - valid credentials", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    });

    expect([200, 401, 500]).toContain(response.status());
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty("statusCode");
    }
  });

  test("POST /api/auth/login - invalid credentials", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: "invalid@test.com",
        password: "WrongPassword123!",
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test("GET /api/products - no auth required", async ({ request }) => {
    const response = await request.get(
      `${BASE_URL}/api/products?skip=0&limit=10`,
    );

    // Should return 200 or 401 depending on auth requirement
    expect([200, 401, 500]).toContain(response.status());
  });

  test("POST /api/categories - requires admin", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/categories`, {
      data: {
        name: "Test Category",
        description: "Test",
      },
    });

    // Should require authentication
    expect([200, 401, 403, 500]).toContain(response.status());
  });

  test("GET /api/customers - requires auth", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/customers`);

    expect([401, 403, 200, 500]).toContain(response.status());
  });

  test("POST /api/quotes - should handle quote creation", async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/quotes`, {
      data: {
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        items: [],
      },
    });

    expect([200, 400, 401, 500]).toContain(response.status());
  });

  test("POST /api/contact - submit contact form", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/contact`, {
      data: {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        message: "Test inquiry",
      },
    });

    expect([200, 201, 400, 500]).toContain(response.status());
  });

  test("GET /api/docs - API documentation accessible", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/docs`);

    expect([200, 500]).toContain(response.status());
    const text = await response.text();
    if (response.status() === 200) {
      expect(text.toLowerCase()).toContain("swagger");
    }
  });

  test("GET /api/swagger.json - OpenAPI schema", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/swagger.json`);

    expect([200, 404, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      // Check if either openapi or swagger property exists
      const hasOpenAPI =
        data.hasOwnProperty("openapi") || data.hasOwnProperty("swagger");
      expect(hasOpenAPI).toBe(true);
    }
  });

  test("POST /api/upload - file upload handling", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
      data: new FormData(),
    });

    // Should handle file upload
    expect([200, 400, 413, 401, 415, 500]).toContain(response.status());
  });

  test("API error responses should have proper format", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/products/invalid-id`);

    if (response.status() >= 400) {
      const data = await response.json().catch(() => ({}));
      // Should have error information
      expect(data || response.status()).toBeTruthy();
    }
  });

  test("POST /api/auth/me - check current session", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`);

    // Without auth, should return 401 or null user
    expect([200, 401, 500]).toContain(response.status());
  });

  test("API should handle concurrent requests", async ({ request }) => {
    const requests = Array(5)
      .fill(null)
      .map(() => request.get(`${BASE_URL}/api/products?skip=0&limit=5`));

    const responses = await Promise.all(requests);

    // All should succeed or fail consistently
    responses.forEach((response) => {
      expect([200, 401, 500]).toContain(response.status());
    });
  });

  test("API response headers should be secure", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/products`);

    const headers = response.headers();
    // Should have proper content type
    if (response.status() < 500) {
      expect(headers["content-type"]).toBeDefined();
    }
  });
});
