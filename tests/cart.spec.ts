import { test } from "./fixtures";
import { PRODUCTS } from "../test-data/constants";

test.describe("Cart - item manipulation", () => {
  test("changing quantity updates the total", async ({ authedShop }) => {
    const price = await authedShop.getProductPrice(PRODUCTS.nokia105);
    await authedShop.addProductToCart(PRODUCTS.nokia105);
    await authedShop.expectCartTotalEquals(price);
    await authedShop.setQuantity(PRODUCTS.nokia105, 3);
    await authedShop.expectCartTotalEquals(price * 3);
  });

  test("removing an item updates the cart and total", async ({
    authedShop,
  }) => {
    const nokiaPrice = await authedShop.getProductPrice(PRODUCTS.nokia105);
    const samsungPrice = await authedShop.getProductPrice(PRODUCTS.samsungA32);

    await authedShop.addProductToCart(PRODUCTS.nokia105);
    await authedShop.addProductToCart(PRODUCTS.samsungA32);
    await authedShop.expectCartItemCount(2);
    await authedShop.expectCartTotalEquals(nokiaPrice + samsungPrice);

    await authedShop.removeFromCart(PRODUCTS.nokia105);
    await authedShop.expectCartItemCount(1);
    await authedShop.expectCartDoesNotContain(PRODUCTS.nokia105);
    await authedShop.expectCartContains(PRODUCTS.samsungA32);
    await authedShop.expectCartTotalEquals(samsungPrice);
  });
});
