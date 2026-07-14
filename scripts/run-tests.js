/**
 * Wrapper runner:
 *   1. Runs `playwright test <extra args>`
 *   2. ALWAYS generates + opens the Allure report afterwards, even if the
 *      test run failed (so reviewers can inspect the failure evidence).
 *   3. Exits with the Playwright process's exit code.
 *
 * Cleanup of previous artifacts is handled by the `pretest` npm hook.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

// Sanitize incoming args: strip anything from a `#` onward (shell comment
// pasted by the user) and drop empty tokens. Prevents Playwright from
// treating a comment like `# Run all 10 tests (headed, visible browser)`
// as a `-g` regex filter and crashing with an "Unterminated group" error.
const rawArgs = process.argv.slice(2);
const extra = [];
for (const arg of rawArgs) {
  if (arg.startsWith('#')) break;
  const stripped = arg.split('#')[0].trim();
  if (stripped.length > 0) extra.push(stripped);
}

const pwBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';

console.log(`[run] playwright test ${extra.join(' ')}`.trim());
const run = spawnSync(pwBin, ['playwright', 'test', ...extra], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

const reportRun = spawnSync(process.execPath, [path.join(__dirname, 'allure-report.js')], {
  cwd: root,
  stdio: 'inherit',
});

process.exit(run.status ?? reportRun.status ?? 0);
