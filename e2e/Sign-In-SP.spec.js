// @ts-check
const { test, expect } = require("@playwright/test");
const { chromium, devices } = require("playwright");

test.describe.configure({ mode: "parallel" });

test.describe("Tests for Sign in PC user Browser Chrome", () => {
  test.use({ colorScheme: "dark" });
  const authFile = "playwright/.auth/user.json";

  test("Valid credentials", async ({ page }) => {
    await page.goto("https://portal-dev.helios.supplies/sign-in");
    await page
      .getByPlaceholder("name@example.com")
      .fill("user10+clerk_test@test.com");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByPlaceholder("password").fill("ad301198");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page).toHaveTitle(/Technitools portal/);
    await expect(page.locator("body")).toContainText("Helios");
    await page.context().storageState({ path: authFile });
    await page.close();
  });

  test("Invalid credentials", async ({ page }) => {
    await page.goto("https://portal-dev.helios.supplies/sign-in");
    await page.getByPlaceholder("name@example.com").fill("test123@ss.com");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.getByText("No account? Sign upContinue")).toBeVisible();
    await expect(page.locator("form")).toContainText(
      "No account? Sign upContinue"
    );
    await page.close();
  });
});

test.describe("Tests for Sign in Mobile user Browser Chrome", () => {
  test.use({ viewport: { width: 430, height: 932 } });

  test("Valid credentials", async ({ page }) => {
    await page.goto("https://portal-dev.helios.supplies/sign-in");
    const browser = await chromium.launch();

    const iphone13 = devices["iPhone 13"];
    const context = await browser.newContext({
      ...iphone13,
    });
    await page
      .getByPlaceholder("name@example.com")
      .fill("user10+clerk_test@test.com");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByPlaceholder("password").fill("ad301198");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page).toHaveTitle(/Technitools portal/);
    await page.close();
  });

  test("Invalid credentials", async ({ page }) => {
    await page.goto("https://portal-dev.helios.supplies/sign-in");
    const browser = await chromium.launch();

    const iphone13 = devices["iPhone 13"];
    const context = await browser.newContext({
      ...iphone13,
    });
    await page.getByPlaceholder("name@example.com").fill("test123@ss.com");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.getByText("No account? Sign upContinue")).toBeVisible();
    await expect(page.locator("form")).toContainText(
      "No account? Sign upContinue"
    );
    await page.close();
  });
});
