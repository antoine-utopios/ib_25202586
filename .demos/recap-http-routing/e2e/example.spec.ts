import { test, expect } from '@playwright/test';

test.describe('Site Playwright', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  })

  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {
    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Récupérer un élément et vérifier sa présence dans le DOM
    // await expect(page.getByRole('button', { name: 'Submit'})).toBeVisible()

    // Récupérer un enfant d'un élément parent
    // await page.getByRole('list').getByRole('link', { name: 'Home'}).click()

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });
});
