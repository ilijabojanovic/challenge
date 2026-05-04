import { type Locator, type Page, expect } from "@playwright/test";
import { MESSAGE, ROUTES, type Shipping } from "../test-data/constants";

export class CartCheckoutPage {
  readonly page: Page;
  readonly shippingSection: Locator;
  readonly phoneInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly countrySelect: Locator;
  readonly submitOrderButton: Locator;
  readonly message: Locator;
  readonly logoutLink: Locator;
  readonly loginSection: Locator;
  readonly shopSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shippingSection = page.locator("#shipping-address");
    this.phoneInput = page.locator("#phone");
    this.streetInput = page.locator('input[name="street"]');
    this.cityInput = page.locator('input[name="city"]');
    this.countrySelect = page.locator("#countries_dropdown_menu");
    this.submitOrderButton = page.locator("#submitOrderBtn");
    this.message = page.locator(MESSAGE.orderFeedback);
    this.logoutLink = page.locator("#logout");
    this.loginSection = page.locator("#loginSection");
    this.shopSection = page.locator("#prooood");
  }

  async expectShippingVisible(): Promise<void> {
    await expect(this.shippingSection).toBeVisible();
  }

  async fillShipping(details: Shipping): Promise<void> {
    await this.phoneInput.fill(details.phone);
    await this.streetInput.fill(details.street);
    await this.cityInput.fill(details.city);
    await this.countrySelect.selectOption({ label: details.countryLabel });
  }

  async fillShippingPartial(details: Partial<Shipping>): Promise<void> {
    if (details.phone !== undefined) await this.phoneInput.fill(details.phone);
    if (details.street !== undefined)
      await this.streetInput.fill(details.street);
    if (details.city !== undefined) await this.cityInput.fill(details.city);
    if (details.countryLabel !== undefined)
      await this.countrySelect.selectOption({ label: details.countryLabel });
  }

  async submitOrder(): Promise<void> {
    await this.submitOrderButton.click();
  }

  async expectOrderConfirmation(
    street: string,
    city: string,
    countryLabel: string,
  ): Promise<void> {
    await expect(this.message).toContainText("Congrats! Your order");
    await expect(this.message).toContainText(street);
    await expect(this.message).toContainText(city);
    await expect(this.message).toContainText(countryLabel);
    await expect(this.shippingSection).toHaveCount(0);
  }

  async expectOrderNotSubmitted(): Promise<void> {
    await expect(this.shippingSection).toBeVisible();
    await expect(this.message).not.toContainText("has been registered");
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.loginSection).toBeVisible();
    await expect(this.page.locator("#email")).toBeVisible();
    await expect(this.logoutLink).toHaveCount(0);
    await expect(this.shopSection).toBeHidden();
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.ecommerce}`));
  }

  async checkLogoutSticks(): Promise<void> {
    await this.page.reload();
    await this.expectLoggedOut();
  }
}
