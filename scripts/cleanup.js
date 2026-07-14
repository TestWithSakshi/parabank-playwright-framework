/**
 * Pre-run cleanup: wipes every artifact folder so each execution
 * starts from a completely clean slate.
 *
 * Deletes:
 *   - allure-results   (raw Allure events)
 *   - allure-report    (generated Allure dashboard)
 *   - playwright-report (built-in HTML report)
 *   - test-results     (per-test screenshots, videos, traces)
 */
const fs = require('fs');
const path = require('path');

const targets = [
  'allure-results',
  'allure-report',
  'playwright-report',
  'test-results',
];

const root = path.resolve(__dirname, '..');
for (const dir of targets) {
  const full = path.join(root, dir);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
    console.log(`[cleanup] removed ${dir}`);
  }
}
console.log('[cleanup] done');
