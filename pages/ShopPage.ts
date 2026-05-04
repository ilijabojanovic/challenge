import { type Locator, type Page, expect } from "@playwright/test";
import { formatCartTotal } from "../test-data/helpers";

export class ShopPage {
  readonly page: Page;
  readonly productSection: Locator;
  readonly cartItems: Locator;
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productSection = page.locator("#prooood");
    this.cartItems = page.locator(".cart-items");
    this.cartRows = this.cartItems.locator(".cart-row");
    this.proceedToCheckoutButton = page.getByRole("button", {
      name: "PROCEED TO CHECKOUT",
    });
    this.cartTotal = page.locator(".cart-total-price");
  }

  async expectShopVisible(): Promise<void> {
    await expect(this.productSection).toBeVisible();
  }

  private productCardByTitle(title: string): Locator {
    return this.page.locator(".shop-item").filter({ hasText: title }).first();
  }

  private cartRowByTitle(title: string): Locator {
    return this.cartItems.locator(".cart-row").filter({
      has: this.page.locator(".cart-item-title", { hasText: title }),
    });
  }

  async getProductPrice(title: string): Promise<number> {
    const text = await this.productCardByTitle(title)
      .locator(".shop-item-price")
      .textContent();
    return parseFloat((text ?? "0").replace("$", ""));
  }

  async addProductToCart(productTitle: string): Promise<void> {
    await this.productCardByTitle(productTitle)
      .getByRole("button", { name: "ADD TO CART" })
      .click();
  }

  async setQuantity(productTitle: string, quantity: number): Promise<void> {
    const input = this.cartRowByTitle(productTitle).locator(
      ".cart-quantity-input",
    );
    await input.fill(String(quantity));
    await input.dispatchEvent("change");
  }

  async removeFromCart(productTitle: string): Promise<void> {
    await this.cartRowByTitle(productTitle)
      .getByRole("button", { name: "REMOVE" })
      .click();
  }

  async expectCartContains(productTitle: string): Promise<void> {
    await expect(this.cartRowByTitle(productTitle)).toBeVisible();
  }

  async expectCartDoesNotContain(productTitle: string): Promise<void> {
    await expect(this.cartRowByTitle(productTitle)).toHaveCount(0);
  }

  async expectCartItemCount(count: number): Promise<void> {
    await expect(this.cartRows).toHaveCount(count);
  }

  async expectCartTotalEquals(amount: number): Promise<void> {
    await expect(this.cartTotal).toHaveText(formatCartTotal(amount));
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
