export class OrderPage {
  constructor(page) {
    this.page = page;
  }

  // Navigates to the Quotes & Orders page
  async navigateToQuotesAndOrders() {
    await this.page.goto("https://portal-dev.helios.supplies/orders");
  }

  // Starts a Request for Quote (RFQ)
  async startRFQ() {
    await this.page.getByRole("button", { name: "Start RFQ" }).click();
  }

  // Retrieves the unique order ID from the sidePick order
  async getUniqueOrderId() {
    const divElement = await this.page.locator(
      ".pl-1.text-sm.uppercase.text-slate-400"
    );
    const divText = await divElement.textContent();
    return divText;
  }

  // Selects an agent from the dropdown list
  async selectAgent(agentName) {
    await this.page
      .locator("button")
      .filter({ hasText: "No Preference" })
      .click();
    await this.page.getByPlaceholder("Search by agent").fill(agentName);
    await this.page.click(`text=${agentName}`);
  }

  // Selects the urgency of the order
  async selectUrgency(urgency) {
    await this.page.locator("button").filter({ hasText: "No rush" }).click();
    await this.page.click(`text=${urgency}`);
  }

  // Enters the shipping address for the order
  async enterShippingAddress(address) {
    await this.page.getByText("No shipping address...").click();
    await this.page.fill('[placeholder="Enter shipping address"]', address);
  }

  // Enters the PO (Purchase Order) number for the order
  async enterPONumber(poNumber) {
    await this.page.getByText("No PO number...").click();
    await this.page.fill('[placeholder="Enter PO number"]', poNumber);
  }

  // Enters details for the order
  async enterOrderDetails(details) {
    await this.page.getByText("No details entered...").click();
    await this.page.fill('[placeholder="Enter order details"]', details);
  }

  // Searches for a product from sidePick order and adds it to the order
  async searchAndAddProduct(productName) {
    await this.page.getByRole("button", { name: "Add product" }).click();
    await this.page.fill(
      '[placeholder="Type to search product..."]',
      productName
    );
    await this.page.getByRole("button", { name: "Add to order" }).click();
  }

  // Adds the product to the order
  async addToOrder() {
    await this.page.getByRole("button", { name: "Add to order" }).click();
  }

  // Navigates to the History tab
  async navigateToHistory() {
    await this.page.getByRole("tab", { name: "History" }).click();
  }

  // Deletes the order with the specified ID
  async deleteOrder(orderId) {
    const row = await this.page.getByRole("row", { name: orderId });
    const kebabMenuButton = await row.getByRole("button", {
      name: "Open menu",
    });
    await kebabMenuButton.click();
    await this.page.getByRole("button", { name: "Delete" }).click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }
}
