/**
 * Checks the experience rules that can be decided mechanically.
 *
 * Taste is not checkable and is not checked here. What is checkable, from the
 * studio's own quality standards (spec §7): every empty state names the action
 * that fills it, and every failure state carries the button that fixes it. A
 * screen that strands a visitor with nothing to press is the one defect a
 * machine can catch, so it does.
 *
 * Usage: node design/mockups/check-ease.mjs [sheet.html ...]
 */
import { chromium } from "@playwright/test";
import { readdirSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sheets =
  process.argv.length > 2
    ? process.argv.slice(2).map((a) => basename(a))
    : readdirSync(here)
        .filter((f) => /^\d\d-.*\.html$/.test(f))
        .sort();

const browser = await chromium.launch();
const page = await browser.newPage();
let fails = 0;
let frames = 0;

for (const sheet of sheets) {
  await page.goto(`file://${resolve(here, sheet)}`, { waitUntil: "load" });
  const rows = await page.$$eval("figure.frame", (fs) =>
    fs
      .map((f) => {
        const sid = f.querySelector("figcaption .sid")?.textContent?.trim() ?? "?";
        const dev = f.querySelector(".phone, .desk, .webframe");
        if (!dev) return null;
        // A .failure or .empty with no button inside it is a dead end.
        const failures = [...dev.querySelectorAll(".failure")].filter((e) => !e.querySelector(".btn")).length;
        const empties = [...dev.querySelectorAll(".empty")].filter((e) => !e.querySelector(".btn")).length;
        return { sid, failures, empties };
      })
      .filter(Boolean),
  );

  for (const r of rows) {
    frames++;
    const problems = [];
    if (r.failures) problems.push(`${r.failures} failure state(s) with no fix button`);
    if (r.empties) problems.push(`${r.empties} empty state(s) with no action`);
    if (problems.length) {
      fails++;
      console.log(`EASE  ${sheet}  ${r.sid}\n      ${problems.join("\n      ")}`);
    }
  }
}

await browser.close();
console.log(`${frames - fails}/${frames} frames pass the checkable rules. ${fails} to fix.`);
process.exit(fails ? 1 : 0);
