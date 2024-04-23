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
    const orderPage = new OrderPage(page);
    await expect(page).toHaveTitle(/Technitools portal/);
    await expect(page.locator("body")).toContainText("Quotes & Orders");
    await orderPage.navigateToQuotesAndOrders();
    await expect(page.getByRole("button", { name: "Start RFQ" })).toBeVisible();
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

    await expect(historyElement).toContainText("Mikle Jobsrequested an order");
    await expect(historyElement).toContainText('Agent changed to "Test Admin"');
    await expect(historyElement).toContainText(
      'Urgency changed from "No rush" to "Urgent ASAP"'
    );
    await expect(historyElement).toContainText(
      'Address changed to "test street 123"'
    );
    await expect(historyElement).toContainText('PO Number changed to "123"');
    await expect(historyElement).toContainText('Description changed to "test"');
    
    // close order
    await page.locator(".sticky > .flex > button").first().click();

    // Delete order
    await orderPage.deleteOrder(orderId);

    // Verify order is deleted
    await expect(page.getByRole("row", { name: orderId })).not.toBeVisible();
  });
});
