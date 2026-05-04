import { type Locator, type Page, expect } from "@playwright/test";
import { MESSAGE, ROUTES } from "../test-data/constants";

export class LoginPage {
  readonly page: Page;
  readonly section: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly message: Locator;
  readonly shopSection: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator("#loginSection");
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator("#submitLoginBtn");
    this.message = page.locator(MESSAGE.loginFeedback);
    this.shopSection = page.locator("#prooood");
    this.logoutLink = page.locator("#logout");
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.ecommerce);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectAuthenticated(): Promise<void> {
    await expect(this.section).toHaveCount(0);
    await expect(this.shopSection).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
  }

  async expectNotAuthenticated(): Promise<void> {
    await expect(this.section).toBeVisible();
    await expect(this.shopSection).toBeHidden();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.message).toBeVisible();
    await expect(this.message).toContainText("Bad credentials");
    await this.expectNotAuthenticated();
  }
}
