import { test as setup } from '@playwright/test'

import { loginToPayloadAdmin } from './helpers/admin'

setup('warm up Payload admin', async ({ page }) => {
  await loginToPayloadAdmin(page)
})
