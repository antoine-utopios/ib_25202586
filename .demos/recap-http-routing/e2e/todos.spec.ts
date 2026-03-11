import { test, expect } from '@playwright/test';

test.describe('Site Perso', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('redirects to /test', async ({ page }) => {
    await expect(page).toHaveURL('http://localhost:4200/test');
  });

  test('has button with \'Get Todos\'', async ({ page }) => {
    // await expect(page.getByRole('button', { name: 'Get Todos' })).toBeVisible();
    await expect(page.getByRole('button')).toContainText(/Get Todos/);
  })


  test('to print loading message when pressing the button', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Todos' }).click();
    await expect(page.getByText('Chargement...')).toBeVisible();
  });

  test('to print error message when error occured', async ({ page }) => {
    page.route('https://jsonplaceholder.typicode.com/todos/', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({
          message: 'Marche po'
        })
      })
    })

    await page.getByRole('button', { name: 'Get Todos' }).click();
    await expect(page.getByText('Problème lors de la récupération')).toBeVisible();
    await expect(page.getByText('Marche po')).toBeVisible();
  });

  test('to print custom message when no todo found', async ({ page }) => {
    page.route('https://jsonplaceholder.typicode.com/todos/', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([])
      })
    })

    await page.getByRole('button', { name: 'Get Todos' }).click();
    await expect(page.getByText('Pas de todos trouvées')).toBeVisible();
  });

  test('to load todos when pressing the button', async ({ page }) => {
    page.route('https://jsonplaceholder.typicode.com/todos/', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            userId: 1,
            id: 1,
            title: 'Title A',
            completed: false
          },
          {
            userId: 1,
            id: 4,
            title: 'Title B',
            completed: true
          },
          {
            userId: 1,
            id: 3,
            title: 'Title C',
            completed: false
          },
          {
            userId: 2,
            id: 4,
            title: 'Title D',
            completed: false
          },
          {
            userId: 3,
            id: 5,
            title: 'Title E',
            completed: false
          },
        ])
      })
    })

    await page.getByRole('button', { name: 'Get Todos' }).click();
    await expect(page.getByTestId('todo-5')).toBeVisible();
  });

});
