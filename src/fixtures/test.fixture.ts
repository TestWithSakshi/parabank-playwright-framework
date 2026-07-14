import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { OverviewPage } from '../pages/overview.page';
import { HomePage } from '../pages/home.page';
import { provisionAccount, ProvisionedAccount } from '../helpers/account.helper';

interface Fixtures {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  overviewPage: OverviewPage;
  homePage: HomePage;
  /**
   * A real account created via the UI (registration auto-logs the user in;
   * the fixture logs back out so specs start from a clean, logged-out state).
   * The Parabank instance has no delete-account API, so accounts are simply
   * generated with unique usernames per run.
   */
  provisionedAccount: ProvisionedAccount;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  provisionedAccount: async ({ page }, use) => {
    const account = await provisionAccount(page);
    await use(account);
  },
});

export { expect } from '@playwright/test';
