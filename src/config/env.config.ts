 import path from 'path';
import dotenv from 'dotenv';

// Layering: .env first (defaults), then .env.<TEST_ENV> on top if present —
// lets `TEST_ENV=staging npx playwright test` target another environment
// without touching the base file.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
if (process.env.TEST_ENV) {
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.TEST_ENV}`), override: true });
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Did you copy .env.example to .env?`);
  }
  return value;
}

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

function int(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export const env = {
  testEnv: process.env.TEST_ENV ?? 'qa',
  baseUrl: required('BASE_URL').replace(/\/$/, ''),
  defaultPassword: required('DEFAULT_PASSWORD'),
  browser: (process.env.BROWSER ?? 'chromium') as 'chromium' | 'firefox' | 'webkit',
  headless: bool('HEADLESS', false),
  workers: int('WORKERS', 1),
  retries: int('RETRIES', 1),
  trace: process.env.TRACE ?? 'on',
  video: process.env.VIDEO ?? 'on',
  screenshot: process.env.SCREENSHOT ?? 'on',
  allureResultsDir: process.env.ALLURE_RESULTS_DIR ?? 'allure-results',
  isCI: bool('CI', false),
};
