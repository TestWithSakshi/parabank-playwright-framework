# 🏦 Parabank Playwright Automation Framework

<p align="center">
  <img alt="Playwright" src="https://img.shields.io/badge/Playwright-1.61-2EAD33?logo=playwright&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Allure" src="https://img.shields.io/badge/Reports-Allure-FA7B17?logo=qase&logoColor=white" />
  <img alt="Tests" src="https://img.shields.io/badge/Tests-10%20focused-brightgreen" />
</p>

> A lean, demo-ready **end-to-end automation framework** covering the **Sign Up** and **Sign In** journeys of [Parabank](https://parabank.parasoft.com/parabank/index.htm), built with **Playwright + TypeScript**, the **Page Object Model**, custom **fixtures**, and **Allure** reporting.

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Framework Architecture](#-framework-architecture)
4. [Folder Structure](#-folder-structure)
5. [Installation](#-installation)
6. [Environment Setup](#-environment-setup)
7. [Running Tests](#-running-tests)
8. [Reporting](#-reporting)
9. [Test Coverage Matrix](#-test-coverage-matrix)
10. [Design Notes](#-design-notes)
11. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

A modular, scalable UI-automation harness that validates the two most business-critical Parabank flows: creating a new customer account (**Sign Up**) and signing in as an existing customer (**Sign In**).

**What was refactored (v3.0)**

| Area | Change |
|---|---|
| Test surface | Trimmed to exactly **10 focused tests** (5 Sign Up + 5 Sign In). Duplicates and low-value permutations removed. |
| Cleanup | `allure-results`, `allure-report`, `playwright-report`, `test-results` are wiped **automatically before every run**. |
| Reporting | Allure report is **generated and opened automatically** after the suite finishes; report URL is printed in the console. |
| Usernames | Random `qa_xxxx` replaced with human-readable `Firstname_Lastname_xxxxx` via a reusable helper. |
| Browser | Chrome launches **maximized (1920×1080)** with a full-screen viewport; screenshots + video capture at the same resolution. |
| Headed mode | Default run is **`HEADLESS=false`** so reviewers can watch the browser drive. A `test:ci` script exists for headless CI runs. |
| Locators | XPath removed; specs use Playwright semantic locators (`getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`). |
| Cross-browser | Reduced to `chromium` only (single project) to keep the demo fast; can be re-extended in `playwright.config.ts`. |

---

## 🧰 Technology Stack

| Layer | Choice |
|---|---|
| Test Runner | Playwright Test |
| Language | TypeScript (strict) |
| Test Data | `@faker-js/faker` + custom username helper |
| Reporting | `allure-playwright` + Playwright HTML |
| Config | `dotenv` (layered `.env` → `.env.<TEST_ENV>`) |
| Scripts | Node.js (`scripts/cleanup.js`, `scripts/run-tests.js`, `scripts/allure-report.js`) |

---

## 🏛 Framework Architecture

```
┌────────────────────────────────────────────────────────────┐
│                 tests/*.spec.ts (WHAT)                     │
│   Business-readable Given/When/Then style scenarios        │
└──────────────────────────┬─────────────────────────────────┘
                           │ uses
┌──────────────────────────▼─────────────────────────────────┐
│              src/fixtures/test.fixture.ts                  │
│  Injects page objects + a real provisioned account         │
└─────────┬───────────────────────────────────┬──────────────┘
          │                                   │
┌─────────▼───────────────┐        ┌──────────▼──────────────┐
│  src/pages/*.page.ts    │        │ src/helpers/account.*   │
│  Page Object Model (HOW)│        │  provisionAccount()     │
└─────────┬───────────────┘        └─────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────┐
│  src/utils   src/test-data   src/constants   src/config    │
│  ─ step (per-step screenshots to Allure)                   │
│  ─ allure-annotations                                      │
│  ─ username.helper (Firstname_Lastname[_xxxxx])            │
│  ─ user-factory (faker → RegistrationDetails)              │
│  ─ messages / routes                                       │
│  ─ env.config (layered .env)                               │
└─────────┬──────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────┐
│  scripts/                                                  │
│  ─ cleanup.js       — wipes artifacts before each run      │
│  ─ run-tests.js     — orchestrates: playwright + allure    │
│  ─ allure-report.js — generates + opens Allure, prints URL │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
.
├── scripts/
│   ├── cleanup.js              # Wipes allure-results, allure-report,
│   │                             playwright-report, test-results
│   ├── run-tests.js            # playwright test → always opens Allure
│   └── allure-report.js        # generates + serves Allure, prints URL
│
├── src/
│   ├── config/env.config.ts    # Typed .env loader with TEST_ENV layering
│   ├── constants/
│   │   ├── messages.ts         # Verified Parabank UI copy
│   │   └── routes.ts           # App routes (relative to BASE_URL)
│   ├── fixtures/
│   │   └── test.fixture.ts     # test/expect extended with page objects
│   ├── helpers/
│   │   └── account.helper.ts   # provisionAccount(): register + logout
│   ├── pages/
│   │   ├── base.page.ts        # Abstract base with open()
│   │   ├── home.page.ts        # /index.htm
│   │   ├── login.page.ts       # Customer Login form
│   │   ├── register.page.ts    # /register.htm sign-up form
│   │   ├── overview.page.ts    # /overview.htm authenticated landing
│   │   └── components/
│   │       └── header.component.ts  # Left-panel logged-in / logged-out widget
│   ├── test-data/
│   │   └── user-factory.ts     # Faker-based RegistrationDetails builder
│   ├── types/user.types.ts     # Domain types
│   └── utils/
│       ├── username.helper.ts  # Firstname_Lastname[_xxxxx] usernames
│       ├── step.ts             # step(): screenshots every step → Allure
│       ├── allure-annotations.ts
│       └── logger.ts
│
├── tests/
│   ├── signup/signup.spec.ts   # TC-01 … TC-05
│   └── signin/signin.spec.ts   # TC-06 … TC-10
│
├── .env / .env.example         # Environment configuration
├── playwright.config.ts        # Central Playwright config
├── tsconfig.json
└── package.json
```

Generated at runtime (git-ignored, wiped before every run):

- `allure-results/` — raw JSON events for Allure
- `allure-report/` — the browsable Allure dashboard
- `playwright-report/` — Playwright's built-in HTML report
- `test-results/` — per-test screenshots, videos, traces

---

## ⚙️ Installation

> Requires **Node.js 18+** (verified on Node 22) and Java 8+ on `PATH` (Allure CLI dependency).

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright's Chromium bundle
npx playwright install --with-deps chromium
```

---

## 🔧 Environment Setup

Copy `.env.example` → `.env` and adjust as needed:

```env
TEST_ENV=qa
BASE_URL=https://parabank.parasoft.com/parabank
DEFAULT_PASSWORD=Str0ng!Passw0rd123
BROWSER=chromium
HEADLESS=false          # false → browser is visible (default, demo-friendly)
WORKERS=1
RETRIES=1               # 1 retry to smooth over public-instance flakiness
TRACE=on
VIDEO=on
SCREENSHOT=on
ALLURE_RESULTS_DIR=allure-results
```

Layered `.env` → `.env.<TEST_ENV>` support means you can override per environment:
```bash
TEST_ENV=staging npm test   # loads .env then .env.staging on top
```

---

## ▶️ Running Tests

Every command below **automatically**:
1. Wipes previous artifacts (`allure-results/`, `allure-report/`, `playwright-report/`, `test-results/`).
2. Runs the tests (browser is **visible by default** — set `HEADLESS=true` for CI).
3. Generates the Allure report and opens it in your default browser, printing the URL in the console.

```bash
npm test                # Run all 10 tests (headed, visible browser)
npm run test:ci         # Run all 10 tests headless (for CI pipelines)
npm run test:signup     # Sign Up suite only
npm run test:signin     # Sign In suite only
npm run test:ui         # Interactive Playwright UI mode
npm run test:debug      # Playwright inspector

npm run clean           # Manually wipe all artifacts
npm run report:allure   # Regenerate + open Allure from existing results
npm run report:html     # Open Playwright's built-in HTML report
npm run typecheck       # tsc --noEmit
```

Example console tail after a successful run:

```
  10 passed (3.4m)

[allure] generating report…
Report successfully generated to allure-report
[allure] opening report — a browser tab will launch automatically.
============================================================
  ✅  Allure Report URL: http://192.168.x.x:PORT
  (Ctrl+C to stop the server)
============================================================
```

---

## 📊 Reporting

| Report | Location | How to open |
|---|---|---|
| **Allure** (rich, filterable) | `allure-report/` | Opens automatically after every run. Manual: `npm run report:allure`. |
| Playwright HTML | `playwright-report/` | `npm run report:html` |
| Trace viewer | `test-results/**/trace.zip` | `npm run trace:open <path>` |
| Videos | `test-results/**/*.webm` | Play in any browser — recorded at **1920×1080** to match the maximized window. |
| Screenshots | `test-results/**/*.png` + per-step attachments inside Allure | Auto-attached to every step. |

---

## 🧪 Test Coverage Matrix

| # | ID | Feature | Type | Scenario | Priority |
|---|---|---|---|---|---|
| 1 | **TC-01** | Sign Up | Positive | Successful registration with valid details, auto-login, header greets user | Critical |
| 2 | **TC-02** | Sign Up | Negative | Empty form submission surfaces per-field "is required" errors on all 10 required fields | Critical |
| 3 | **TC-03** | Sign Up | Negative | **Duplicate username** — register once, attempt again with the same username → "This username already exists." | Critical |
| 4 | **TC-04** | Sign Up | Negative | Password and Confirm mismatch → "Passwords did not match." | Critical |
| 5 | **TC-05** | Sign Up | Positive | Registered username follows the readable `Firstname_Lastname[_xxxxx]` format (verifies the username helper contract) | Critical |
| 6 | **TC-06** | Sign In | Positive | Successful login with valid credentials lands on Accounts Overview | Critical |
| 7 | **TC-07** | Sign In | Negative | Invalid password → generic "The username and password could not be verified." | Critical |
| 8 | **TC-08** | Sign In | Negative | Unknown username → identical generic error (no user enumeration) | Critical |
| 9 | **TC-09** | Sign In | Negative | Empty credentials → "Please enter a username and password." | Critical |
| 10 | **TC-10** | Sign In | Positive | Logout ends the session and returns the anonymous login form | Critical |

---

## 🧠 Design Notes

- **Fixtures** provide ready-to-use page objects and a real **provisionedAccount** (created via UI, logged out, ready for Sign In tests).
- **Username helper** (`src/utils/username.helper.ts`) generates `Firstname_Lastname[_xxxxx]` and caps output at **20 characters** — the maximum Parabank silently accepts.
- **Per-step screenshots** are attached to Allure by `step()`, giving reviewers a visual trail without cluttering specs.
- **Locator strategy**: semantic Playwright locators (`getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`) first; falls back to Spring-bound `name` attributes only where Parabank exposes no label/testid.
- **Maximized browser + 1920×1080 video**: `viewport: null` + `--start-maximized` + `--window-size=1920,1080` + explicit video `size: 1920×1080` ensures the recording captures the full browser at full fidelity.
- **Retries=1** absorbs occasional flakiness of the public Parabank demo instance (shared server, transient 5xx / duplicate collisions).

---

## 🧰 Troubleshooting

| Symptom | Fix |
|---|---|
| `allure: command not found` when the post-run report step runs | `npm install` again (`allure-commandline` ships the binary). Ensure Java 8+ is on `PATH`. |
| Report doesn't open a browser | Grab the URL printed after `✅ Allure Report URL:` and open it manually. |
| Tests can't reach parabank.parasoft.com | The public demo is occasionally down. Retry with `npm test`; the framework already retries once per test. |
| Duplicate-username collision on TC-03 or provisioning | The 20-char username cap + timestamp+random suffix keeps collisions rare. Re-run — retries handle transient duplicates. |
| Video looks small in Allure | Confirm your run used the updated `playwright.config.ts` (video `size: 1920×1080`). Delete `test-results/` and rerun. |
| Need to run headless in CI | `npm run test:ci` (or `HEADLESS=true npm test`). |
| Playwright browsers missing | `npx playwright install chromium`. |

---

**Author:** Sakshi Jindal
