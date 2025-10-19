import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/categories - Get all categories with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { label: { contains: search, mode: 'insensitive' as const } },
        { query: { contains: search, mode: 'insensitive' as const } },
        { keyphrase: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.category.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create a new category
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
    const { label, query, keyphrase, description, icon, color, prompt, displayOrder } = body

    // Validate required fields
    if (!label || !query || !keyphrase) {
      return NextResponse.json(
        { success: false, error: 'Label, query, and keyphrase are required' },
        { status: 400 }
      )
    }

    // Check if query already exists
    const existingCategory = await prisma.category.findUnique({
      where: { query }
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this query already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        label,
        query,
        keyphrase,
        description,
        icon,
        color,
        prompt,
        displayOrder: displayOrder || 0,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
