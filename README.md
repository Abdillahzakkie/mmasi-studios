# MmasiEjikeme Studios

The studio's digital flagship: an art-directed portfolio for fine-art
photography and cinematography, built to turn admirers into clients through a
direct WhatsApp conversation.

Visual stories. Timeless frames.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **styled-components 6** with CSS custom-property tokens (`--mm-*`), no runtime
  theme object
- **TypeScript**, **Biome** (tabs, width 4) for lint and format
- **motion** and **react-icons** for interaction and iconography

The design tokens in `src/styles/global.ts` are the same values the contact
sheets in `design/mockups/system.css` are drawn with, so the mockup and the
build read one vocabulary.

## Run it

Prerequisites: Node 20+, Docker (for MongoDB and MinIO).

```
npm install
cp .env.example .env.local   # local defaults target the shared Docker services
npm run seed                 # create the DB content, admin user, and MinIO bucket
npm run dev                  # http://localhost:3000
```

The app reads MongoDB on `127.0.0.1:27018` (database `mmasi`) and stores uploads
in MinIO on `127.0.0.1:9000` (bucket `mmasi`). Both are shared Docker containers;
`.env.local` holds the connection settings.

Other scripts:

```
npm run build      # production build (standalone output)
npm run start      # serve the production build
npm run seed       # (re)seed the database — idempotent
npm run lint       # biome check
npm run ts.check   # tsc --noEmit
```

## Backend

- **Database:** MongoDB (Mongoose) — models in `src/server/models.ts`, connection in
  `src/server/db.ts`. The public site reads it in server components via
  `src/server/data.ts`; the admin reads and writes it through `src/app/api`.
- **Admin auth:** email + password (bcrypt), a JWT in an httpOnly cookie
  (`src/server/auth.ts` + `jwt.ts`). `src/middleware.ts` redirects unauthenticated
  `/admin/*` to `/signin`; admin API routes also check the session. The seeded
  account comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (default
  `hello@mmasiejikeme.studio` / `studio-admin` — change it).
- **Passkeys (WebAuthn):** teammates can add passkeys for passwordless sign-in
  from **Settings**, alongside email and password (additive — the password keeps
  working). Server logic is in `src/server/webauthn.ts` with routes under
  `src/app/api/auth/passkey`; credentials are stored in the `Passkey` model.
  Sign-in is discoverable (usernameless). In production, set `WEBAUTHN_RP_ID`
  (the registrable domain) and `WEBAUTHN_ORIGIN` (the full scheme and host); the
  `localhost` / `http://localhost:3000` defaults work for local development.
- **Access control (roles/permissions):** each teammate has their own sign-in and
  belongs to groups; a group carries permission sets that grant, per admin section
  (`portfolio`, `reels`, `films`, `casestudies`, `services`, `content`, `media`,
  `inquiries`, `settings`, `iam`), one of **off / read / full**. The model is a
  flat `resource → level` map (no AWS-style policy engine) — vocabulary and pure
  helpers in `@/constants/iam`, server enforcement in `@/server/iam`. Admin API
  routes gate on `permit(resource, need)` (`read` for GET, `full` for writes), and
  the sidebar hides sections a teammate can't open. Managed from **Access & team**
  (`/admin/access`): the friendly builder sets each section to Off / View / Manage
  in plain words — no policy to write — with an Advanced JSON view. Seeded system
  roles: **Owner** (everything), **Editor** (content and media, read inquiries),
  **Viewer** (read-only). The seeded admin is an Owner; the last active Owner can
  never be removed or locked out.
- **Media storage:** pluggable behind `src/server/storage/` — a `StorageProvider`
  interface with two implementations, `s3` (S3/MinIO) and `imagekit`
  ([ImageKit](https://imagekit.io/)), chosen by the `STORAGE_PROVIDER` env var
  (default `s3`). The rest of the app imports the same functions from
  `@/server/storage` and never knows which backend is active. Admin uploads are
  sent to `POST /api/admin/upload` and stored server-side (no browser-to-bucket
  CORS); the public URL is stored on the record and rendered by
  `Plate`/`next/image`. To use ImageKit, set `STORAGE_PROVIDER=imagekit` and
  `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT`.
  Switching providers routes new uploads and the media library to the new
  backend; records already holding the old backend's URLs keep resolving only
  while that backend stays reachable (no auto-migration).
- **API:** `src/app/api/inquiries` (public submit) and `src/app/api/admin/*` +
  `src/app/api/auth/*` (session-gated).

## Structure

```
src/
  app/
    layout.tsx            root: fonts, SSR registry, providers, theme
    (site)/               the public site, with the persistent header/footer
      page.tsx            Home
      photography/        gallery + darkroom lightbox
      films/              reels + widescreen cinema + player
      services/ about/ contact/ work/[slug]/
    (admin)/              studio admin — sign in, portfolio, reels, inquiries, settings
    not-found.tsx
  components/             primitives: Button, Plate, Modal, Section, Lightbox, VideoPlayer, InquiryBuilder, ShareDialog
  layouts/                chrome: SiteHeader, SiteFooter, MobileDrawer, AdminRail, Brandmark
  libs/                   one *Wrapper feature module per page (thin pages render these)
  hooks/                  ThemeContext (dark/light toggle, persisted)
  data/                   seed content (loaded into MongoDB by `npm run seed`)
  server/                 db, Mongoose models, auth (jwt+bcrypt), data access
    storage/              pluggable media storage: s3/MinIO + imagekit providers
  constants/studio.ts     studio facts + the wa.me deep-link builder
  styles/global.ts        the --mm-* token system
  types/
  middleware.ts           gates /admin behind the session
  app/api/                public + session-gated route handlers
design/mockups/           the contact sheets every screen was drawn against first
```

## Theme

The cinematic dark is the lead look and the default; the editorial light is the
toggle. An inline script in the root layout sets `data-theme` before first paint
to avoid a flash, and the choice persists per browser. The admin always renders
light.

## How inquiries work

Booking is a conversation first. The contact page's inquiry builder shows the
exact WhatsApp message live as you type; sending it saves the inquiry to the
database (so it appears in the admin Inquiries queue) **and** opens WhatsApp
(`wa.me/2348147099175`) with the message pre-filled. The studio gets the warm
conversation and a tracked record.

## Scope

The public site and the admin are both wired to the real backend (MongoDB +
MinIO, see **Backend**). `src/data` is now the **seed source**, not the runtime
data — `npm run seed` loads it into the database, after which the site reads and
the admin edits live records. Real media uploads land in MinIO.

Everything on the public pages is editable from the admin (a full CMS):

- **Portfolio, reels, films** — image/video records with uploads.
- **Case studies** — cover and frame images, picked from the shared media
  library or uploaded (`/admin/casestudies`).
- **Services** — tiers, pricing, and deliverables (`/admin/services`); the
  Services page reads them from the database.
- **Page copy** — every heading, intro, and block of body text on the home,
  about, photography, films, services, and contact pages, edited as structured
  fields under `/admin/content`. The shape is `SiteContentData` in `src/types`;
  `DEFAULT_CONTENT` (`src/data/content.ts`) is both the seed and the fallback,
  so an empty database renders the shipped copy.
- **Media library** — one browser (`/admin/media`) over everything uploaded to
  MinIO. Each asset supports rename (renames the stored object and rewrites every
  photo/reel/film/case-study record that referenced it), replace (new file, same
  key, so references stay valid), delete (blocked with a where-it's-used list
  until you confirm), a forced download, and copy-URL. Every upload field across
  the admin (portfolio image, reel/film video and poster, case-study cover and
  frames) has a **Choose from library** picker next to it, filtered to images or
  videos as appropriate.
- **Inquiries** and **studio settings** — the contact queue and site-wide
  contact details.

## Deploy

The app builds to a standalone server (`output: "standalone"`), so the Docker
image runs `node server.js` with no `node_modules`.

```
docker build -t mmasiejikeme-studios .
docker run -p 3000:3000 mmasiejikeme-studios
```

`buildspec.yml` builds and pushes that image to Amazon ECR (AWS CodeBuild);
`amplify.yml` is the alternative for AWS Amplify hosting. Both mirror the
sibling projects' pipelines.

## Design mockups

Every screen was drawn as a device frame before it was built. See
`design/mockups/README.md`. Re-render the contact sheets with:

```
cd design/mockups && npm install && npx playwright install chromium
node check-overflow.mjs && node check-ease.mjs && node render-sheets.mjs && node build-manifest.mjs
```
