import { Page } from '@playwright/test';
import { env } from '../config/env.config';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** All routes are relative to BASE_URL so tests never see hardcoded hosts. */
  protected async open(path: string): Promise<void> {
    await this.page.goto(`${env.baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  }

  get url(): string {
    return this.page.url();
  }
}
