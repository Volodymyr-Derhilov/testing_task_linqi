import { Page, Locator } from "@playwright/test";

export class Sidebar {
  private page: Page;
  public processesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.processesLink = page.getByTestId("mainNav-Prozess-Dashboard");
  }
}
