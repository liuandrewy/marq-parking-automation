import { test } from '@playwright/test';

test('open Register2Park and pause for manual recording', async ({ page }) => {
  await page.goto('https://www.register2park.com/register');
  // Opens Playwright Inspector and lets you record/insert actions interactively
  await page.pause();
});


