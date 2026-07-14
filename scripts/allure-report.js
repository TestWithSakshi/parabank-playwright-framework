/**
 * Post-run Allure automation:
 *   1. Generates the static Allure report from allure-results/
 *   2. Boots `allure open` which serves the report and prints its URL.
 *
 * Runs synchronously so the CLI stays attached and the user sees the
 * report URL in the console immediately after the suite finishes.
 */
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const resultsDir = path.join(root, 'allure-results');
const reportDir = path.join(root, 'allure-report');

if (!fs.existsSync(resultsDir) || fs.readdirSync(resultsDir).length === 0) {
  console.log('[allure] no results found — skipping report generation.');
  process.exit(0);
}

const allureBin = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'allure.cmd' : 'allure');
// Quote the binary path so spaces in the working directory (e.g. "C:\Assignment ADCB")
// don't break the `shell: true` invocation on Windows.
const allureCmd = process.platform === 'win32' ? `"${allureBin}"` : allureBin;

console.log('[allure] generating report…');
const gen = spawnSync(allureCmd, ['generate', 'allure-results', '--clean', '-o', 'allure-report'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
if (gen.status !== 0) {
  console.error('[allure] generate failed');
  process.exit(gen.status || 1);
}

console.log('[allure] opening report — a browser tab will launch automatically.');
console.log(`[allure] report location: ${reportDir}`);

const child = spawn(allureCmd, ['open', 'allure-report'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
});

let urlPrinted = false;
const printUrl = (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  // Match a bare http(s) URL and stop at whitespace or any of the common
  // wrapping characters Allure prints around URLs (`<`, `>`, `.`, `,`,
  // `)`, `]`). Prevents capturing `http://127.0.0.1:PORT>.` from the
  // `Server started at <http://…>.` line.
  const match = text.match(/https?:\/\/[^\s<>()\[\],]+/);
  if (match && !urlPrinted) {
    // Trim any trailing punctuation just in case.
    const url = match[0].replace(/[.,;:!?]+$/, '');
    urlPrinted = true;
    console.log('\n============================================================');
    console.log(`  ✅  Allure Report URL: ${url}`);
    console.log('  (Ctrl+C to stop the server)');
    console.log('============================================================\n');
  }
};
child.stdout.on('data', printUrl);
child.stderr.on('data', printUrl);
child.on('exit', (code) => process.exit(code || 0));
