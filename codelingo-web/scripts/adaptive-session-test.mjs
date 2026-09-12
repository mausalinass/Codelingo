import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
const api = process.env.API_BASE_URL || "http://localhost:5080";
const user = "11111111-1111-1111-1111-111111111111";

async function lesson() {
  const response = await fetch(`${api}/api/lessons/csharp/conditions?userId=${user}`);
  assert.equal(response.status, 200);
  return response.json();
}

async function setMode(primaryTrait) {
  const response = await fetch(`${api}/api/demo/users/${user}/personality`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ primaryTrait }),
  });
  assert.equal(response.status, 200);
}

const reset = await fetch(`${api}/api/demo/users/${user}/reset`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
assert.equal(reset.status, 200);

const analytical = await lesson();
assert.equal(analytical.exercise.problems.length, 10);
assert.equal(new Set(analytical.exercise.problems.map((problem) => problem.prompt)).size, 10);
assert.ok(analytical.exercise.problems.every((problem) => problem.prompt.startsWith("Analyze")));

await setMode("PRACTICAL");
const practical = await lesson();
assert.equal(new Set(practical.exercise.problems.map((problem) => problem.prompt)).size, 10);
assert.ok(practical.exercise.problems.every((problem) => problem.prompt.startsWith("Build it")));
assert.notEqual(practical.exercise.problems[0].prompt, analytical.exercise.problems[0].prompt);

await setMode("VISUAL");
const visual = await lesson();
assert.equal(new Set(visual.exercise.problems.map((problem) => problem.prompt)).size, 10);
assert.ok(visual.exercise.problems.every((problem) => problem.prompt.includes("INPUT → LOGIC → OUTPUT")));

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const targets = [
  "¡Hola, Louis!", "Buenos días", "Gracias", "Por favor", "Me llamo Alex",
  "¿Cómo estás?", "Me gusta aprender", "Hasta mañana", "Buenas noches", "Adiós",
];

try {
  await page.goto(frontend);
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${frontend}/lesson/spanish/lang_phrases`);
  await page.getByRole("button", { name: /START LESSON|COMENZAR LECCIÓN|COMMENCER LA LEÇON/ }).click();
  await page.getByText(/Visual flow 1/).first().waitFor();

  const prompts = [];
  const louisImages = [];
  for (let index = 0; index < targets.length; index++) {
    prompts.push(await page.locator("section[aria-label] + div, section[aria-label]").first().textContent());
    louisImages.push(await page.getByAltText("Louis the Cardinal - Codelingo Mascot").getAttribute("src"));
    for (const token of targets[index].split(/\s+/)) {
      await page.getByRole("button", { name: token, exact: true }).click();
    }
    await page.getByRole("button", { name: /Check|Comprobar|Vérifier/, exact: true }).click();
    await page.getByRole("button", { name: /Continue|Continuar|Continuer/, exact: true }).click();
  }

  await page.waitForURL("**/complete");
  await page.getByText(/1 DAY|1 DÍA|1 JOUR/, { exact: true }).waitFor();
  assert.equal(new Set(prompts).size, 10, "spoken-language session must show ten different tasks");
  assert.ok(new Set(louisImages).size >= 3, "Louis must rotate through the three supplied poses");

  await page.goto(`${frontend}/learn`);
  await page.getByTitle(/1 day streak/).waitFor();
  const hero = page.locator("section").filter({ has: page.getByAltText(/Louis presenting/) }).first();
  const firstBackground = await hero.evaluate((element) => getComputedStyle(element).backgroundImage);
  await page.getByRole("button", { name: /Switch to (light|dark) mode/ }).first().click();
  const secondBackground = await hero.evaluate((element) => getComputedStyle(element).backgroundImage);
  assert.notEqual(firstBackground, secondBackground, "course hero must adapt its color treatment to the active theme");
  assert.deepEqual(errors, []);
  console.log("PASS adaptive sessions: 10 unique mode-specific coding problems, 10 distinct Spanish exercises, rotating Louis poses, and daily streak activation");
} finally {
  await browser.close();
  await setMode("ANALYTICAL");
}
