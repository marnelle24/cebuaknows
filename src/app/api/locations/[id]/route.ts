import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/locations/[id] - Get a specific location
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const location = await prisma.location.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        places: {
          where: { isActive: true },
          include: {
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

    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: location
    })
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch location' },
      { status: 500 }
    )
  }
}

// PUT /api/locations/[id] - Update a location
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
    const { name, displayName, description, isActive } = body

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id: parseInt(resolvedParams.id) }
    })

    if (!existingLocation) {
      return NextResponse.json(
        { success: false, error: 'Location not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and already exists
    if (name && name !== existingLocation.name) {
      const nameExists = await prisma.location.findUnique({
        where: { name }
      })

      if (nameExists) {
        return NextResponse.json(
          { success: false, error: 'A location with this name already exists' },
          { status: 400 }
        )
      }
    }

    const location = await prisma.location.update({
      where: { id: parseInt(resolvedParams.id) },
      data: {
        ...(name && { name }),
        ...(displayName && { displayName }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      data: location,
      message: 'Location updated successfully'
    })
  } catch (error) {
    console.error('Error updating location:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update location' },
      { status: 500 }
    )
  }
}

// DELETE /api/locations/[id] - Delete a location
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

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id: parseInt(resolvedParams.id) }
    })

    if (!existingLocation) {
      return NextResponse.json(
        { success: false, error: 'Location not found' },
        { status: 404 }
      )
    }

    // Check if location has places
    const placeCount = await prisma.place.count({
      where: { locationId: parseInt(resolvedParams.id) }
    })

    if (placeCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete location with existing places' },
        { status: 400 }
      )
    }

    await prisma.location.delete({
      where: { id: parseInt(resolvedParams.id) }
    })

    return NextResponse.json({
      success: true,
      message: 'Location deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting location:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete location' },
      { status: 500 }
    )
  }
}
