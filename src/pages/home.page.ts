import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { Routes } from '../constants/routes';

/** Parabank /index.htm — the public landing page hosting the login panel. */
export class HomePage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async open(): Promise<void> {
    await super.open(Routes.home);
  }
}
