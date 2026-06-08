import { cleanupVolunteerE2EApplications, seedVolunteerE2EFixtures } from '../helpers/seed'

async function main() {
  const command = process.argv[2]

  if (command === 'cleanup') {
    await cleanupVolunteerE2EApplications()
    return
  }

  await seedVolunteerE2EFixtures()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
