import { Page, Locator } from "@playwright/test";

export class ManageProcessesPage {
  public page: Page;
  public createProcessBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createProcessBtn = page.getByTestId("processList-addProcess-click");
  }
}
