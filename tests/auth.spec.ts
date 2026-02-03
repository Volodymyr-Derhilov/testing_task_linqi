import { test, expect } from "../fixtures/uiFixtures";

test.describe("Authentication check", () => {
  test("Verify that user can successfully log in", async ({
    authAsDefaultUser,
    loginPage,
  }) => {
    await authAsDefaultUser();
    await expect(loginPage.page).toHaveURL("https://linqi.wecantest.it/");
  });
});
