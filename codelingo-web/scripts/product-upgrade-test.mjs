import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
const api = process.env.API_BASE_URL || "http://localhost:5080";
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

async function chooseAnswer(name, last = false) {
  await page.getByRole("button", { name, exact: true }).click();
  await page.getByRole("button", { name: "CHECK", exact: true }).click();
  await page.getByRole("button", { name: last ? "SEE MY RESULT" : "NEXT", exact: true }).click();
}

try {
  await page.goto(frontend + "/");
  assert.equal(await page.getByText("Continue (Mauricio)").count(), 0);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Landing must not overflow at 390px");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("link", { name: "GET STARTED" }).click();
  await page.getByRole("button", { name: /Español/ }).click();
  await page.getByRole("button", { name: "CONTINUE", exact: true }).click();
  await page.reload();
  await page.getByRole("heading", { name: "Choose your programming track" }).waitFor();
  await page.getByRole("button", { name: /C# Enterprise backend/ }).click();
  await page.getByRole("button", { name: "CONTINUE", exact: true }).click();
  await page.getByRole("button", { name: /I know variables and conditions/ }).click();
  await page.getByRole("button", { name: "START THE 5-QUESTION TEST", exact: true }).click();
  await chooseAnswer("12");
  await chooseAnswer("5");
  await chooseAnswer("Age is at least 18");
  await chooseAnswer("3");
  await chooseAnswer("4", true);
  await page.getByText("Conditions · C#", { exact: true }).waitFor();
  await page.getByRole("button", { name: "START AT CONDITIONS", exact: true }).click();
  await page.waitForURL("**/lesson/csharp/conditions");
  const saved = await fetch(api + "/api/users/11111111-1111-1111-1111-111111111111/onboarding");
  assert.equal(saved.status, 200);
  const state = await saved.json();
  assert.equal(state.onboardingCompleted, true);
  assert.equal(state.startingLessonId, "conditions");
  assert.equal(state.correctAnswers, 4);
  await page.goto(frontend + "/learn");
  const pause = page.getByRole("button", { name: "Pause Louis" }).first();
  await pause.click();
  await page.reload();
  await page.getByRole("button", { name: "Resume Louis" }).first().waitFor();
  await page.getByRole("link", { name: "Progress", exact: true }).click();
  await page.getByRole("heading", { name: "Progress" }).waitFor();
  assert.deepEqual(errors, []);
  console.log("PASS product upgrade: public landing, onboarding, deterministic placement, persisted recommendation, Louis pause and dashboard navigation");
} finally {
  await browser.close();
}
