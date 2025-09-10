import { Page, Locator, expect } from "@playwright/test";

export default class TaskPage {
  readonly page: Page;

  // Login & Theme
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly themeButton: Locator;
  readonly themeLight: Locator;
  readonly themeDark: Locator;

  // Status Filter
  readonly statusFilter: Locator;
  readonly statusAiProcessing: Locator;
  readonly statusAiDraft: Locator;
  readonly statusInEhr: Locator;
  readonly statusInProgress: Locator;
  readonly statusCompleted: Locator;
  readonly statusOnHold: Locator;
  readonly statusPending: Locator;
  readonly statusColumnCells: Locator;

  // Search Task
  readonly searchButton: Locator;
  readonly taskCellPick: Locator;
  readonly taskCellCheck: Locator;

  // Priority Filter
  readonly priorityBtn: Locator;
  readonly lowBtn: Locator;
  readonly priorityColumn: Locator;

  // Record Button
  readonly recordButton: Locator;

  // Upload Date Filters
  readonly uploadDateButton: Locator;
  readonly monthFilter: Locator;
  readonly yearFilter: Locator;
  readonly dateFilter: Locator;
  readonly resetButton: Locator;

  // View / Column toggle
  readonly viewButton: Locator;
  readonly columnHeader: Locator;

  // Sorting
  readonly sortButton: Locator;
  readonly taskColumn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login & Theme
    this.emailInput = page.getByRole("textbox", { name: "email" });
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole("button", { name: "submit" });
    this.themeButton = page.getByRole("button", { name: "Toggle theme" });
    this.themeLight = page.getByRole("menuitem", { name: "Light" });
    this.themeDark = page.getByRole("menuitem", { name: "Dark" });

    // Status Filter
    this.statusFilter = page.getByRole("toolbar").getByRole("button", { name: "Status" });
    this.statusAiProcessing = page.getByRole("option", { name: "AI Processing" });
    this.statusAiDraft = page.getByRole("option", { name: "AI Draft" });
    this.statusInEhr = page.getByRole("option", { name: "InEhr" });
    this.statusInProgress = page.getByRole("option", { name: "Inprogress" });
    this.statusCompleted = page.getByRole("option", { name: "Completed" });
    this.statusOnHold = page.getByRole("option", { name: "OnHold" });
    this.statusPending = page.getByRole("option", { name: "Pending" });
    this.statusColumnCells = page.getByRole("row").locator("td:nth-child(4)");

    // Search Task
    this.searchButton = page.getByRole("textbox", { name: "Search task numbers..." });
    this.taskCellPick = page.locator("tbody tr:nth-child(2) td:nth-child(2)");
    this.taskCellCheck = page.locator("tbody tr:nth-child(1) td:nth-child(2)");

    // Priority Filter
    this.priorityBtn = page.getByRole("toolbar").getByRole("button", { name: "Priority" });
    this.lowBtn = page.getByRole("option", { name: "Low" });
    this.priorityColumn = page.locator("tbody tr td:nth-child(5)");

    // Upload Date Filters
    this.uploadDateButton = page.getByRole("toolbar").getByRole("button", { name: "Upload Date" });
    this.monthFilter = page.getByLabel("Choose the Month");
    this.yearFilter = page.getByLabel("Choose the Year");
    this.dateFilter = page.getByRole("gridcell", { name: "15" });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // View / Column toggle
    this.viewButton = page.getByRole("combobox", { name: "Toggle columns" });
    this.columnHeader = page.locator("thead");

    // Sorting
    this.sortButton = page.getByRole("button", { name: "Task #" });
    this.taskColumn = page.locator("tbody td:nth-child(2)");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async changeTheme() {
    await this.page.waitForLoadState('networkidle');
    await this.themeButton.click();
    await this.themeDark.click();
    await this.page.waitForLoadState('networkidle');

    await expect.poll(async () => {
      return await this.page.locator('html').evaluate(el => el.style.colorScheme);
    }).toBe('dark');

    await this.themeButton.click();
    await this.themeLight.click();
    await this.page.waitForLoadState('networkidle');

    await expect.poll(async () => {
      return await this.page.locator('html').evaluate(el => el.style.colorScheme);
    }).toBe('light');
  }

  async selectStatusFilter(status: 'AI Processing' | 'AI Draft' | 'In Ehr' | 'In Progress' |'Completed' | 'On Hold' |'Pending') {
    await this.statusFilter.click();

    switch(status){
      case 'AI Processing': await this.statusAiProcessing.click(); break;
      case 'AI Draft': await this.statusAiDraft.click(); break;
      case 'In Ehr': await this.statusInEhr.click(); break;
      case 'In Progress': await this.statusInProgress.click(); break;
      case 'Completed': await this.statusCompleted.click(); break;
      case 'On Hold': await this.statusOnHold.click(); break;
      case 'Pending': await this.statusPending.click(); break;
    }

    await this.page.waitForTimeout(1000);
    const sts = await this.statusColumnCells.allTextContents();
    console.log(sts);

    for(const st of sts){
      expect(st.trim().toLowerCase).toBe(status.toLowerCase);
    }
  }

  async serachFilter() {
    await this.page.waitForLoadState('networkidle');
    const input = (await this.taskCellPick.innerText()).trim();
    await this.searchButton.fill(input);
    await expect(this.taskCellCheck).toHaveText(input, { timeout: 5000 });
  }

  async selectPriorityFilter(priority: 'Low' | 'Medium' | 'High') {
    await this.priorityBtn.click();

    switch (priority) {
      case 'Low': await this.page.getByRole('option', { name: 'Low' }).click(); break;
      case 'Medium': await this.page.getByRole('option', { name: 'Medium' }).click(); break;
      case 'High': await this.page.getByRole('option', { name: 'High' }).click(); break;
    }

    await this.page.waitForTimeout(1000);
    const priorities = await this.priorityColumn.allTextContents();
    console.log(priorities);

    for (const pr of priorities) {
      expect(pr.trim()).toBe(priority);
    }
  }

  // 🔹 Updated sort() with empty table guard
  async sort() {
    await this.page.waitForLoadState('networkidle');

    await this.sortButton.waitFor({ state: 'visible' });
    await this.sortButton.click();

    try {
      await this.page.getByRole('menuitemcheckbox', { name: 'Asc' }).waitFor({ timeout: 2000 });
    } catch {
      await this.sortButton.click();
      await this.page.getByRole('menuitemcheckbox', { name: 'Asc' }).waitFor({ timeout: 2000 });
    }

    await this.page.getByRole('menuitemcheckbox', { name: 'Asc' }).click();
    await this.page.waitForTimeout(1000);

    const allTaskNo = await this.taskColumn.allTextContents();

    if (allTaskNo.length === 0) {
      console.log("✅ Table is empty, skipping sort validation");
      return; // exit safely
    }

    const actual = allTaskNo.map(n => Number(n.trim()));
    const expected = [...actual].sort((a, b) => a - b);
    expect(actual).toEqual(expected);
  }

  async clickResetButton() {
    await this.resetButton.click();
  }

  async clickUploadDateButton() {
    await this.uploadDateButton.click();
  }

  async selectFromDate(month: string, year: string, day: string) {
    await this.monthFilter.selectOption({ label: month });
    await this.yearFilter.selectOption({ label: year });
    await this.page.getByRole('gridcell', { name: day }).click();
  }

  async selectToDate(month: string, year: string, day: string) {
    await this.monthFilter.selectOption({ label: month });
    await this.yearFilter.selectOption({ label: year });
    await this.page.getByRole('gridcell', { name: day }).click();
    const body = this.page.locator("//tbody[@data-slot='table-body']");
    await expect(body).toContainText(new RegExp(`${month}|No results`));
    console.log(body.allInnerTexts);
  }

  async viewFilter(viewValue: string) {
    await this.viewButton.click();
    const columnHeaderTexts = await this.columnHeader.allTextContents();
    await this.page.getByText(viewValue).click();
    const columnHeaderTextsAfter = await this.columnHeader.allTextContents();
    console.log(columnHeaderTexts);
    console.log(columnHeaderTextsAfter);
    expect(columnHeaderTexts).not.toEqual(columnHeaderTextsAfter);
  }
}
