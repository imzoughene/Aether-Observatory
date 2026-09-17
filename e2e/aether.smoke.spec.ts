import { expect, test } from '@playwright/test';

test('boots and navigates from dashboard to probe detail', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Probes', exact: true }).click();
  await expect(page).toHaveURL(/\/probes$/);
  await expect(page.getByRole('heading', { name: 'Probes', exact: true })).toBeVisible();
  await expect(page.getByRole('row', { name: /Public API/ })).toBeVisible();

  await page.getByRole('button', { name: 'Open Public API' }).click();
  await expect(page).toHaveURL(/\/probes\/probe-001\/overview$/);
  await expect(page.getByRole('heading', { name: 'Public API', exact: true })).toBeVisible();
  await expect(page.getByText('Probe detail', { exact: true })).toBeVisible();
});
