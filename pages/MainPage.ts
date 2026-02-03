import { Page } from "@playwright/test";
import { Sidebar } from "./components/Sidebar";

export class MainPage {
  public page: Page;

  public sidebar: Sidebar;

  constructor(page: Page) {
    this.page = page;

    this.sidebar = new Sidebar(page);
  }

  async open() {
    await this.page.goto("/", { waitUntil: "networkidle" });
  }
}
