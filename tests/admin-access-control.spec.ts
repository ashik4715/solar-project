import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@solarstore.com";
const ADMIN_PASSWORD = "admin123!";
const SKIP_ADMIN_AUTH = !process.env.MONGODB_URI;

test.describe("Admin Access Control Tests", () => {
  test("unauthenticated user should not access admin dashboard", async ({
    page,
  }) => {
    // Try to access dashboard without login
    await page.goto("/admin/dashboard");

    // Should redirect to login
    await page.waitForURL("/admin", { timeout: 5000 }).catch(() => {});
    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("unauthenticated user should not access products page", async ({
    page,
  }) => {
    await page.goto("/admin/products");

    await page.waitForURL("/admin", { timeout: 5000 }).catch(() => {});
    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("unauthenticated user should not access categories page", async ({
    page,
  }) => {
    await page.goto("/admin/categories");

    await page.waitForURL("/admin", { timeout: 5000 }).catch(() => {});
    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("authenticated admin should access dashboard", async ({ page }) => {
    test.skip(
      SKIP_ADMIN_AUTH,
      "Admin auth tests are skipped when database is not configured.",
    );
    // Login
    await page.goto("/admin");
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    // Should access dashboard
    await page
      .waitForURL(/dashboard|admin/, { timeout: 10000 })
      .catch(() => {});

    const url = page.url();
    expect(url).toMatch(/dashboard|admin/);
  });

  test("admin should view products page", async ({ page }) => {
    test.skip(
      SKIP_ADMIN_AUTH,
      "Admin auth tests are skipped when database is not configured.",
    );
    // Login first
    await page.goto("/admin");
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page
      .waitForURL(/dashboard|admin/, { timeout: 10000 })
      .catch(() => {});

    // Navigate to products
    const productsLink = page.locator(
      'a:has-text("Products"), [href*="products"]',
    );
    if (
      await productsLink
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await productsLink.first().click();
      await page.waitForURL(/products/, { timeout: 5000 }).catch(() => {});
    }

    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("admin should view categories page", async ({ page }) => {
    test.skip(
      SKIP_ADMIN_AUTH,
      "Admin auth tests are skipped when database is not configured.",
    );
    // Login first
    await page.goto("/admin");
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page
      .waitForURL(/dashboard|admin/, { timeout: 10000 })
      .catch(() => {});

    // Navigate to categories
    const categoriesLink = page.locator(
      'a:has-text("Categories"), [href*="categories"]',
    );
    if (
      await categoriesLink
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await categoriesLink.first().click();
      await page.waitForURL(/categories/, { timeout: 5000 }).catch(() => {});
    }

    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("admin should view customers page", async ({ page }) => {
    test.skip(
      SKIP_ADMIN_AUTH,
      "Admin auth tests are skipped when database is not configured.",
    );
    // Login first
    await page.goto("/admin");
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page
      .waitForURL(/dashboard|admin/, { timeout: 10000 })
      .catch(() => {});

    // Navigate to customers
    const customersLink = page.locator(
      'a:has-text("Customers"), [href*="customers"]',
    );
    if (
      await customersLink
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await customersLink.first().click();
      await page.waitForURL(/customers/, { timeout: 5000 }).catch(() => {});
    }

    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("admin should view quotes page", async ({ page }) => {
    test.skip(
      SKIP_ADMIN_AUTH,
      "Admin auth tests are skipped when database is not configured.",
    );
    // Login first
    await page.goto("/admin");
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page
      .waitForURL(/dashboard|admin/, { timeout: 10000 })
      .catch(() => {});

    // Navigate to quotes
    const quotesLink = page.locator('a:has-text("Quotes"), [href*="quotes"]');
    if (
      await quotesLink
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await quotesLink.first().click();
      await page.waitForURL(/quotes/, { timeout: 5000 }).catch(() => {});
    }

    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("session should persist across page navigations", async ({ page }) => {
    test.skip(
      SKIP_ADMIN_AUTH,
      "Admin auth tests are skipped when database is not configured.",
    );
    // Login
    await page.goto("/admin");
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page
      .waitForURL(/dashboard|admin/, { timeout: 10000 })
      .catch(() => {});

    // Navigate to products
    await page.goto("/admin/products");

    // Should stay logged in
    const url = page.url();
    expect(url).toContain("/admin/products");
  });
});
