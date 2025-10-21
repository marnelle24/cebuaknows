import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/locations - Get all locations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const isActive = searchParams.get('isActive')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const locations = await prisma.location.findMany({
      where,
      include: {
        _count: {
          select: {
            places: true
          }
        }
      },
      orderBy: { displayName: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: locations
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

// POST /api/locations - Create a new location
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
    const { name, displayName, description, isActive = true } = body

    // Validate required fields
    if (!name || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Name and display name are required' },
        { status: 400 }
      )
    }

    // Check if location name already exists
    const existingLocation = await prisma.location.findUnique({
      where: { name }
    })

    if (existingLocation) {
      return NextResponse.json(
        { success: false, error: 'A location with this name already exists' },
        { status: 400 }
      )
    }

    const location = await prisma.location.create({
      data: {
        name,
        displayName,
        description,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: location,
      message: 'Location created successfully'
    })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create location' },
      { status: 500 }
    )
  }
}
