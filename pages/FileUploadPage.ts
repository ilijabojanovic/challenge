import { type Locator, type Page, expect } from "@playwright/test";
import { ROUTES } from "../test-data/constants";

export class FileUploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly response: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator("#file_upload");
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.response = page.locator("#file_upload_response");
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.fileUpload);
  }

  async uploadFile(filePath: string | string[]): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await this.submitButton.click();
  }

  async submitWithoutFile(): Promise<void> {
    await this.submitButton.click();
  }

  async expectUploadSuccess(fileName: string): Promise<void> {
    await expect(this.response).toBeVisible();
    await expect(this.response).toContainText("successfully uploaded");
    await expect(this.response).toContainText(fileName);
  }
}
