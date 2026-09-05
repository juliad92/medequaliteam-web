# Med'EqualiTeam Web

Bilingual (EN/FR) website for [Med'EqualiTeam](https://medequali.team), built with Next.js 15 and Payload CMS 3. Includes volunteer recruitment, donations, complaints, newsletter sign-up, and a CMS admin panel.

## Prerequisites

- Node.js 22+
- pnpm 9+
- MongoDB (local or Atlas)

## Local development

1. **Clone and install**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   Create `.env.local` in the project root:

   ```bash
   # Required
   DATABASE_URI=mongodb://127.0.0.1:27017/medequaliteam
   PAYLOAD_SECRET=your-random-secret-at-least-32-chars

   # Optional — file uploads (local dev uses public/media and storage/volunteer-cvs without this)
   BLOB_READ_WRITE_TOKEN=

   # Optional — complaint form email delivery (Resend)
   RESEND_API_KEY=
   COMPLAINTS_FROM_EMAIL=

   # Optional — Instagram feed on homepage
   INSTAGRAM_ACCESS_TOKEN=
   INSTAGRAM_USER_ID=
   ```

3. **Generate Payload types** (after config changes)

   ```bash
   pnpm run generate:types
   ```

4. **Start the dev server**

   ```bash
   pnpm dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000) (redirects to `/en`)
   - CMS admin: [http://localhost:3000/admin](http://localhost:3000/admin)

   Create your first admin user at `/admin` on first launch.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URI` | Yes | MongoDB connection string |
| `PAYLOAD_SECRET` | Yes | Secret for Payload auth and encryption |
| `BLOB_READ_WRITE_TOKEN` | On Vercel | Vercel Blob storage token for media and CV uploads. Required when `VERCEL` is set. |
| `RESEND_API_KEY` | For complaints | API key for sending complaint emails via Resend |
| `COMPLAINTS_FROM_EMAIL` | No | Verified Resend sender address. Defaults to `safeguarding@medequali.team` |
| `INSTAGRAM_ACCESS_TOKEN` | No | Instagram Graph API token for homepage feed |
| `INSTAGRAM_USER_ID` | No | Instagram user ID (uses `/me/media` if omitted) |

### E2E testing variables

| Variable | Description |
|----------|-------------|
| `E2E_DATABASE_URI` | Isolated MongoDB database for Playwright (defaults to `{DATABASE_URI database}-e2e`) |
| `E2E_PORT` | Dev server port for E2E (default: `3100`) |
| `E2E_ADMIN_EMAIL` | Admin login for E2E tests (default: `e2e-admin@medequali.team`) |
| `E2E_ADMIN_PASSWORD` | Admin password for E2E tests |
| `E2E_REUSE_SERVER` | Set to `true` to reuse an existing dev server during E2E |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Generate types and build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript compiler |
| `pnpm format` | Format source with Prettier |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:e2e:install` | Install Playwright Chromium browser |
| `pnpm generate:types` | Regenerate Payload TypeScript types |

## E2E tests

Requires MongoDB running and `DATABASE_URI` set in `.env.local`:

```bash
pnpm run test:e2e:install
pnpm run test:e2e
```

Tests seed an isolated `-e2e` database, run volunteer application flows, and clean up afterward.

## Complaint email delivery

Complaint submissions are sent to `safeguarding@medequali.team` through Resend. Set `RESEND_API_KEY` in your environment. Optionally set `COMPLAINTS_FROM_EMAIL` to a verified Resend sender; otherwise the safeguarding address is used as the sender.

## Deployment

Deployed on Vercel. On Vercel you must:

1. Set `DATABASE_URI` and `PAYLOAD_SECRET`
2. Add Vercel Blob storage (sets `BLOB_READ_WRITE_TOKEN` automatically)
3. Set `RESEND_API_KEY` if using the complaints form

## Project structure

```
src/
  app/
    (frontend)/[locale]/   # Public pages (EN/FR)
    (payload)/             # CMS admin and Payload API routes
    api/                   # Custom API routes (volunteer, newsletter, complaints)
  collections/             # Payload collection configs
  components/              # React components
  globals/                 # Payload global configs
  lib/                     # Shared utilities
  i18n/                    # Frontend translation strings
e2e/                       # Playwright tests
```

## CI

GitHub Actions runs lint, typecheck, and E2E tests on push/PR to `main`. See `.github/workflows/ci.yml`.
