import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          place: {
            include: {
              location: true,
              category: true,
              images: {
                where: { isPrimary: true },
                take: 1
              },
              _count: {
                select: {
                  reviews: true,
                  favorites: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.favorite.count({ where: { userId: session.user.id } })
    ])

    return NextResponse.json({
      success: true,
      data: favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add a place to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { placeId } = body

    // Validate required fields
    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'Place ID is required' },
        { status: 400 }
      )
    }

    // Check if place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId }
    })

    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        placeId_userId: {
          placeId,
          userId: session.user.id
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Place is already in favorites' },
        { status: 400 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        placeId,
        userId: session.user.id
      },
      include: {
        place: {
          include: {
            location: true,
            category: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: favorite,
      message: 'Place added to favorites'
    })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}
