# MmasiEjikeme Studios — project instructions

## Mockups first — always update the mockups before you change the UI

For any design or UI work in this project, update the mockups in `design/mockups/`
**before** you touch a single component, style, or page. The mockups are the
source of truth for the design; the built UI follows them, not the other way
round. This rule is not optional and it binds every session and every subagent.

What this means in practice:

- A design or UI change starts in `design/mockups/`. Edit the relevant sheet
  (`01-public-desktop`, `02-public-mobile`, or `03-admin`) and `system.css`
  first, so the new layout, component, or flow exists as a frame before any
  `src/` code changes.
- Keep token parity: the `--mm-*` CSS variables in `src/styles/global.ts` hold
  the same values as `design/mockups/system.css`. When you change one, change the
  other in the same pass.
- Re-run the mockup checks after editing them, from `design/mockups/`:
  `node check-overflow.mjs && node check-ease.mjs && node render-sheets.mjs && node build-manifest.mjs`.
- Only once the mockup reflects the target design do you implement it in `src/`
  so the built screen matches the frame.
- If a change reaches the UI without a matching mockup update, that is a process
  error: update the mockup to match, then reconcile the code.

This applies to new screens, redesigns, component restyles, and layout changes
alike. A copy-only change (editing wording through the admin content editor, for
example) is not a design change and does not need a mockup update.

## Stack and conventions

Next.js 16 (App Router, Turbopack), React 19, styled-components 6 with CSS-var
`--mm-*` tokens (no theme object), Mongoose, jose, bcrypt. TypeScript, Biome
(tabs, width 4, double quotes, semicolons). `@/*` maps to `src/*`. Co-located
`styled.tsx` per component, `*Styled` component names, `$`-prefixed transient
props. The public site defaults to the dark-cinematic theme with an editorial
light toggle; the admin is always light. Media storage is pluggable behind
`src/server/storage/` (S3/MinIO or ImageKit, chosen by `STORAGE_PROVIDER`).

## Sessions and workload

Share the work across the other sessions open on this repo. When a task is larger
than a quick change, split it into independent slices and hand slices to the other
sessions (for example, one session takes the backend while another takes the UI),
so the sessions run in parallel instead of one session doing everything in
sequence. Check which sessions are available and give each a clear, bounded brief.

The session that receives the request from the user is the **lead**. The lead owns
the task end to end: it plans the split, briefs and coordinates the other sessions,
integrates their work, and verifies the result. Every question for the user goes
through the lead — the other sessions raise questions and blockers to the lead, and
the lead is the only session that asks the user. A supporting session never prompts
the user directly; it reports back to the lead, which decides what to surface.
