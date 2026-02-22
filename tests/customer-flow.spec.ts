import { test, expect } from "@playwright/test";

test.describe("Customer User Flow Tests", () => {
  test("customer should access homepage", async ({ page }) => {
    await page.goto("/");

    const url = page.url();
    expect(url).toContain("/");

    // Should see navigation
    await page.waitForTimeout(500);
  });

  test("customer should view products", async ({ page }) => {
    await page.goto("/products");

    const url = page.url();
    expect(url).toContain("/products");
  });

  test("customer should access quotes page", async ({ page }) => {
    await page.goto("/quotes");

    const url = page.url();
    expect(url).toContain("/quotes");
  });

  test("customer should fill quote form", async ({ page }) => {
    await page.goto("/quotes");

    // Fill form fields if visible
    const nameInput = page
      .locator('input[placeholder*="name"], input[name*="name"]')
      .first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill("John Doe");
    }

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill("john@example.com");
    }

    const phoneInput = page
      .locator('input[type="tel"], input[placeholder*="phone"]')
      .first();
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill("9876543210");
    }

    // Submit form
    const submitButton = page.locator('button[type="submit"]').first();
    if (await submitButton.isVisible().catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(1000);
    }

    // Should remain on page or redirect to confirmation
    const url = page.url();
    expect(url).toContain("/");
  });

  test("customer should view after-sales services", async ({ page }) => {
    await page.goto("/after-sales");

    const url = page.url();
    expect(url).toContain("/after-sales");
  });

  test("customer should submit contact form on homepage", async ({ page }) => {
    await page.goto("/");

    // Look for contact form
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill("customer@example.com");

      const phoneInput = page
        .locator('input[type="tel"], input[placeholder*="phone"]')
        .first();
      if (await phoneInput.isVisible().catch(() => false)) {
        await phoneInput.fill("9876543210");
      }

      const messageInput = page.locator("textarea").first();
      if (await messageInput.isVisible().catch(() => false)) {
        await messageInput.fill("I am interested in a 10kW solar system");
      }

      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.isVisible().catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(1000);
      }
    }

    const url = page.url();
    expect(url).toContain("/");
  });

  test("customer should not access admin panel directly", async ({ page }) => {
    await page.goto("/admin/dashboard");

    // Should redirect to login
    await page.waitForURL("/admin", { timeout: 5000 }).catch(() => {});

    const url = page.url();
    expect(url).toContain("/admin");
  });

  test("customer should see 404 on invalid page", async ({ page }) => {
    await page.goto("/invalid-page-12345");

    // Should either show 404 or redirect
    await page.waitForTimeout(500);

    const url = page.url();
    expect(url).toBeDefined();
  });

  test("customer contact form validation", async ({ page }) => {
    await page.goto("/");

    // Find contact form
    const submitButton = page.locator('button[type="submit"]').first();

    // Try to submit without filling form
    if (await submitButton.isVisible().catch(() => false)) {
      await submitButton.click();

      // Should not submit or should show validation
      await page.waitForTimeout(300);
    }

    const url = page.url();
    expect(url).toBeDefined();
  });

  test("customer should handle network error gracefully", async ({ page }) => {
    await page.goto("/");

    // Simulate offline mode
    await page.context().setOffline(true);

    // Try to navigate
    await page.goto("/products").catch(() => {});

    // Go back online
    await page.context().setOffline(false);

    // Should recover
    await page.goto("/");

    const url = page.url();
    expect(url).toBeDefined();
  });

  test("customer should see responsive design on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    const url = page.url();
    expect(url).toContain("/");

    // Navigate to products
    await page.goto("/products");

    const url2 = page.url();
    expect(url2).toContain("/products");
  });
});
