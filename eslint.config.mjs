// import { defineConfig, globalIgnores } from 'eslint/config'
// import nextVitals from 'eslint-config-next/core-web-vitals'
// import nextTs from 'eslint-config-next/typescript'

import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __cwd = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __cwd,
})
const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('plugin:@next/next/recommended'),
  // ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    // Remplace globalIgnores pour le format Flat Config
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      'payload-types.ts',
    ],
  },
]

export default eslintConfig
