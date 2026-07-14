import { Locator, Page, expect } from '@playwright/test';
import { Messages } from '../../constants/messages';

/**
 * Parabank left-side navigation panel. When logged in it shows a
 * "Welcome <name>" line and a Log Out link; when logged out it shows the
 * login form and a Register link. Modelled as a component because multiple
 * pages (overview, transfer, bill pay) share it.
 *
 */
export class HeaderComponent {
  private readonly welcomeText: Locator;
  private readonly logoutLink: Locator;
  private readonly registerLink: Locator;
  private readonly loginForm: Locator;

  constructor(page: Page) {
    this.welcomeText = page.locator('p').filter({ hasText: new RegExp(`^\\s*${Messages.loggedInHeadingPrefix}`) });
    this.logoutLink = page.getByRole('link', { name: 'Log Out' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.loginForm = page.locator('form[name="login"]');
  }

  async isLoggedIn(): Promise<boolean> {
    return (await this.logoutLink.count()) > 0;
  }

  async welcomeContent(): Promise<string> {
    return (await this.welcomeText.first().innerText()).trim();
  }

  async expectLoggedInAs(fullName: string): Promise<void> {
    await expect(this.welcomeText.first()).toContainText(fullName);
    await expect(this.logoutLink).toBeVisible();
  }

  async expectAuthenticated(): Promise<void> {
    await expect(this.logoutLink).toBeVisible();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.loginForm).toBeVisible();
    await expect(this.logoutLink).toHaveCount(0);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async goToRegister(): Promise<void> {
    await this.registerLink.click();
  }
}
