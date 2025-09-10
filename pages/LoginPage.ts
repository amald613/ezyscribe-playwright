import { Page, Locator,expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly combinedError: Locator;
  readonly doctorDashboardText: Locator;
  readonly scribeDashboardText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });         
    this.passwordInput = page.locator('input[name="password"]');   
    this.submitButton = page.getByRole('button', { name: 'Submit' });     
     // Field-specific error messages
    this.emailError = page.getByText('Invalid email format');
    this.passwordError = page.getByText('Password must be at least 8');

    // Combined error message when both fields are valid format but credentials are incorrect
    this.combinedError = page.getByText('Invalid email or password');


    // this.doctorDashboardText = page.getByRole('button', { name: 'Record' });
    this.doctorDashboardText = page.getByRole('heading', { name: 'Application error: a server-' });

   
  }

  async goto() {
    await this.page.goto("https://appv2.ezyscribe.com"); 
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }


 // Error message getters
  async getEmailErrorMessage() {
    return await this.emailError.innerText().catch(() => "");
  }

  async getPasswordErrorMessage() {
    return await this.passwordError.innerText().catch(() => "");
  }

  async getCombinedErrorMessage() {
    await this.page.waitForLoadState("networkidle");
     try {
        await expect(this.combinedError).toBeVisible({ timeout: 5000 });
        return await this.combinedError.innerText().catch(() => "");
        } catch {
      // wait a bit and try once more
      await this.page.waitForTimeout(10000);
      await expect(this.combinedError).toBeVisible({ timeout: 50000 });
      return await this.combinedError.innerText().catch(() => "");
    }
  }



  async isDoctorDashboardVisible() {
    return this.doctorDashboardText.isVisible();
  }

  async isScribeDashboardVisible() {
    return this.doctorDashboardText.isVisible();
  }
}
