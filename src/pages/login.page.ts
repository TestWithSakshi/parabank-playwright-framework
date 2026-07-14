import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';
import { Messages } from '../constants/messages';


export class LoginPage extends BasePage {
  private readonly loginForm: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.loginForm = page.locator('form[name="login"]');
    // Parabank's login inputs have no labels/aria/testid, so we fall back to
    // the stable Spring-bound `name` attribute, scoped inside the login form.
    this.usernameInput = this.loginForm.locator('input[name="username"]');
    this.passwordInput = this.loginForm.locator('input[name="password"]');
    this.loginButton = this.loginForm.getByRole('button', { name: 'Log In' });
    this.errorMessage = page.getByText(new RegExp(`${Messages.invalidLogin}|${Messages.usernameRequired}`));
  }

  async open(): Promise<void> {
    await super.open(Routes.home);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.loginButton.click();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.page.getByText(Messages.invalidLogin)).toBeVisible();
  }

  async expectMissingCredentialsError(): Promise<void> {
    await expect(this.page.getByText(Messages.usernameRequired)).toBeVisible();
  }

  async errorText(): Promise<string> {
    return (await this.errorMessage.innerText()).trim();
  }
}
