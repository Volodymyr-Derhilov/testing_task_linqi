import { Page, Locator } from "@playwright/test";

export class ManageProcessesPage {
  public page: Page;
  public createProcessBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createProcessBtn = page.getByTestId("processList-addProcess-click");
  }

  async openDesignerInNewTab(): Promise<Page> {
    const [designerPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.createProcessBtn.click(),
    ]);

    await designerPage.bringToFront();
    await designerPage.waitForLoadState("domcontentloaded");
    return designerPage;
  }
}
