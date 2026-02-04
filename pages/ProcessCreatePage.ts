import { Page, Locator } from "@playwright/test";

export class ProcessCreatePage {
  public page: Page;
  public userNameInput: Locator;
  public actionsBtn: Locator;
  public processStartItem: Locator;
  public emptyDropTarget: Locator;
  public closeActionsBtn: Locator;
  public saveBtn: Locator;
  public paperCanvas: Locator;
  public droppedNode: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userNameInput = page.getByTestId("txt-processName");
    this.actionsBtn = page.getByTestId("pdActions-click");
    this.processStartItem = page.getByTestId("pd-actions-11");
    this.emptyDropTarget = page.getByTestId("pdEmpty-createAction");
    this.closeActionsBtn = page.locator(
      '//*[contains(@class, "ms-Panel-closeButton")]',
    );
    this.saveBtn = page.getByTestId("pdSave-click");
    this.paperCanvas = page.locator(".linqi-graph-panZoomablePaperCanvas");
    this.droppedNode = this.paperCanvas.locator(".linqi-graph-nodeContainer");
  }

  async setProcessName(name: string) {
    await this.userNameInput.fill(name);
    await this.userNameInput.press("Enter");
  }

  async openActions() {
    await this.actionsBtn.click();
  }

  async addProcessStartNode() {
    await this.processStartItem.dragTo(this.emptyDropTarget);
  }

  async save() {
    await this.saveBtn.click();
  }

  async closeActions() {
    await this.closeActionsBtn.click();
  }
}
