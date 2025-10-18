import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'administrator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get database statistics
    const [totalUsers, totalCategories, totalRoles] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.role.count()
    ])

    // Mock recent activity count (replace with actual implementation)
    const recentActivity = Math.floor(Math.random() * 50) + 10

    return NextResponse.json({
      totalUsers,
      totalCategories,
      totalRoles,
      recentActivity
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
