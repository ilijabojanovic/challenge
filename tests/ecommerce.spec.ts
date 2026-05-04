import { test } from "./fixtures";
import { PRODUCTS } from "../test-data/constants";
import { buildShipping } from "../test-data/helpers";

test.describe("E-commerce - full order flow", () => {
  test("adds products, places order and logs out", async ({
    authedShop,
    checkoutPage,
  }) => {
    await test.step("Build cart from live prices", async () => {
      const nokiaPrice = await authedShop.getProductPrice(PRODUCTS.nokia105);
      const samsungPrice = await authedShop.getProductPrice(
        PRODUCTS.samsungA32,
      );

      await authedShop.addProductToCart(PRODUCTS.nokia105);
      await authedShop.addProductToCart(PRODUCTS.samsungA32);
      await authedShop.expectCartItemCount(2);
      await authedShop.expectCartTotalEquals(nokiaPrice + samsungPrice);
    });

    await test.step("Checkout and confirm order", async () => {
      await authedShop.proceedToCheckout();
      await checkoutPage.expectShippingVisible();

      const shipping = buildShipping();
      await checkoutPage.fillShipping(shipping);
      await checkoutPage.submitOrder();
      await checkoutPage.expectOrderConfirmation(
        shipping.street,
        shipping.city,
        shipping.countryLabel,
      );
    });

    await test.step("Logout and verify session clears after reload", async () => {
      await checkoutPage.logout();
      await checkoutPage.expectLoggedOut();
      await checkoutPage.checkLogoutSticks();
    });
  });
});
