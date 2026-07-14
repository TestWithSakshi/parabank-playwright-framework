import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';
import { Messages } from '../constants/messages';
import { RegistrationDetails } from '../types/user.types';

/**
 * Parabank /register.htm — full account signup form.
 */
export class RegisterPage extends BasePage {
  private readonly customerForm: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly streetInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneInput: Locator;
  private readonly ssnInput: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly welcomeHeading: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.customerForm = page.locator('form#customerForm');
    this.firstNameInput = this.customerForm.locator('[name="customer.firstName"]');
    this.lastNameInput = this.customerForm.locator('[name="customer.lastName"]');
    this.streetInput = this.customerForm.locator('[name="customer.address.street"]');
    this.cityInput = this.customerForm.locator('[name="customer.address.city"]');
    this.stateInput = this.customerForm.locator('[name="customer.address.state"]');
    this.zipCodeInput = this.customerForm.locator('[name="customer.address.zipCode"]');
    this.phoneInput = this.customerForm.locator('[name="customer.phoneNumber"]');
    this.ssnInput = this.customerForm.locator('[name="customer.ssn"]');
    this.usernameInput = this.customerForm.locator('[name="customer.username"]');
    this.passwordInput = this.customerForm.locator('[name="customer.password"]');
    this.confirmPasswordInput = this.customerForm.locator('[name="repeatedPassword"]');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.welcomeHeading = page.getByRole('heading', { name: new RegExp(Messages.loggedInHeadingPrefix, 'i') });
    this.successMessage = page.getByText(Messages.registrationWelcome);
  }

  async open(): Promise<void> {
    await super.open(Routes.register);
  }

  async fill(details: Partial<RegistrationDetails>): Promise<void> {
    if (details.firstName !== undefined) await this.firstNameInput.fill(details.firstName);
    if (details.lastName !== undefined) await this.lastNameInput.fill(details.lastName);
    if (details.address?.street !== undefined) await this.streetInput.fill(details.address.street);
    if (details.address?.city !== undefined) await this.cityInput.fill(details.address.city);
    if (details.address?.state !== undefined) await this.stateInput.fill(details.address.state);
    if (details.address?.zipCode !== undefined) await this.zipCodeInput.fill(details.address.zipCode);
    if (details.phoneNumber !== undefined) await this.phoneInput.fill(details.phoneNumber);
    if (details.ssn !== undefined) await this.ssnInput.fill(details.ssn);
    if (details.username !== undefined) await this.usernameInput.fill(details.username);
    if (details.password !== undefined) await this.passwordInput.fill(details.password);
    if (details.confirmPassword !== undefined) await this.confirmPasswordInput.fill(details.confirmPassword);
  }

  async submit(): Promise<void> {
    await this.registerButton.click();
  }

  async register(details: RegistrationDetails): Promise<void> {
    await this.fill(details);
    await this.submit();
  }

  async expectSuccess(): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Parabank renders per-field errors in the 3rd cell of each row as
   * `<span id="{fieldName}.errors" class="error">...</span>`. There is no
   * accessible anchor (no role=alert, no aria-describedby) — the dotted-id
   * span is the only stable hook. Kept behind this helper so specs never
   * touch DOM.
   */
  private fieldErrorLocator(fieldName: string): Locator {
    const cssId = `${fieldName}.errors`.replace(/\./g, '\\.');
    return this.page.locator(`#${cssId}`);
  }

  async fieldError(fieldName: string): Promise<string | null> {
    const locator = this.fieldErrorLocator(fieldName);
    if ((await locator.count()) === 0) return null;
    return (await locator.first().innerText()).trim();
  }

  async expectFieldRequired(fieldName: string): Promise<void> {
    const message = await this.fieldError(fieldName);
    expect(message, `Expected required-field error for ${fieldName}`).toContain(Messages.requiredSuffix);
  }

  async expectUsernameTaken(): Promise<void> {
    await expect(this.fieldErrorLocator('customer.username')).toContainText(Messages.usernameAlreadyExists);
  }

  async expectPasswordsMismatch(): Promise<void> {
    await expect(this.fieldErrorLocator('repeatedPassword')).toContainText(Messages.passwordsDoNotMatch);
  }
}
