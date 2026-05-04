import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ShopPage } from "../pages/ShopPage";
import { CartCheckoutPage } from "../pages/CartCheckoutPage";
import { FileUploadPage } from "../pages/FileUploadPage";
import { VALID_USER } from "../test-data/constants";

export const test = base.extend<{
  loginPage: LoginPage;
  shopPage: ShopPage;
  checkoutPage: CartCheckoutPage;
  fileUploadPage: FileUploadPage;
  authedShop: ShopPage;
}>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  shopPage: async ({ page }, use) => use(new ShopPage(page)),
  checkoutPage: async ({ page }, use) => use(new CartCheckoutPage(page)),
  fileUploadPage: async ({ page }, use) => use(new FileUploadPage(page)),

  authedShop: async ({ loginPage, shopPage }, use) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await loginPage.expectAuthenticated();
    await use(shopPage);
  },
});

export { expect } from "@playwright/test";
