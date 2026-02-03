import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { ManageProcessesPage } from "../pages/ManageProcessesPage";

type UiFixtures = {
  loginPage: LoginPage;
  mainPage: MainPage;
  manageProcessesPage: ManageProcessesPage;
  authAsDefaultUser: () => Promise<void>;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },

  manageProcessesPage: async ({ page }, use) => {
    await use(new ManageProcessesPage(page));
  },

  authAsDefaultUser: async ({ loginPage }, use) => {
    await use(async () => {
      const email = process.env.USER_EMAIL!;
      const password = process.env.USER_PASSWORD!;
      await loginPage.open();
      await loginPage.login(email, password);
    });
  },
});

export { expect } from "@playwright/test";
