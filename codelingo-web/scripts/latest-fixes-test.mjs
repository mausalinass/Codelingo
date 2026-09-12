import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(frontend + "/profile");

  await page.getByRole("button", { name: "Select Learning Track" }).click();
  await page.getByRole("button", { name: "Coding", exact: true }).click();
  await page.getByRole("button", { name: /python logo Python/ }).click();
  await page.waitForURL("**/learn");

  await page.getByRole("link", { name: /Profile|Perfil|Profil/, exact: true }).click();
  await page.waitForURL("**/profile");
  await page.getByRole("button", { name: /Coding: choose a learning track|Programación: choose a learning track/ }).click();
  await page.waitForURL("**/learn");

  await page.goto(frontend + "/profile");
  await page.getByRole("button", { name: "Learn JavaScript" }).click();
  await page.waitForURL("**/learn");

  const questToggle = page.getByRole("button", { name: /Daily Quests|Retos diarios|Quêtes quotidiennes/ });
  await questToggle.click();
  assert.equal(await questToggle.getAttribute("aria-expanded"), "true");
  assert.equal(await page.locator("#daily-quests-panel > button").count(), 3);

  await page.getByRole("button", { name: /Explanation language|Idioma de explicación|Langue d'explication/ }).click();
  const usFlag = page.locator('svg[data-flag="us"]').first();
  await usFlag.waitFor();
  assert.equal(await usFlag.locator('[data-flag-stripe="red"]').count(), 7);
  assert.equal(await usFlag.locator('[data-flag-star="true"]').count(), 50);

  await page.goto(frontend + "/lesson/python/hello");
  await page.getByRole("button", { name: /START LESSON|COMENZAR LECCIÓN|COMMENCER LA LEÇON/ }).click();
  await page.getByText("Hello, Louis!", { exact: true }).waitFor();
  assert.ok(await page.getByText(/print\("texto"\)/).count(), "Python syntax hint should appear next to the required greeting");
  assert.ok(await page.getByText(/Hello, Louis!/).count() >= 2, "Louis and the task card should both state the exact greeting");

  assert.deepEqual(errors, []);
  console.log("PASS latest fixes: correct US flag, navigable track menus, daily quest drawer, and explicit Louis lesson target");
} finally {
  await browser.close();
}
