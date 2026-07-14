import { test, Page, TestInfo } from '@playwright/test';
import * as allure from 'allure-js-commons';

/**
 * Wraps `test.step` and automatically captures a full-page screenshot at the
 * end of every step, attaching it both to the Playwright report and to the
 * Allure report. Keeps specs clean while still giving reviewers a per-step
 * visual trail.
 */
export async function step<T>(
  page: Page,
  title: string,
  body: () => Promise<T>
): Promise<T> {
  return test.step(title, async () => {
    const result = await body();
    try {
      const buffer = await page.screenshot({ fullPage: true });
      // Attach to the current test info (Playwright HTML report)
      const info: TestInfo = test.info();
      await info.attach(`step: ${title}`, {
        body: buffer,
        contentType: 'image/png',
      });
      // Attach to Allure explicitly, so the step is browsable there too.
      await allure.attachment(`step: ${title}`, buffer, 'image/png');
    } catch {
      // page could already be closed at teardown; screenshot failures must
      // never fail the step itself.
    }
    return result;
  });
}
