import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding places database...')

  // Create Locations
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { name: 'cebu' },
      update: {},
      create: {
        name: 'cebu',
        displayName: 'Cebu',
        description: 'The Queen City of the South',
        isActive: true
      }
    }),
    prisma.location.upsert({
      where: { name: 'oslob' },
      update: {},
      create: {
        name: 'oslob',
        displayName: 'Oslob',
        description: 'Famous for whale shark watching',
        isActive: true
      }
    }),
    prisma.location.upsert({
      where: { name: 'bohol' },
      update: {},
      create: {
        name: 'bohol',
        displayName: 'Bohol',
        description: 'Home of the Chocolate Hills',
        isActive: true
      }
    })
  ])

  console.log('✅ Locations created:', locations.length)

  // Create Amenities
  const amenities = await Promise.all([
    prisma.amenity.upsert({
      where: { name: 'WiFi' },
      update: {},
      create: {
        name: 'WiFi',
        description: 'Free WiFi internet access',
        icon: 'wifi',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Pool' },
      update: {},
      create: {
        name: 'Pool',
        description: 'Swimming pool',
        icon: 'pool',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Spa' },
      update: {},
      create: {
        name: 'Spa',
        description: 'Spa and wellness services',
        icon: 'spa',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Restaurant' },
      update: {},
      create: {
        name: 'Restaurant',
        description: 'On-site restaurant',
        icon: 'restaurant',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Gym' },
      update: {},
      create: {
        name: 'Gym',
        description: 'Fitness center',
        icon: 'gym',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Parking' },
      update: {},
      create: {
        name: 'Parking',
        description: 'Free parking',
        icon: 'parking',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Room Service' },
      update: {},
      create: {
        name: 'Room Service',
        description: '24/7 room service',
        icon: 'room-service',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Air Conditioning' },
      update: {},
      create: {
        name: 'Air Conditioning',
        description: 'Air conditioned rooms',
        icon: 'ac',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Outdoor Seating' },
      update: {},
      create: {
        name: 'Outdoor Seating',
        description: 'Outdoor dining area',
        icon: 'outdoor',
        isActive: true
      }
    }),
    prisma.amenity.upsert({
      where: { name: 'Study Area' },
      update: {},
      create: {
        name: 'Study Area',
        description: 'Quiet study space',
        icon: 'study',
        isActive: true
      }
    })
  ])

  console.log('✅ Amenities created:', amenities.length)

  // Create sample places
  const cebuLocation = locations.find(l => l.name === 'cebu')!
  const hotelsCategory = await prisma.category.findFirst({ where: { query: 'hotels' } })
  const coffeeCategory = await prisma.category.findFirst({ where: { query: 'coffee-shops' } })

  if (hotelsCategory && coffeeCategory) {
    // Create Grand Cebu Hotel
    const grandHotel = await prisma.place.upsert({
      where: { slug: 'grand-cebu-hotel' },
      update: {},
      create: {
        name: 'Grand Cebu Hotel',
        slug: 'grand-cebu-hotel',
        description: 'Luxury hotel with stunning ocean views and world-class amenities. Experience unparalleled comfort and service in the heart of Cebu.',
        address: 'Main Street, Cebu',
        phone: '+63 32 123 4567',
        website: 'https://grandcebuhotel.com',
        hours: '24/7',
        priceRange: '₱8,000 - ₱25,000',
        highlights: 'Ocean view, Spa, Pool, Restaurant',
        rating: 4.8,
        isActive: true,
        isVerified: true,
        locationId: cebuLocation.id,
        categoryId: hotelsCategory.id
      }
    })

    // Add images for Grand Hotel
    await Promise.all([
      prisma.placeImage.create({
        data: {
          url: '/logo.png',
          alt: 'Grand Cebu Hotel exterior',
          caption: 'Beautiful ocean view from the hotel',
          order: 0,
          isPrimary: true,
          placeId: grandHotel.id
        }
      }),
      prisma.placeImage.create({
        data: {
          url: '/logo.png',
          alt: 'Grand Cebu Hotel lobby',
          caption: 'Elegant lobby area',
          order: 1,
          isPrimary: false,
          placeId: grandHotel.id
        }
      }),
      prisma.placeImage.create({
        data: {
          url: '/logo.png',
          alt: 'Grand Cebu Hotel pool',
          caption: 'Infinity pool with ocean view',
          order: 2,
          isPrimary: false,
          placeId: grandHotel.id
        }
      })
    ])

    // Add amenities for Grand Hotel
    const hotelAmenities = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Room Service']
    for (const amenityName of hotelAmenities) {
      const amenity = amenities.find(a => a.name === amenityName)
      if (amenity) {
        await prisma.placeAmenity.create({
          data: {
            placeId: grandHotel.id,
            amenityId: amenity.id
          }
        })
      }
    }

    // Create Café Cebu
    const cafeCebu = await prisma.place.upsert({
      where: { slug: 'cafe-cebu' },
      update: {},
      create: {
        name: 'Café Cebu',
        slug: 'cafe-cebu',
        description: 'Cozy local coffee shop with freshly roasted beans and homemade pastries. A perfect spot for coffee lovers.',
        address: 'Central Plaza, Cebu',
        phone: '+63 32 345 6789',
        website: 'https://cafecebu.com',
        hours: '6:00 AM - 9:00 PM',
        priceRange: '₱120 - ₱350',
        highlights: 'Local beans, Free WiFi, Outdoor seating',
        rating: 4.6,
        isActive: true,
        isVerified: true,
        locationId: cebuLocation.id,
        categoryId: coffeeCategory.id
      }
    })

    // Add images for Café Cebu
    await prisma.placeImage.create({
      data: {
        url: '/logo.png',
        alt: 'Café Cebu interior',
        caption: 'Cozy coffee shop atmosphere',
        order: 0,
        isPrimary: true,
        placeId: cafeCebu.id
      }
    })

    // Add amenities for Café Cebu
    const cafeAmenities = ['WiFi', 'Air Conditioning', 'Outdoor Seating']
    for (const amenityName of cafeAmenities) {
      const amenity = amenities.find(a => a.name === amenityName)
      if (amenity) {
        await prisma.placeAmenity.create({
          data: {
            placeId: cafeCebu.id,
            amenityId: amenity.id
          }
        })
      }
    }

    // Create business hours for Café Cebu
    const days = [
      { day: 0, name: 'Sunday', open: '7:00', close: '8:00' },
      { day: 1, name: 'Monday', open: '6:00', close: '9:00' },
      { day: 2, name: 'Tuesday', open: '6:00', close: '9:00' },
      { day: 3, name: 'Wednesday', open: '6:00', close: '9:00' },
      { day: 4, name: 'Thursday', open: '6:00', close: '9:00' },
      { day: 5, name: 'Friday', open: '6:00', close: '9:00' },
      { day: 6, name: 'Saturday', open: '6:00', close: '9:00' }
    ]

    for (const day of days) {
      await prisma.businessHours.create({
        data: {
          dayOfWeek: day.day,
          openTime: day.open,
          closeTime: day.close,
          isClosed: false,
          placeId: cafeCebu.id
        }
      })
    }

    // Create SEO data for places
    await prisma.sEO.create({
      data: {
        title: 'Grand Cebu Hotel - Luxury Ocean View Hotel in Cebu',
        description: 'Experience luxury at Grand Cebu Hotel with stunning ocean views, world-class amenities, and exceptional service in the heart of Cebu.',
        keywords: 'luxury hotel cebu, ocean view hotel, grand cebu hotel, cebu accommodation',
        canonical: 'https://cebuaknows.com/cebu/hotels/grand-cebu-hotel',
        placeId: grandHotel.id
      }
    })

    await prisma.sEO.create({
      data: {
        title: 'Café Cebu - Best Coffee Shop in Cebu',
        description: 'Discover the best local coffee at Café Cebu. Freshly roasted beans, homemade pastries, and cozy atmosphere in Central Plaza.',
        keywords: 'coffee shop cebu, local coffee, cafe cebu, best coffee cebu',
        canonical: 'https://cebuaknows.com/cebu/coffee-shops/cafe-cebu',
        placeId: cafeCebu.id
      }
    })

    console.log('✅ Sample places created: Grand Cebu Hotel, Café Cebu')
  }

  console.log('🎉 Places database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
