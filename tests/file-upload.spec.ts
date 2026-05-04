import * as path from "node:path";
import { test, expect } from "./fixtures";

const fixturesDir = path.join(__dirname, "..", "test-data", "assets");

test.describe("File upload - happy paths", () => {
  test("uploads a .txt file", async ({ fileUploadPage }) => {
    await fileUploadPage.goto();
    await fileUploadPage.uploadFile(
      path.join(fixturesDir, "sample-upload.txt"),
    );
    await fileUploadPage.expectUploadSuccess("sample-upload.txt");
  });

  test("uploads a .png file", async ({ fileUploadPage }) => {
    await fileUploadPage.goto();
    await fileUploadPage.uploadFile(
      path.join(fixturesDir, "sample-upload.png"),
    );
    await fileUploadPage.expectUploadSuccess("sample-upload.png");
  });

  test("uploads a file with spaces in the name", async ({ fileUploadPage }) => {
    const fileName = "sample upload with spaces.txt";
    await fileUploadPage.goto();
    await fileUploadPage.uploadFile(path.join(fixturesDir, fileName));
    await fileUploadPage.expectUploadSuccess(fileName);
  });
});

test.describe("File upload - edge cases", () => {
  test("submitting without a file shows empty filename in the banner", async ({
    fileUploadPage,
  }) => {
    await fileUploadPage.goto();
    await fileUploadPage.submitWithoutFile();
    await expect(fileUploadPage.response).toBeVisible();
    await expect(fileUploadPage.response).toContainText('""');
  });
});
