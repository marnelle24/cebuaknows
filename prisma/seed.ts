import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Seed Roles
  console.log('Creating roles...')
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Default user role with basic access',
    },
  })

  const publisherRole = await prisma.role.upsert({
    where: { name: 'publisher' },
    update: {},
    create: {
      name: 'publisher',
      description: 'Can publish and manage content',
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'administrator' },
    update: {},
    create: {
      name: 'administrator',
      description: 'Full system access and administration',
    },
  })

  console.log('✅ Roles created:', { userRole, publisherRole, adminRole })

  // Seed Categories
  console.log('Creating categories...')
  const categories = [
    {
      query: 'hotels',
      label: 'Hotels',
      keyphrase: 'top-hotels',
      description: 'Best accommodations and resorts',
      icon: 'Hotel',
      color: 'from-blue-500 to-blue-600',
      prompt: 'List the top 10 and most recommended hotels in the province of <selectedProvince> that is specifically located in <selectedLocation>',
      displayOrder: 1,
    },
    {
      query: 'coffee-shops',
      label: 'Coffee Shops',
      keyphrase: 'top-coffee-shops',
      description: 'Local cafes and coffee spots',
      icon: 'Coffee',
      color: 'from-amber-500 to-amber-600',
      prompt: 'List the top 5 and most recommended coffee shops in the province of <selectedProvince> that is specifically located in <selectedLocation>',
      displayOrder: 2,
    },
    {
      query: 'tourist-spots',
      label: 'Tourist Spots',
      keyphrase: 'top-tourist-destinations',
      description: 'Must-visit attractions and landmarks',
      icon: 'Camera',
      color: 'from-green-500 to-green-600',
      prompt: 'List the top and most recommended tourist spots in the province of <selectedProvince> that is specifically located in <selectedLocation>',
      displayOrder: 3,
    },
    {
      query: 'churches',
      label: 'Churches',
      keyphrase: 'churches',
      description: 'Historical and religious landmarks',
      icon: 'Church',
      color: 'from-indigo-500 to-indigo-600',
      prompt: 'List the top and most recommended churches in the province of <selectedProvince> that is specifically located in <selectedLocation>',
      displayOrder: 7,
    },
    {
      query: 'car-rentals',
      label: 'Car Rentals',
      keyphrase: 'car-rentals',
      description: 'Vehicle rental services',
      icon: 'Car',
      color: 'from-gray-500 to-gray-600',
      prompt: 'List the top and most recommended car rentals in the province of <selectedProvince> that is specifically located in <selectedLocation>',
      displayOrder: 8,
    },
    {
      query: 'tourist-inn',
      label: 'Tourist Inn',
      keyphrase: 'top-tourist-inn',
      description: 'Budget-friendly accommodations',
      icon: 'Building',
      color: 'from-orange-500 to-orange-600',
      prompt: 'List the top and most recommended tourist inn in the province of <selectedProvince> that is specifically located in <selectedLocation>',
      displayOrder: 9,
    },
    {
      query: 'politician',
      label: 'Politicians',
      keyphrase: 'current-politicians',
      description: 'Local government officials',
      icon: 'Users',
      color: 'from-teal-500 to-teal-600',
      prompt: 'List the top and most recommended politicians in the province of <selectedProvince> that is specifically located in <selectedLocation>',
      displayOrder: 10,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { query: category.query },
      update: {},
      create: category,
    })
  }

  console.log('✅ Categories created:', categories.length)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

