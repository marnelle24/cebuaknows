import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/amenities/[id] - Get a specific amenity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const amenity = await prisma.amenity.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        places: {
          where: { isActive: true },
          include: {
            location: true,
            category: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          },
          take: 10
        },
        _count: {
          select: {
            places: true
          }
        }
      }
    })

    if (!amenity) {
      return NextResponse.json(
        { success: false, error: 'Amenity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: amenity
    })
  } catch (error) {
    console.error('Error fetching amenity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch amenity' },
      { status: 500 }
    )
  }
}

// PUT /api/amenities/[id] - Update an amenity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const body = await request.json()
    const { name, description, icon, isActive } = body

    // Check if amenity exists
    const existingAmenity = await prisma.amenity.findUnique({
      where: { id: parseInt(resolvedParams.id) }
    })

    if (!existingAmenity) {
      return NextResponse.json(
        { success: false, error: 'Amenity not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and already exists
    if (name && name !== existingAmenity.name) {
      const nameExists = await prisma.amenity.findUnique({
        where: { name }
      })

      if (nameExists) {
        return NextResponse.json(
          { success: false, error: 'An amenity with this name already exists' },
          { status: 400 }
        )
      }
    }

    const amenity = await prisma.amenity.update({
      where: { id: parseInt(resolvedParams.id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      data: amenity,
      message: 'Amenity updated successfully'
    })
  } catch (error) {
    console.error('Error updating amenity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update amenity' },
      { status: 500 }
    )
  }
}

// DELETE /api/amenities/[id] - Delete an amenity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params

    // Check if amenity exists
    const existingAmenity = await prisma.amenity.findUnique({
      where: { id: parseInt(resolvedParams.id) }
    })

    if (!existingAmenity) {
      return NextResponse.json(
        { success: false, error: 'Amenity not found' },
        { status: 404 }
      )
    }

    // Check if amenity is used by places
    const placeCount = await prisma.placeAmenity.count({
      where: { amenityId: parseInt(resolvedParams.id) }
    })

    if (placeCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete amenity that is used by places' },
        { status: 400 }
      )
    }

    await prisma.amenity.delete({
      where: { id: parseInt(resolvedParams.id) }
    })

    return NextResponse.json({
      success: true,
      message: 'Amenity deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting amenity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete amenity' },
      { status: 500 }
    )
  }
}
