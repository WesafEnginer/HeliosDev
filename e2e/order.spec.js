import { test, expect } from "@playwright/test";
import { OrderPage } from "../Page/orderPage";

test.beforeEach(async ({ page }) => {
  await page.goto("https://portal-dev.helios.supplies/");
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe("Order sidePick PC user", () => {
  test.use({
    storageState: "playwright/.auth/user.json",
  });
  test("check if RFQ fields update in history after deletion", async ({
    page,
  }) => {
    try {
      const orderPage = new OrderPage(page);
      await expect(page).toHaveTitle(/Technitools portal/); // Verify the page title
      await page.getByRole("link", { name: "Quotes & Orders" }).click(); // Navigate to Quotes & Orders
      await expect(page.locator("body")).toContainText("Quotes & Orders");
      await orderPage.startRFQ();
      const orderId = await orderPage.getUniqueOrderId();

      // Fill out RFQ form
      await orderPage.selectAgent("test admin");
      await orderPage.selectUrgency("Urgent ASAP");
      await orderPage.enterShippingAddress("test street 123");
      await orderPage.enterPONumber("123");
      await orderPage.enterOrderDetails("test");

      // Add product to order
      await orderPage.searchAndAddProduct(
        "MCR Safety 9699S UltraTech® 9699 Dipped General Purpose Gloves, Coated, Standard Finger Style, S, HPT™ Palm, 15 ga Nylon, Black/Blue, Knit Wrist Cuff, HPT™ Coating, Resists: Abrasion, Cut, Puncture and Tear, Nylon Lining"
      );

      // Verify product is added to order
      const orderSummaryText = await page.textContent(
        "//div[@title='MCR Safety 9699S UltraTech® 9699 Dipped General Purpose Gloves, Coated, Standard Finger Style, S, HPT™ Palm, 15 ga Nylon, Black/Blue, Knit Wrist Cuff, HPT™ Coating, Resists: Abrasion, Cut, Puncture and Tear, Nylon Lining']"
      );
      expect(orderSummaryText).toContain(
        "MCR Safety 9699S UltraTech® 9699 Dipped General Purpose Gloves, Coated, Standard Finger Style, S, HPT™ Palm, 15 ga Nylon, Black/Blue, Knit Wrist Cuff, HPT™ Coating, Resists: Abrasion, Cut, Puncture and Tear, Nylon Lining"
      );

      await orderPage.addToOrder();

      // Verify product is added successfully
      const orderSummaryTextAfterAdd = await page.textContent(
        "//table[@class='caption-bottom text-sm w-full']"
      );
      expect(orderSummaryTextAfterAdd).toContain(
        "MCR Safety 9699S UltraTech® 9699 Dipped General Purpose Gloves, Coated, Standard Finger Style, S, HPT™ Palm, 15 ga Nylon, Black/Blue, Knit Wrist Cuff, HPT™ Coating, Resists: Abrasion, Cut, Puncture and Tear, Nylon Lining"
      );

      // Switch to History tab
      await orderPage.navigateToHistory();

      // Verify history entries
      const historyElement = await page.getByLabel("History");

      await expect(historyElement).toContainText(
        "Mikle Jobsrequested an order"
      );
      await expect(historyElement).toContainText(
        'Agent changed to "Test Admin"'
      );
      await expect(historyElement).toContainText(
        'Urgency changed from "No rush" to "Urgent ASAP"'
      );
      await expect(historyElement).toContainText(
        'Address changed to "test street 123"'
      );
      await expect(historyElement).toContainText('PO Number changed to "123"');
      await expect(historyElement).toContainText(
        'Description changed to "test"'
      );

      // close order
      await page.locator(".sticky > .flex > button").first().click();

      // Delete order
      await orderPage.deleteOrder(orderId);

      // Verify order is deleted
      await expect(page.getByRole("row", { name: orderId })).not.toBeVisible();
    } catch (error) {
      console.error("An error occurred:", error);
      // await page.screenshot({ path: 'error.png' });
      throw error; // Re-throw the error
    }
  });
});

test.describe("Order filtering PC user", () => {
  test.afterEach(async ({ page }) => {
    await page.close();
  });
  test.use({
    storageState: "playwright/.auth/user.json",
  });
  test("Search for an order by id", async ({ page }) => {
    const id = "CJRL9BWG"; // Replace with the desired order ID

    await expect(page).toHaveTitle(/Technitools portal/); // Verify the page title
    await page.getByRole("link", { name: "Quotes & Orders" }).click(); // Navigate to Quotes & Orders

    await page
      .getByLabel("Overview")
      .getByPlaceholder("Type to search...")
      .click(); // Open the search input
    await page
      .getByLabel("Overview")
      .getByPlaceholder("Type to search...")
      .fill(id); // Enter the order ID
    await page
      .getByLabel("Overview")
      .getByPlaceholder("Type to search...")
      .press("Enter"); // Submit the search

    await expect(page.locator("tbody")).toContainText(id); // Verify the order ID is displayed
  });

  test("Search for an order by name", async ({ page }) => {
    const nameOrder = "Z"; // Replace with the desired order name

    await expect(page).toHaveTitle(/Technitools portal/); // Verify the page title
    await page.getByRole("link", { name: "Quotes & Orders" }).click(); // Navigate to Quotes & Orders

    await page
      .getByLabel("Overview")
      .getByPlaceholder("Type to search...")
      .click(); // Open the search input
    await page
      .getByLabel("Overview")
      .getByPlaceholder("Type to search...")
      .fill(nameOrder); // Enter the order name
    await page
      .getByLabel("Overview")
      .getByPlaceholder("Type to search...")
      .press("Enter"); // Submit the search

    await expect(page.locator("tbody")).toContainText(nameOrder); // Verify the order name is displayed
  });

  test("Filter by status", async ({ page }) => {
    await expect(page).toHaveTitle(/Technitools portal/); // Verify the page title
    await page.getByRole("link", { name: "Quotes & Orders" }).click(); // Navigate to Quotes & Orders

    await page.getByRole("button", { name: "status", exact: true }).click(); // Open the status dropdown
    await expect(page.getByRole("dialog")).toBeVisible(); // Verify the status dropdown is open

    await page.getByPlaceholder("status").click(); // Open the status search input in the dropdown
    await page.getByPlaceholder("status").fill("Open RFQ"); // Enter the status
    await expect(
      page.getByRole("option", { name: "Open RFQ" }).locator("div")
    ).toBeVisible(); // Verify the status is displayed

    await page.getByRole("option", { name: "Open RFQ" }).locator("div").click(); // Select the status

    await expect(
      page.getByRole("button", { name: "status Open RFQ" })
    ).toBeVisible();
    await expect(page.getByLabel("Overview")).toContainText("Open RFQ"); // Verify the status is displayed in button stattus

    await page.waitForTimeout(2000);

    const tableRows = await page.locator("tbody tr").count();
    for (let i = 0; i < tableRows; i++) {
      const rowStatus = await page
        .locator(`tbody tr:nth-child(${i + 1}) td:nth-child(2)`)
        .innerText();
      await expect(rowStatus).toBe("Open RFQ");
    }
  });

  test("Filter by multiple statuses", async ({ page }) => {
    const statuses = ["Open RFQ", "Submitted", "Canceled"]; // Replace with the desired statuses

    await expect(page).toHaveTitle(/Technitools portal/); // Verify the page title
    await page.getByRole("link", { name: "Quotes & Orders" }).click(); // Navigate to Quotes & Orders

    await page.getByRole("button", { name: "status", exact: true }).click(); // Open the status dropdown
    await expect(page.getByRole("dialog")).toBeVisible(); // Verify the status dropdown is open

    for (const status of statuses) {
      // Open the status search input in the dropdown
      const searchInput = await page.getByPlaceholder("status");
      await searchInput.click();
      await searchInput.fill(status);

      // Verify that the status is displayed in the dropdown
      await expect(
        page.getByRole("option", { name: status }).locator("div")
      ).toBeVisible();

      // Click on the status
      await page.getByRole("option", { name: status }).locator("div").click();

      // Clear the search input
      await searchInput.clear();
    }

    await page.waitForTimeout(3000);

    // Verify that the status is displayed in the table for each row
    const tableRows = await page.locator("tbody tr").count();
    for (let i = 0; i < tableRows; i++) {
      const rowStatus = await page
        .locator(`tbody tr:nth-child(${i + 1}) td:nth-child(2)`)
        .innerText();
      expect(statuses.includes(rowStatus)).toBeTruthy();
    }
  });
});
