import { test, expect } from "@playwright/test";
import { use } from "../playwright.config";
const { chromium, devices } = require("playwright");



test.describe("Order sidePick PC user", () => {
  test.use({
    storageState: 'playwright/.auth/user.json',
  })
  test("test", async ({ page }) => {
    await page.goto("https://portal-dev.helios.supplies/dashboard");
    await expect(page).toHaveTitle(/Technitools portal/);
    await page.getByRole("link", { name: "Quotes & Orders" }).click();
    await expect(page.locator("body")).toContainText("Quotes & Orders");
    await expect(page.getByRole("button", { name: "Start RFQ" })).toBeVisible();
    await page.getByRole("button", { name: "Start RFQ" }).click();
    await page.getByRole("tab", { name: "History" }).click();
    await expect(page.getByLabel("History")).toContainText("requested an order");
    await page.close();
  });
})

test.describe("Order Table PC user", () => {
  
})

test.describe("Order Filter PC user", () => {
  
})