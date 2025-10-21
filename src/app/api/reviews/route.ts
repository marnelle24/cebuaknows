import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/reviews - Get all reviews with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const placeId = searchParams.get('placeId')
    const userId = searchParams.get('userId')
    const rating = searchParams.get('rating')
    const skip = (page - 1) * limit

    const where: any = {}

    if (placeId) {
      where.placeId = placeId
    }

    if (userId) {
      where.userId = userId
    }

    if (rating) {
      where.rating = parseInt(rating)
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          place: {
            select: {
              id: true,
              name: true,
              slug: true,
              location: {
                select: {
                  name: true,
                  displayName: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
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
    const { placeId, rating, comment } = body

    // Validate required fields
    if (!placeId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Place ID and rating are required' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
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

    // Check if user already reviewed this place
    const existingReview = await prisma.review.findFirst({
      where: {
        placeId,
        userId: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this place' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        placeId,
        userId: session.user.id,
        rating,
        comment
      },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Update place rating
    const allReviews = await prisma.review.findMany({
      where: { placeId },
      select: { rating: true }
    })

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.place.update({
      where: { id: placeId },
      data: { rating: Math.round(averageRating * 10) / 10 }
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review created successfully'
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
