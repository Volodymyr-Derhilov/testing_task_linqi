import { Page } from "@playwright/test";
import { test, expect } from "../fixtures/uiFixtures";
import { ProcessCreatePage } from "../pages/ProcessCreatePage";

test.describe("Process creation flow", () => {
  test("Create process - step by step", async ({
    authAsDefaultUser,
    mainPage,
    manageProcessesPage,
  }) => {
    let designerPage: Page;
    let processName: string;
    let processDesignPage: ProcessCreatePage;

    await authAsDefaultUser();

    await test.step("Open Processes from sidebar", async () => {
      await mainPage.sidebar.processesLink.click();
      await expect(mainPage.page).toHaveURL(/processDashboard/);
    });

    await test.step("Step 2: Click Create process and open Process Designer", async () => {
      await expect(manageProcessesPage.createProcessBtn).toBeVisible();
      [designerPage] = await Promise.all([
        mainPage.page.context().waitForEvent("page"),
        manageProcessesPage.createProcessBtn.click(),
      ]);

      await designerPage.bringToFront();
      processDesignPage = new ProcessCreatePage(designerPage);

      await designerPage.waitForLoadState("domcontentloaded");
      await expect(designerPage).toHaveURL(/processDesigner/);
      await expect(processDesignPage.userNameInput).toBeVisible();
    });

    await test.step("Step 3: Set process name", async () => {
      processName = `test-${Date.now()}`;

      await processDesignPage.userNameInput.fill(processName);
      await processDesignPage.userNameInput.press("Enter");
      await expect(processDesignPage.userNameInput).toHaveValue(processName);
    });

    await test.step('Step 4: Add "Process start" node to canvas', async () => {
      await processDesignPage.actionsBtn.click();
      await expect(processDesignPage.processStartItem).toBeVisible();

      await expect(processDesignPage.emptyDropTarget).toBeVisible();
      await processDesignPage.processStartItem.dragTo(
        processDesignPage.emptyDropTarget,
      );

      await expect(processDesignPage.emptyDropTarget).toBeHidden({
        timeout: 15000,
      });
    });

    await test.step("Step 5: Close Actions panel and save process", async () => {
      await processDesignPage.closeActionsBtn.click();
      await processDesignPage.saveBtn.click();
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

      await expect(processDesignPage.userNameInput).toBeVisible();
      await expect(processDesignPage.userNameInput).toHaveValue(processName);
      await expect(processDesignPage.paperCanvas).toHaveCount(1);
      await expect(processDesignPage.nodes).toHaveCount(1);
    });
  });
});
