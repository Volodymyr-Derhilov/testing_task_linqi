import { Page } from "@playwright/test";
import { test, expect } from "../fixtures/uiFixtures";

test.describe("Process creation flow", () => {
  test("Create process - step by step", async ({
    authAsDefaultUser,
    mainPage,
    manageProcessesPage,
  }) => {
    let designerPage: Page;
    let processName: string;

    await authAsDefaultUser();

    await test.step("Open Processes from sidebar", async () => {
      await mainPage.sidebar.processesLink.isVisible();
      await mainPage.sidebar.processesLink.click();
      await expect(mainPage.page).toHaveURL(/processDashboard/);
    });

    await test.step("Step 2: Click Create process and open Process Designer", async () => {
      await expect(manageProcessesPage.createProcessBtn).toBeVisible();
      [designerPage] = await Promise.all([
        mainPage.page.context().waitForEvent("page"),
        manageProcessesPage.createProcessBtn.click(),
      ]);

      await designerPage.waitForLoadState("domcontentloaded");
      await expect(designerPage).toHaveURL(/processDesigner/);
      await expect(designerPage.getByTestId("txt-processName")).toBeVisible();
    });

    await test.step("Step 3: Set process name", async () => {
      processName = `test-${Date.now()}`;

      const nameInput = designerPage.getByTestId("txt-processName");
      await expect(nameInput).toBeVisible();

      await nameInput.fill(processName);
      await nameInput.press("Enter");
      await expect(nameInput).toHaveValue(processName);
    });

    await test.step('Step 4: Add "Process start" node to canvas', async () => {
      const actionsBtn = designerPage.getByTestId("pdActions-click");
      await expect(actionsBtn).toBeVisible();
      await actionsBtn.click();

      const processStartItem = designerPage.getByTestId("pd-actions-11");
      await expect(processStartItem).toBeVisible();

      const emptyDropTarget = designerPage.getByTestId("pdEmpty-createAction");
      await expect(emptyDropTarget).toBeVisible();
      await processStartItem.dragTo(emptyDropTarget);

      await expect(emptyDropTarget).toBeHidden({ timeout: 15000 });
    });

    await test.step("Step 5: Close Actions panel and save process", async () => {
      const closeActionsBtn = designerPage.locator(
        '//*[contains(@class, "ms-Panel-closeButton")]',
      );
      await expect(closeActionsBtn).toBeVisible();
      await closeActionsBtn.click();

      const saveBtn = designerPage.getByTestId("pdSave-click");
      await expect(saveBtn).toBeVisible();
      await saveBtn.click();

      await designerPage.waitForTimeout(1000);
    });

    await test.step("Step 6: Verify process number is assigned", async () => {
      const expectedTitlePattern = new RegExp(
        `\\[E\\]\\s+${processName}\\s+-\\s+Process Designer`,
      );

      await expect
        .poll(async () => await designerPage.title(), {
          timeout: 15000,
          message: "Title should contain process name and 'Process Designer'",
        })
        .toMatch(expectedTitlePattern);

      const nameInput = designerPage.getByTestId("txt-processName");
      await expect(nameInput).toBeVisible();
      await expect(nameInput).toHaveValue(processName);

      const paperCanvas = designerPage.locator(
        ".linqi-graph-panZoomablePaperCanvas",
      );
      const nodes = paperCanvas.locator(".linqi-graph-nodeContainer");
      await expect(paperCanvas).toHaveCount(1);
      await expect(nodes).toHaveCount(1);
    });
  });
});
