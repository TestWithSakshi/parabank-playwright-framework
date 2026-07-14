import { test, expect } from '../../src/fixtures/test.fixture';
import { buildRegistration } from '../../src/test-data/user-factory';
import { tagSuite } from '../../src/utils/allure-annotations';
import { step } from '../../src/utils/step';

/**
 * 5 critical Sign Up scenarios covering the highest-value positive and
 * negative paths. Each scenario is intentionally distinct.
 */
test.describe('Sign Up', () => {
  test.beforeEach(async ({}, testInfo) =>
    tagSuite('Sign Up', testInfo.title.toLowerCase().includes('successful') ? 'positive' : 'negative')
  );

  test('TC-01 Successful registration with valid details', async ({ page, registerPage, homePage }) => {
    const details = buildRegistration();
    const fullName = `${details.firstName} ${details.lastName}`;

    await step(page, 'Open Register page', () => registerPage.open());
    await step(page, 'Fill valid registration details', () => registerPage.fill(details));
    await step(page, 'Submit registration', () => registerPage.submit());
    await step(page, 'Verify success banner is displayed', () => registerPage.expectSuccess());
    await step(page, 'Verify user is auto-authenticated in header', () =>
      homePage.header.expectLoggedInAs(fullName)
    );
    await step(page, 'Log out to leave a clean session', () => homePage.header.logout());
  });

  test('TC-02 Mandatory field validation — all required fields report errors', async ({ page, registerPage }) => {
    await step(page, 'Open Register page', () => registerPage.open());
    await step(page, 'Submit an entirely empty form', () => registerPage.submit());
    await step(page, 'Verify every required field surfaces its own error', async () => {
      for (const fieldName of [
        'customer.firstName',
        'customer.lastName',
        'customer.address.street',
        'customer.address.city',
        'customer.address.state',
        'customer.address.zipCode',
        'customer.ssn',
        'customer.username',
        'customer.password',
        'repeatedPassword',
      ]) {
        await registerPage.expectFieldRequired(fieldName);
      }
    });
  });

  test('TC-03 Duplicate username validation — second registration is rejected', async ({
    page,
    registerPage,
    provisionedAccount,
  }) => {
    // provisionedAccount fixture already registered a real user and logged out.
    // Now try to register a *new* user reusing the same username → server must reject.
    const duplicate = buildRegistration({ username: provisionedAccount.details.username });

    await step(page, 'Open Register page', () => registerPage.open());
    await step(page, 'Fill form using an already-registered username', () => registerPage.fill(duplicate));
    await step(page, 'Submit form', () => registerPage.submit());
    await step(page, 'Verify "This username already exists." error', () =>
      registerPage.expectUsernameTaken()
    );
    expect(duplicate.username).toBe(provisionedAccount.details.username);
  });

  test('TC-04 Password mismatch validation', async ({ page, registerPage }) => {
    const details = buildRegistration({ password: 'FirstPassword1!', confirmPassword: 'SecondPassword1!' });

    await step(page, 'Open Register page', () => registerPage.open());
    await step(page, 'Fill form with mismatched password + confirm', () => registerPage.fill(details));
    await step(page, 'Submit form', () => registerPage.submit());
    await step(page, 'Verify "Passwords did not match" error', () => registerPage.expectPasswordsMismatch());
  });

  test('TC-05 Successful registration produces a readable Firstname_Lastname username', async ({
    page,
    registerPage,
    homePage,
  }) => {
    const details = buildRegistration({ firstName: 'Sakshi', lastName: 'Jindal' });
    const fullName = `${details.firstName} ${details.lastName}`;

    await step(page, 'Open Register page', () => registerPage.open());
    await step(page, 'Register with deterministic first/last name', () => registerPage.register(details));
    await step(page, 'Verify successful registration', () => registerPage.expectSuccess());
    await step(page, 'Verify header greets the correct user', () =>
      homePage.header.expectLoggedInAs(fullName)
    );
    // Assert the generated username starts with Firstname_Lastname (Parabank
    // caps the total length at 20 chars so short names get a random suffix).
    expect(details.username).toMatch(/^Sakshi_Jindal(_[a-z0-9]+)?$/);
    expect(details.username.length).toBeLessThanOrEqual(20);
    await step(page, 'Log out', () => homePage.header.logout());
  });
});
