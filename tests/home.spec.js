import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('Profile section displays user data correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.waitForFunction(() => window.$store !== undefined);

    const user = await page.evaluate(() => {
      const seed = Date.now() % 10000000;
      const userData = {
        name: 'John Doe' + seed,
        email: 'john.doe@example' + seed + '.com',
        phone: String(seed),
        address: seed + ' Fake Street',
        avatar: 'https://example.com/avatar.jpg',
        createdAt: new Date()
      };

      window.$store.updateUserData(userData);
      return userData;
    });

    await expect(page.locator('.profile-avatar')).toBeVisible();
    await expect(page.locator('.profile-name')).toContainText(user.name);
    await expect(page.locator('.profile-email')).toContainText(user.email);
    await expect(page.locator('.profile-phone')).toContainText(user.phone);
    await expect(page.locator('.profile-address')).toContainText(user.address);
    await expect(page.locator('.profile-createdAt')).toContainText('Joined: ' + formatDate(user.createdAt));
  });

  test('Date picker - Chart', async ({ page }) => {
    let lowerValue = 42000;
    let upperValue = 43000;
    await page.route('**/index/cc/v1/historical/days?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          Data: [
            { TIMESTAMP: 1741437900, CLOSE: lowerValue },
            { TIMESTAMP: 1741437930, CLOSE: 42500 },
            { TIMESTAMP: 1741437960, CLOSE: upperValue }
          ]
        }),
      });
    });

    await page.goto('http://localhost:3000'); // Change to your actual URL

    //  select dates
    await page.click('#dateFrom')
    await page.fill('#dateFrom input', '2024/03/02');
    await page.locator('.dp__action_select').first().click();

    await page.click('#dateTo')
    await page.fill('#dateTo input', '2024/04/02');
    await page.locator('.dp__action_select').first().click();

    await page.click('#applyDates');

    // make sure that upper and lower values are present
    await expect(page.locator(".apexcharts-yaxis-texts-g").first()).toContainText("$" + lowerValue + ".00")
    await expect(page.locator(".apexcharts-yaxis-texts-g").first()).toContainText("$" + upperValue + ".00")
  });
});

function formatDate(date) {
  return new Date(date).toLocaleString();
}
