import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/reviews/[id] - Get a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const review = await prisma.review.findUnique({
      where: { id: resolvedParams.id },
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
      }
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: review
    })
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// PUT /api/reviews/[id] - Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const body = await request.json()
    const { rating, comment } = body

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    // Check if user owns this review or is admin
    if (existingReview.userId !== session.user.id && session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to update this review' },
        { status: 403 }
      )
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const review = await prisma.review.update({
      where: { id: resolvedParams.id },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment })
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

    // Update place rating if rating was changed
    if (rating) {
      const allReviews = await prisma.review.findMany({
        where: { placeId: existingReview.placeId },
        select: { rating: true }
      })

      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      await prisma.place.update({
        where: { id: existingReview.placeId },
        data: { rating: Math.round(averageRating * 10) / 10 }
      })
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    // Check if user owns this review or is admin
    if (existingReview.userId !== session.user.id && session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to delete this review' },
        { status: 403 }
      )
    }

    const placeId = existingReview.placeId

    // Delete review
    await prisma.review.delete({
      where: { id: resolvedParams.id }
    })

    // Update place rating
    const remainingReviews = await prisma.review.findMany({
      where: { placeId },
      select: { rating: true }
    })

    const averageRating = remainingReviews.length > 0 
      ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
      : null

    await prisma.place.update({
      where: { id: placeId },
      data: { rating: averageRating ? Math.round(averageRating * 10) / 10 : null }
    })

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
