import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { Routes } from '../constants/routes';

/**
 * Parabank /overview.htm — the authenticated landing page.
 */
export class OverviewPage extends BasePage {
  readonly header: HeaderComponent;
  private readonly accountsTable: Locator;
  private readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.title = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountsTable = page.getByRole('table').first();
  }

  async open(): Promise<void> {
    await super.open(Routes.overview);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
    await expect(this.accountsTable).toBeVisible();
  }
}
