export class OrderPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToQuotesAndOrders() {
    await this.page.goto("https://portal-dev.helios.supplies/orders");
  }

  async startRFQ(page) {
    await this.page.getByRole("button", { name: "Start RFQ" }).click();;
  }

  async getUniqueOrderId() {
    const divElement = await this.page.locator(
      ".pl-1.text-sm.uppercase.text-slate-400"
    );
    const divText = await divElement.textContent();
    return divText;
  }

  async selectAgent(agentName) {
    await this.page.locator("button").filter({ hasText: "No Preference" }).click();
    await this.page.getByPlaceholder("Search by agent").fill(agentName);
    await this.page.click(`text=${agentName}`);
  }

  async selectUrgency(urgency) {
    await this.page.locator("button").filter({ hasText: "No rush" }).click();
    await this.page.click(`text=${urgency}`);
  }

  async enterShippingAddress(address) {
    await this.page.getByText("No shipping address...").click();
    await this.page.fill('[placeholder="Enter shipping address"]', address);
  }

  async enterPONumber(poNumber) {
    await this.page.getByText("No PO number...").click();
    await this.page.fill('[placeholder="Enter PO number"]', poNumber);
  }

  async enterOrderDetails(details) {
    await this.page.getByText("No details entered...").click();
    await this.page.fill('[placeholder="Enter order details"]', details);
  }

  async searchAndAddProduct(productName) {
    await this.page.getByRole("button", { name: "Add product" }).click();
    await this.page.fill('[placeholder="Type to search product..."]', productName);
    await this.page.getByRole("button", { name: "Add to order" }).click();
  }
  
  async addToOrder() {
    await this.page.getByRole("button", { name: "Add to order" }).click();
  }

  async navigateToHistory() {
    await this.page.getByRole("tab", { name: "History" }).click();
  }

  async deleteOrder(orderId) {
    const row = await this.page.getByRole("row", { name: orderId});
    const kebabMenuButton = await row.getByRole("button", {
      name: "Open menu",
    });
    await kebabMenuButton.click();
    await this.page.getByRole("button", { name: "Delete" }).click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }
}
