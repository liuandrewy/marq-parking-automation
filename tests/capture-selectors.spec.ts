import { test, expect } from '@playwright/test';
import fs from 'fs';

function getEnv(name: string, fallback?: string): string {
  const val = process.env[name] ?? fallback;
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
}

test('capture and validate selectors for Marq parking', async ({ page }) => {
  const url = getEnv('MARQ_URL', 'https://example.com/visitors/');

  await page.goto(url);

  // Candidate selectors (edit if your page differs)
  const selectors = {
    propertySelect: '#MainContent_ddl_Property',
    apartmentInput: '#MainContent_txt_Apartment',
    nextButtonText: 'next',
    plateInput: '#MainContent_txt_Plate',
    makeInput: '#MainContent_txt_Make',
    modelInput: '#MainContent_txt_Model',
    colorInput: '#MainContent_txt_Color',
    stateSelect: '#MainContent_ddl_State',
    reviewPlateInput: '#MainContent_txt_Review_PlateNumber',
    confirmCheckbox: '#MainContent_cb_Confirm',
    submitButtonText: 'submit',
  } as const;

  // Validate presence where possible (soft assertions to allow partial capture)
  await expect(page.locator(selectors.propertySelect)).toBeVisible();
  await expect(page.locator(selectors.apartmentInput)).toBeVisible();

  // Write selectors to JSON for bookmarklet generator
  const outPath = 'selectors-marq.json';
  fs.writeFileSync(outPath, JSON.stringify(selectors, null, 2), 'utf-8');
});


