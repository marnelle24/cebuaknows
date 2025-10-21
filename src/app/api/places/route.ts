import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/places - Get all places with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const category = searchParams.get('category') || ''
    const minRating = parseFloat(searchParams.get('minRating') || '0')
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (location) {
      where.location = {
        name: location
      }
    }

    if (category) {
      where.category = {
        query: category
      }
    }

    if (minRating > 0) {
      where.rating = {
        gte: minRating
      }
    }

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: {
          location: true,
          category: true,
          images: {
            orderBy: { order: 'asc' }
          },
          amenities: {
            include: {
              amenity: true
            }
          },
          reviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  username: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.place.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: places,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching places:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch places' },
      { status: 500 }
    )
  }
}

// POST /api/places - Create a new place
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['administrator', 'publisher'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      address,
      phone,
      website,
      hours,
      priceRange,
      highlights,
      locationId,
      categoryId,
      amenities = [],
      images = [],
      businessHours = [],
      contactInfo = [],
      seo
    } = body

    // Validate required fields
    if (!name || !slug || !description || !locationId || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, description, location, and category are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPlace = await prisma.place.findUnique({
      where: { slug }
    })

    if (existingPlace) {
      return NextResponse.json(
        { success: false, error: 'A place with this slug already exists' },
        { status: 400 }
      )
    }

    // Create place with related data
    const place = await prisma.place.create({
      data: {
        name,
        slug,
        description,
        address,
        phone,
        website,
        hours,
        priceRange,
        highlights,
        locationId: parseInt(locationId),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || '',
            caption: img.caption || '',
            order: index,
            isPrimary: index === 0
          }))
        },
        businessHours: {
          create: businessHours.map((bh: any) => ({
            dayOfWeek: bh.dayOfWeek,
            openTime: bh.openTime,
            closeTime: bh.closeTime,
            isClosed: bh.isClosed || false
          }))
        },
        contactInfo: {
          create: contactInfo.map((ci: any) => ({
            type: ci.type,
            value: ci.value,
            label: ci.label,
            isPrimary: ci.isPrimary || false
          }))
        },
        seo: seo ? {
          create: {
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
            canonical: seo.canonical
          }
        } : undefined
      },
      include: {
        location: true,
        category: true,
        images: true,
        amenities: {
          include: {
            amenity: true
          }
        },
        businessHours: true,
        contactInfo: true,
        seo: true
      }
    })

    // Add amenities if provided
    if (amenities.length > 0) {
      await prisma.placeAmenity.createMany({
        data: amenities.map((amenityId: number) => ({
          placeId: place.id,
          amenityId
        }))
      })
    }

    return NextResponse.json({
      success: true,
      data: place,
      message: 'Place created successfully'
    })
  } catch (error) {
    console.error('Error creating place:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create place' },
      { status: 500 }
    )
  }
}
