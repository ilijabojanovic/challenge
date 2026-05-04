import { test } from "./fixtures";
import {
  INVALID_USER_EMAIL,
  INVALID_USER,
  VALID_USER,
} from "../test-data/constants";

test.describe("Login - happy path", () => {
  test("logs in with valid credentials", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await loginPage.expectAuthenticated();
  });
});

test.describe("Login - invalid credentials", () => {
  test("shows error with wrong password", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(INVALID_USER.email, INVALID_USER.password);
    await loginPage.expectLoginError();
  });

  test("shows error with wrong email", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(INVALID_USER_EMAIL.email, INVALID_USER.password);
    await loginPage.expectLoginError();
  });

  test("shows error with empty password", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, "");
    await loginPage.expectLoginError();
  });

  test("shows error with both fields empty", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("", "");
    await loginPage.expectLoginError();
  });
});
