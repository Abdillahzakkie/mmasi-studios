/**
 * Fails when a frame's content does not fit the device it is drawn on.
 *
 * Two frame kinds, two rules:
 *
 *  - A fixed frame (`.phone`, `.desk`) is one viewport, `overflow:hidden`. It is
 *    checked on BOTH axes: a frame that grew past its screen loses its primary
 *    action and nothing says so. A button clipped below the fold is the failure
 *    this exists to catch.
 *
 *  - A web-page frame (`.webframe`) is a whole scrolling page. Its height is the
 *    page length, so height is NOT a fault. Only horizontal bleed is — a column
 *    or hero wider than the device means the layout broke.
 *
 * Usage: node design/mockups/check-overflow.mjs [sheet.html ...]
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
const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
let bad = 0;
let checked = 0;

for (const sheet of sheets) {
  await page.goto(`file://${resolve(here, sheet)}`, { waitUntil: "load" });
  const rows = await page.$$eval("figure.frame", (frames) =>
    frames.map((f) => {
      const sid = f.querySelector("figcaption .sid")?.textContent?.trim() ?? "?";
      const dev = f.querySelector(".phone, .desk, .webframe");
      if (!dev) return { sid, skip: true };
      const web = dev.classList.contains("webframe");
      const over = [];
      const name = (e) => e.className.split(" ").filter(Boolean).slice(0, 2).join(".") || e.tagName.toLowerCase();

      // Height is checked only on fixed frames — a web page is meant to be tall.
      if (!web) {
        const tall = [dev, ...dev.querySelectorAll(".pbody, .pcontent, .pane, .site, .sitebody")];
        for (const b of tall) {
          const st = getComputedStyle(b);
          if (b !== dev && (st.overflowY === "auto" || st.overflowY === "scroll")) continue;
          if (b.scrollHeight > b.clientHeight + 1) {
            over.push(`${name(b)} +${b.scrollHeight - b.clientHeight}px tall`);
          }
        }
      }

      // Nothing legitimately clips sideways, on either frame kind — except a
      // field that truncates with an ellipsis on purpose (a share URL, an
      // email). That is an affordance, not a lost layout, so it is exempt.
      for (const b of [dev, ...dev.querySelectorAll("*")]) {
        const st = getComputedStyle(b);
        const hides = b === dev || st.overflowX === "hidden" || st.overflowX === "clip";
        const ellipsis = st.textOverflow === "ellipsis" && st.whiteSpace === "nowrap";
        if (hides && !ellipsis && b.scrollWidth > b.clientWidth + 1) {
          over.push(`${name(b)} +${b.scrollWidth - b.clientWidth}px wide`);
        }
      }

      // On a fixed frame, a card that hides a BUTTON has taken the action away
      // while the shell itself did not grow. A web page has no fold, so skip it.
      if (!web) {
        const devBottom = dev.getBoundingClientRect().bottom;
        for (const btn of dev.querySelectorAll(".btn")) {
          const r = btn.getBoundingClientRect();
          if (r.height === 0) continue;
          let limit = devBottom;
          for (let a = btn.parentElement; a && a !== dev.parentElement; a = a.parentElement) {
            const st = getComputedStyle(a);
            if (st.overflowY === "hidden" || st.overflowY === "clip") {
              limit = Math.min(limit, a.getBoundingClientRect().bottom);
            }
          }
          if (r.bottom > limit + 1) {
            over.push(`"${(btn.textContent || "").trim().slice(0, 24)}" cut off by ${Math.round(r.bottom - limit)}px`);
          }
        }
      }
      return { sid, over: over.slice(0, 4) };
    }),
  );

  for (const r of rows) {
    if (r.skip) continue;
    checked++;
    if (r.over.length) {
      bad++;
      console.log(`CLIPPED  ${sheet}  ${r.sid}  ${r.over.join(", ")}`);
    }
  }
}

await browser.close();
console.log(`${checked - bad}/${checked} frames fit. ${bad} clipped.`);
process.exit(bad ? 1 : 0);
