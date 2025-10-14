import { NextResponse } from 'next/server'
import { getAllUsers, createUser } from '@/lib/db-helpers'
import type { CreateUserInput } from '@/types/database'

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await getAllUsers()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userData: CreateUserInput = {
      email: body.email,
      username: body.username,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      roleId: body.roleId,
    }

    // Validate required fields
    if (!userData.email || !userData.username || !userData.password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await createUser(userData)
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

