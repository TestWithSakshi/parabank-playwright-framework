import { Page } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { HomePage } from '../pages/home.page';
import { buildRegistration } from '../test-data/user-factory';
import { RegistrationDetails } from '../types/user.types';
import { logger } from '../utils/logger';

export interface ProvisionedAccount {
  details: RegistrationDetails;
  fullName: string;
}

/**
 * Provisions a Parabank account through the UI (the only supported channel
 * — Parabank exposes no createCustomer REST endpoint for anonymous callers)
 * and returns the credentials in a logged-out state so callers can drive
 * the Sign In UI against a known-good account.
 */
export async function provisionAccount(
  page: Page,
  overrides: Partial<RegistrationDetails> = {}
): Promise<ProvisionedAccount> {
  const details = buildRegistration(overrides);
  const registerPage = new RegisterPage(page);
  const homePage = new HomePage(page);

  await registerPage.open();
  await registerPage.register(details);
  const fullName = `${details.firstName} ${details.lastName}`;
  await registerPage.expectSuccess();
  logger.info('Provisioned Parabank account', { username: details.username });

  // Registration auto-logs-in the new user — log back out so callers get a
  // clean logged-out browser state.
  await homePage.header.logout();

  return { details, fullName };
}
