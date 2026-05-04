import type { FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL =
    config.projects[0]?.use?.baseURL ??
    process.env.BASE_URL ??
    "https://qa-practice.netlify.app";
  const origin =
    typeof baseURL === "string" ? baseURL.replace(/\/$/, "") : String(baseURL);

  const res = await fetch(origin, {
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(
      `[globalSetup] ${origin} returned HTTP ${res.status} — aborting test run`,
    );
  }
}
