import { test, expect } from "./fixtures";
import { PRODUCTS } from "../test-data/constants";
import { buildShipping } from "../test-data/helpers";

test.describe("E-commerce - validation", () => {
  test("can't submit order with empty shipping form", async ({
    authedShop,
    checkoutPage,
  }) => {
    await authedShop.addProductToCart(PRODUCTS.nokia105);
    await authedShop.proceedToCheckout();
    await checkoutPage.expectShippingVisible();

    await checkoutPage.submitOrder();
    await checkoutPage.expectOrderNotSubmitted();
  });

  test("can't submit order without selecting a country", async ({
    authedShop,
    checkoutPage,
  }) => {
    await authedShop.addProductToCart(PRODUCTS.nokia105);
    await authedShop.proceedToCheckout();

    const shipping = buildShipping();
    await checkoutPage.fillShippingPartial({
      phone: shipping.phone,
      street: shipping.street,
      city: shipping.city,
    });
    await checkoutPage.submitOrder();
    await checkoutPage.expectOrderNotSubmitted();
  });

  test("adding the same product twice shows an alert", async ({
    authedShop,
  }) => {
    const dialogs: string[] = [];
    authedShop.page.on("dialog", async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    await authedShop.addProductToCart(PRODUCTS.nokia105);
    await authedShop.addProductToCart(PRODUCTS.nokia105);

    await expect.poll(() => dialogs.length).toBeGreaterThan(0);
    expect(dialogs[0]).toContain("already added");
    await authedShop.expectCartItemCount(1);
  });
});
