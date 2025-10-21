import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/favorites/[placeId] - Check if place is favorited by user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
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
    const favorite = await prisma.favorite.findUnique({
      where: {
        placeId_userId: {
          placeId: resolvedParams.placeId,
          userId: session.user.id
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { isFavorited: !!favorite }
    })
  } catch (error) {
    console.error('Error checking favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check favorite' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites/[placeId] - Remove place from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
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

    // Check if favorite exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        placeId_userId: {
          placeId: resolvedParams.placeId,
          userId: session.user.id
        }
      }
    })

    if (!existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Place is not in favorites' },
        { status: 404 }
      )
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        placeId_userId: {
          placeId: resolvedParams.placeId,
          userId: session.user.id
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Place removed from favorites'
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
