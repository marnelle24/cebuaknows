import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/places/[id] - Get a specific place
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const place = await prisma.place.findUnique({
      where: { id: resolvedParams.id },
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
        businessHours: {
          orderBy: { dayOfWeek: 'asc' }
        },
        contactInfo: true,
        seo: true,
        reviews: {
          include: {
            user: {
              select: {
                username: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    })

    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: place
    })
  } catch (error) {
    console.error('Error fetching place:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch place' },
      { status: 500 }
    )
  }
}

// PUT /api/places/[id] - Update a place
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['administrator', 'publisher'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
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
      isActive,
      isVerified,
      amenities = [],
      images = [],
      businessHours = [],
      contactInfo = [],
      seo
    } = body

    // Check if place exists
    const existingPlace = await prisma.place.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingPlace) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and already exists
    if (slug && slug !== existingPlace.slug) {
      const slugExists = await prisma.place.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A place with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update place
    const place = await prisma.place.update({
      where: { id: resolvedParams.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(hours !== undefined && { hours }),
        ...(priceRange !== undefined && { priceRange }),
        ...(highlights !== undefined && { highlights }),
        ...(locationId && { locationId: parseInt(locationId) }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(isActive !== undefined && { isActive }),
        ...(isVerified !== undefined && { isVerified })
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

    // Update images if provided
    if (images.length > 0) {
      // Delete existing images
      await prisma.placeImage.deleteMany({
        where: { placeId: resolvedParams.id }
      })

      // Create new images
      await prisma.placeImage.createMany({
        data: images.map((img: any, index: number) => ({
          placeId: resolvedParams.id,
          url: img.url,
          alt: img.alt || '',
          caption: img.caption || '',
          order: index,
          isPrimary: index === 0
        }))
      })
    }

    // Update amenities if provided
    if (amenities.length >= 0) {
      // Delete existing amenities
      await prisma.placeAmenity.deleteMany({
        where: { placeId: resolvedParams.id }
      })

      // Create new amenities
      if (amenities.length > 0) {
        await prisma.placeAmenity.createMany({
          data: amenities.map((amenityId: number) => ({
            placeId: resolvedParams.id,
            amenityId
          }))
        })
      }
    }

    // Update business hours if provided
    if (businessHours.length > 0) {
      // Delete existing business hours
      await prisma.businessHours.deleteMany({
        where: { placeId: resolvedParams.id }
      })

      // Create new business hours
      await prisma.businessHours.createMany({
        data: businessHours.map((bh: any) => ({
          placeId: resolvedParams.id,
          dayOfWeek: bh.dayOfWeek,
          openTime: bh.openTime,
          closeTime: bh.closeTime,
          isClosed: bh.isClosed || false
        }))
      })
    }

    // Update contact info if provided
    if (contactInfo.length >= 0) {
      // Delete existing contact info
      await prisma.contactInfo.deleteMany({
        where: { placeId: resolvedParams.id }
      })

      // Create new contact info
      if (contactInfo.length > 0) {
        await prisma.contactInfo.createMany({
          data: contactInfo.map((ci: any) => ({
            placeId: resolvedParams.id,
            type: ci.type,
            value: ci.value,
            label: ci.label,
            isPrimary: ci.isPrimary || false
          }))
        })
      }
    }

    // Update SEO if provided
    if (seo) {
      await prisma.sEO.upsert({
        where: { placeId: resolvedParams.id },
        update: {
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          canonical: seo.canonical
        },
        create: {
          placeId: resolvedParams.id,
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          canonical: seo.canonical
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: place,
      message: 'Place updated successfully'
    })
  } catch (error) {
    console.error('Error updating place:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update place' },
      { status: 500 }
    )
  }
}

// DELETE /api/places/[id] - Delete a place
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

    // Check if place exists
    const existingPlace = await prisma.place.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingPlace) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      )
    }

    // Delete place (cascade will handle related records)
    await prisma.place.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Place deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting place:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete place' },
      { status: 500 }
    )
  }
}
