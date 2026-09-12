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
  await page.getByRole("button", { name: "COMPROBAR", exact: true }).click();
  await page.getByRole("button", { name: last ? "VER MI RESULTADO" : "SIGUIENTE", exact: true }).click();
}

try {
  const reset = await fetch(api + "/api/demo/users/11111111-1111-1111-1111-111111111111/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  assert.equal(reset.status, 200);
  await page.goto(frontend + "/");
  assert.equal(await page.getByText("Continue (Mauricio)").count(), 0);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Landing must not overflow at 390px");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("link", { name: "GET STARTED" }).click();
  await page.getByRole("button", { name: /Español/ }).click();
  await page.getByRole("button", { name: "CONTINUAR", exact: true }).click();
  await page.reload();
  await page.getByRole("heading", { name: "¿Qué quieres programar?" }).waitFor();
  await page.getByRole("button", { name: /C#/ }).click();
  await page.getByRole("button", { name: "CONTINUAR", exact: true }).click();
  await page.getByRole("button", { name: /Conozco variables y condiciones/ }).click();
  await page.getByRole("button", { name: "COMENZAR PRUEBA DE 5 PREGUNTAS", exact: true }).click();
  await chooseAnswer("12");
  await chooseAnswer("5");
  await chooseAnswer("Age is at least 18");
  await chooseAnswer("3");
  await chooseAnswer("4", true);
  await page.getByText(/Condiciones · C#/).waitFor();
  await page.getByRole("button", { name: "EMPEZAR EN CONDICIONES", exact: true }).click();
  await page.waitForURL("**/lesson/csharp/conditions");
  await page.getByRole("button", { name: "COMENZAR LECCIÓN", exact: true }).waitFor();
  const saved = await fetch(api + "/api/users/11111111-1111-1111-1111-111111111111/onboarding");
  assert.equal(saved.status, 200);
  const state = await saved.json();
  assert.equal(state.onboardingCompleted, true);
  assert.equal(state.startingLessonId, "conditions");
  assert.equal(state.correctAnswers, 4);
  await page.goto(frontend + "/learn");
  await page.getByLabel("Louis connected").waitFor();
  assert.equal(await page.getByRole("button", { name: /Pause Louis|Resume Louis/ }).count(), 0);
  await page.getByTitle(/0 day streak/).waitFor();
  assert.equal(await page.locator(".louis-roamer").count(), 0, "Louis must stay inside the learning path");
  assert.ok(await page.locator('img[src*="louis-"][src*="2_5d"]').count() >= 3, "2.5D Louis poses appear throughout the path");
  await page.getByRole("button", { name: "Idioma de explicación" }).click();
  await page.getByRole("option", { name: /Français/ }).click();
  await page.getByRole("link", { name: "Parcours", exact: true }).waitFor();
  await page.getByRole("button", { name: /Langues: choose a learning track/ }).click();
  await page.getByRole("button", { name: "Learn Japanese" }).click();
  await page.getByText("Français", { exact: true }).waitFor();
  await page.getByRole("link", { name: "Progrès", exact: true }).click();
  await page.getByRole("heading", { name: "Progress" }).waitFor();
  assert.deepEqual(errors, []);
  console.log("PASS product upgrade: flag menu, independent UI/course languages, localized onboarding, zero streak, static 2.5D Louis path poses and dashboard navigation");
} finally {
  await browser.close();
}
