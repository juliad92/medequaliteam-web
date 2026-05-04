// import { postgresAdapter } from "@payloadcms/db-postgres";
// import { lexicalEditor } from "@payloadcms/richtext-lexical";
// import path from "path";
// import { buildConfig } from "payload";
// import { fileURLToPath } from "url";
// import sharp from "sharp";

// import { Users } from "./collections/Users";
// import { Media } from "./collections/Media";

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

// export default buildConfig({
//   admin: {
//     user: Users.slug,
//     importMap: {
//       baseDir: path.resolve(dirname),
//     },
//   },
//   collections: [Users, Media],
//   editor: lexicalEditor(),
//   secret: process.env.PAYLOAD_SECRET || "",
//   typescript: {
//     outputFile: path.resolve(dirname, "payload-types.ts"),
//   },
//   db: postgresAdapter({
//     pool: {
//       connectionString: process.env.DATABASE_URL || "",
//     },
//   }),
//   sharp,
//   plugins: [],
// });

import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Projects } from '@/collections/Projects'
import { Posts } from '@/collections/Posts'
import { TeamMembers, Testimonials } from '@/collections/People'
import { Media, Pages } from '@/collections/MediaAndPages'
import { Navigation, SiteInfo, Homepage } from '@/globals/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default buildConfig({
  // ── Secret ─────────────────────────────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET || '',

  // ── Database ────────────────────────────────────────────────────────────────
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // ── Editor ──────────────────────────────────────────────────────────────────
  editor: lexicalEditor(),

  // ── Internationalisation ────────────────────────────────────────────────────
  // Content localization: each localized field stores one value per locale.
  // EN is the default — if a FR value is missing, EN is used as fallback.
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  // ── Collections ─────────────────────────────────────────────────────────────
  collections: [
    Media, // Images, PDFs, uploads
    // Projects,  // Active & past field projects
    Posts, // News, reports, newsletters
    TeamMembers,
    Projects,
    Testimonials,
    Pages, // Flexible block-based pages (About, Volunteer, Legal…)
  ],

  // ── Globals ──────────────────────────────────────────────────────────────────
  globals: [
    Navigation, // Header menu + Donate CTA
    SiteInfo, // Contact, socials, footer info, default SEO
    Homepage, // Hero, impact stats, featured project
  ],

  // ── Admin panel ──────────────────────────────────────────────────────────────
  admin: {
    // meta: {
    //   titleSuffix: "— Med'EqualiTeam CMS",
    //   // favicon: '/favicon.ico', // add your own
    // },
    // Uncomment to restrict admin to specific users:
    // user: 'users',
    importMap: {
      baseDir: path.resolve(__dirname),
    },
  },

  // ── Image optimisation ───────────────────────────────────────────────────────
  sharp,

  // ── TypeScript output ────────────────────────────────────────────────────────
  // Run `npx payload generate:types` to regenerate after config changes.
  typescript: {
    outputFile: 'payload-types.ts',
  },
})
