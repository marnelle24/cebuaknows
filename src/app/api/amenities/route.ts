import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/amenities - Get all amenities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const isActive = searchParams.get('isActive')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const amenities = await prisma.amenity.findMany({
      where,
      include: {
        _count: {
          select: {
            places: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: amenities
    })
  } catch (error) {
    console.error('Error fetching amenities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch amenities' },
      { status: 500 }
    )
  }
}

// POST /api/amenities - Create a new amenity
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, icon, isActive = true } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if amenity name already exists
    const existingAmenity = await prisma.amenity.findUnique({
      where: { name }
    })

    if (existingAmenity) {
      return NextResponse.json(
        { success: false, error: 'An amenity with this name already exists' },
        { status: 400 }
      )
    }

    const amenity = await prisma.amenity.create({
      data: {
        name,
        description,
        icon,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: amenity,
      message: 'Amenity created successfully'
    })
  } catch (error) {
    console.error('Error creating amenity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create amenity' },
      { status: 500 }
    )
  }
}
