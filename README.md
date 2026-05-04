# QA Automation Challenge — Playwright

My solution for the QA Automation Code Challenge. Both required flows are covered — the e-commerce login/order on [qa-practice.netlify.app](https://qa-practice.netlify.app/) and the file upload page — plus a few extra scenarios I thought were worth locking in.

Stack is **Playwright + TypeScript**. I went with Playwright over Cypress mainly because the trace viewer is genuinely useful and the fixture system makes test setup much cleaner to compose.

## Getting started

You'll need Node 20 (Node 18 works too). Then:

```bash
npm ci
npx playwright install
npm test
```

Optional: copy [`.env.example`](.env.example) to `.env`. [`playwright.config.ts`](playwright.config.ts) pulls in `dotenv` at startup so those values are available; `.env` is gitignored. Supported variables are listed under **Configuration** (and match `.env.example`).

Full run takes around 15 seconds locally on Chromium. To also install Firefox and WebKit, swap the install command for `npx playwright install`.

## Useful scripts

Day-to-day:

- `npm test` — run the full suite on Chromium
- `npm run test:headed` — same, but with a visible browser
- `npm run test:ui` — Playwright's UI mode, good for debugging a single test
- `npm run test:all-browsers` — Chromium + Firefox + WebKit
- `npm run report` — open the HTML report from the last run

Code quality (CI runs these too):

- `npm run lint` — ESLint with `eslint-plugin-playwright`
- `npm run format:check` / `npm run format` — Prettier
- `npm run typecheck` — `tsc --noEmit`

## Configuration

Defaults work fine for the demo site. Optional environment variables (shell or `.env`):

- **`BASE_URL`** — [`playwright.config.ts`](playwright.config.ts) sets `use.baseURL` from this; [`global-setup.ts`](global-setup.ts) uses it for the pre-flight request. When unset, the Netlify demo origin is used.
- **`BROWSERS`** — comma-separated Playwright project names: `chromium`, `firefox`, `webkit`. If unset or empty, only **Chromium** runs. Unknown tokens are dropped; if nothing valid remains, it falls back to Chromium.
- **`TEST_USER_EMAIL`** / **`TEST_USER_PASSWORD`** — credentials for the happy-path e-commerce login, read in [`test-data/constants.ts`](test-data/constants.ts) as `VALID_USER`. When unset, they default to `admin@admin.com` and `admin123`.

```bash
BASE_URL=https://your-staging-host npm test
BROWSERS=chromium,firefox,webkit npm test
```

`npm run test:all-browsers` sets `BROWSERS=chromium,firefox,webkit` (install browsers with `npx playwright install` first). CI passes `BROWSERS` from the job matrix so `--project=…` stays aligned with installed engines.

Local parallel runs against the live demo are capped at **four workers** by default (`CI` keeps **two**) to reduce timeouts from hammering Netlify.

Before any browser launches, [`global-setup.ts`](global-setup.ts) performs an HTTP GET to `BASE_URL` and aborts the run if the response is not OK—so you fail fast when the site is down.

## Coverage map

| Flow                | Spec                                                                   | What it proves                                                         |
| ------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Login               | [`tests/login.spec.ts`](tests/login.spec.ts)                           | Valid login; invalid / empty credentials                               |
| Full order          | [`tests/ecommerce.spec.ts`](tests/ecommerce.spec.ts)                   | Cart totals from UI prices → checkout → confirmation → logout + reload |
| Checkout validation | [`tests/ecommerce-negative.spec.ts`](tests/ecommerce-negative.spec.ts) | Empty / partial shipping; duplicate add alert                          |
| Cart                | [`tests/cart.spec.ts`](tests/cart.spec.ts)                             | Quantity updates total; remove updates rows and total                  |
| File upload         | [`tests/file-upload.spec.ts`](tests/file-upload.spec.ts)               | `.txt` / `.png` / spaced filename; submit with no file                 |

## Project layout

```text
playwright.config.ts          # globalSetup, baseURL, projects from BROWSERS, reporters
global-setup.ts               # Smoke-check BASE_URL before tests
tests/
  fixtures.ts                 # Custom fixtures (POMs + authedShop)
  login.spec.ts               # Valid creds, wrong password, empty fields
  ecommerce.spec.ts           # Happy path: login → cart → order → logout
  ecommerce-negative.spec.ts  # Empty shipping form, missing country, duplicate add
  cart.spec.ts                # Quantity changes, item removal
  file-upload.spec.ts         # txt, png, filename with spaces, empty submit
pages/                        # Page Objects (LoginPage, ShopPage, CartCheckoutPage, FileUploadPage)
test-data/
  assets/                     # Sample test files used by the upload tests
  constants.ts                # Routes, MESSAGE scopes, users, products, shipping
  helpers.ts                  # formatCartTotal, buildShipping factory
.github/workflows/playwright.yml
```

Page objects are deliberately thin — selectors and a few `expect*` helpers, nothing else. The specs read top-to-bottom like a user would walk through the flow.

## Decisions worth explaining

**`authedShop` fixture.** Most e-commerce tests don't care about the login flow, they just need to land on the shop already authenticated. [`tests/fixtures.ts`](tests/fixtures.ts) has an `authedShop` fixture that handles login as setup so tests can skip straight to what they're actually verifying. Tests that are specifically about login still use `LoginPage` directly.

**No hardcoded prices.** The happy-path test reads each product's price directly from the page and asserts the cart total matches the sum. Writing `$306.98` in a test would be a maintenance time bomb whenever the demo site changes a price.

**No `sleep`s or `waitForTimeout`.** Every assertion goes through Playwright's auto-waiting `expect()`. Flakiness is a real signal, not something to paper over with arbitrary delays.

**Duplicate `#message` IDs.** The demo reuses `id="message"` for login errors and for post-order feedback. Locators live in [`test-data/constants.ts`](test-data/constants.ts) as `MESSAGE.loginFeedback` (`#loginSection #message`) and `MESSAGE.orderFeedback` (`#message:not(.alert)` — only the login banner has Bootstrap alert classes). That stays stable after checkout removes `#shipping-address` from the DOM.

## When something fails

- Open the report: `npm run report`
- Replay a trace step-by-step: `npx playwright show-trace test-results/<...>/trace.zip`
- Step through with the debugger: `PWDEBUG=1 npx playwright test tests/login.spec.ts`
- Generate selectors from a live page: `npx playwright codegen https://qa-practice.netlify.app/auth_ecommerce`

CI uploads the HTML report on every run, **JUnit XML** per browser matrix cell, and the traces folder on failures, so you can triage without needing local access.

## CI

GitHub Actions runs two jobs on every push and PR ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)):

1. **lint** — ESLint, Prettier check, tsc
2. **test** — matrix **Chromium, Firefox, and WebKit** (`fail-fast: false`), installs browsers with cache keying, runs `globalSetup`, uploads HTML report + `junit.xml` per browser (retained 7 days). Traces upload only when tests fail.

`.gitignore` already covers `node_modules/`, `test-results/`, and `playwright-report/`.
