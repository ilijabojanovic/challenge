import "dotenv/config";

import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

const DEVICE_BY_BROWSER = {
  chromium: devices["Desktop Chrome"],
  firefox: devices["Desktop Firefox"],
  webkit: devices["Desktop Safari"],
} as const;

type BrowserName = keyof typeof DEVICE_BY_BROWSER;

function projectsFromBrowsersEnv(): Array<{
  name: BrowserName;
  use: (typeof DEVICE_BY_BROWSER)[BrowserName];
}> {
  const raw = process.env.BROWSERS;
  const tokens = raw
    ? raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];

  const resolved = tokens.filter(
    (t): t is BrowserName => t in DEVICE_BY_BROWSER,
  );
  const picked: BrowserName[] =
    resolved.length > 0 ? [...new Set(resolved)] : ["chromium"];

  return picked.map((name) => ({
    name,
    use: { ...DEVICE_BY_BROWSER[name] },
  }));
}

export default defineConfig({
  globalSetup: "./global-setup.ts",
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: CI
    ? [
        ["html", { open: "never" }],
        ["github"],
        ["list"],
        ["junit", { outputFile: "test-results/junit.xml" }],
      ]
    : [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "https://qa-practice.netlify.app",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: projectsFromBrowsersEnv(),
});
