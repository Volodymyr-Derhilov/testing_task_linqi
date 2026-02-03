import { expect, Page, Locator } from "@playwright/test";

export class LoginPage {
  public page: Page;
  public email: Locator;
  public password: Locator;
  public loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByTestId("login-username");
    this.password = page.getByTestId("login-password");
    this.loginBtn = page.getByTestId("login-submit");
  }

  async open() {
    await this.page.goto("/", { waitUntil: "networkidle" });
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
  }
}
