import { test, expect } from '../../src/fixtures/test.fixture';
import { tagSuite } from '../../src/utils/allure-annotations';
import { step } from '../../src/utils/step';
import { Routes } from '../../src/constants/routes';
import { Messages } from '../../src/constants/messages';

/**
 * 5 critical Sign In scenarios covering the highest-value positive and
 * negative paths.
 */
test.describe('Sign In', () => {
  test.beforeEach(async ({}, testInfo) =>
    tagSuite('Sign In', /invalid|empty|error|mismatch/i.test(testInfo.title) ? 'negative' : 'positive')
  );

  test('TC-06 Successful login with valid credentials', async ({
    page,
    loginPage,
    overviewPage,
    homePage,
    provisionedAccount,
  }) => {
    await step(page, 'Open Parabank home', () => loginPage.open());
    await step(page, 'Log in with valid credentials', () =>
      loginPage.login(provisionedAccount.details.username, provisionedAccount.details.password)
    );
    await step(page, 'Verify Accounts Overview is loaded', () => overviewPage.expectLoaded());
    await step(page, 'Verify header shows the correct welcome name', () =>
      homePage.header.expectLoggedInAs(provisionedAccount.fullName)
    );
    await expect(page).toHaveURL(new RegExp(Routes.overview.replace(/\./g, '\\.')));
  });

  test('TC-07 Invalid password shows generic error', async ({ page, loginPage, provisionedAccount }) => {
    await step(page, 'Open Parabank home', () => loginPage.open());
    await step(page, 'Attempt login with a wrong password', () =>
      loginPage.login(provisionedAccount.details.username, 'CompletelyWrongPassword!')
    );
    await step(page, 'Verify the standard invalid-credentials error', () =>
      loginPage.expectInvalidCredentialsError()
    );
    expect(await loginPage.errorText()).toBe(Messages.invalidLogin);
  });

  test('TC-08 Invalid username shows the same generic error (no user enumeration)', async ({ page, loginPage }) => {
    await step(page, 'Open Parabank home', () => loginPage.open());
    await step(page, 'Attempt login with an unknown username', () =>
      loginPage.login('no_such_user_98765', 'AnyPassword!')
    );
    await step(page, 'Verify identical generic error (no leak)', () => loginPage.expectInvalidCredentialsError());
  });

  test('TC-09 Empty credentials — missing-credentials error is shown', async ({ page, loginPage }) => {
    await step(page, 'Open Parabank home', () => loginPage.open());
    await step(page, 'Submit login form with empty fields', () => loginPage.submitEmpty());
    await step(page, 'Verify missing-credentials error message', () => loginPage.expectMissingCredentialsError());
  });

  test('TC-10 Logout ends the session', async ({ page, loginPage, overviewPage, homePage, provisionedAccount }) => {
    await step(page, 'Open Parabank home', () => loginPage.open());
    await step(page, 'Log in with valid credentials', () =>
      loginPage.login(provisionedAccount.details.username, provisionedAccount.details.password)
    );
    await step(page, 'Wait for the authenticated overview page', () => overviewPage.expectLoaded());
    await step(page, 'Click Log Out', () => homePage.header.logout());
    await step(page, 'Verify the anonymous login form is visible again', () =>
      homePage.header.expectLoggedOut()
    );
  });
});
