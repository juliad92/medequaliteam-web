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

import { Projects } from './src/collections/Projects.ts'
import { Posts } from './src/collections/Posts.ts'
import { VolunteerNeeds } from './src/collections/VolunteerNeeds.ts'
import { VolunteerApplications } from './src/collections/VolunteerApplications.ts'
import { TeamMembers, Testimonials } from './src/collections/People.ts'
import { Media, Pages } from './src/collections/MediaAndPages.ts'
import { Navigation, SiteInfo, Homepage } from './src/globals/index.ts'
import { Users } from './src/collections/Users.ts'

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
    VolunteerNeeds,
    VolunteerApplications,
    Testimonials,
    Users, // Admin users
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
    outputFile: path.resolve(__dirname, 'src/payload/payload-types.ts'),
  },
})
