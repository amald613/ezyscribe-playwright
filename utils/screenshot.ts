import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

export class ScreenshotUtils {
  private static screenshotDir = path.join(process.cwd(), "screenshots");

  /**
   * Capture screenshot with custom name
   * @param page Playwright page object
   * @param fileName name of the screenshot file
   */
  static async capture(page: Page, fileName: string): Promise<void> {
    try {
      // Ensure screenshots folder exists
      if (!fs.existsSync(this.screenshotDir)) {
        fs.mkdirSync(this.screenshotDir, { recursive: true });
      }

      const filePath = path.join(this.screenshotDir, `${fileName}.png`);
      await page.screenshot({ path: filePath, fullPage: true });

      console.log(`✅ Screenshot saved: ${filePath}`);
    } catch (error) {
      console.error("❌ Failed to take screenshot:", error);
    }
  }
}
