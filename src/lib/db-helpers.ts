import { prisma } from './prisma'

// ==================== Role Helpers ====================

export async function getAllRoles() {
  return await prisma.role.findMany({
    orderBy: { id: 'asc' },
  })
}

export async function getRoleByName(name: string) {
  return await prisma.role.findUnique({
    where: { name },
  })
}

export async function getRoleById(id: number) {
  return await prisma.role.findUnique({
    where: { id },
    include: {
      users: true,
    },
  })
}

// ==================== User Helpers ====================

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      role: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  })
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      role: true,
    },
  })
}

export async function createUser(data: {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  roleId?: number
}) {
  return await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: data.roleId || 1, // Default to 'user' role
    },
    include: {
      role: true,
    },
  })
}

export async function updateUser(
  id: number,
  data: Partial<{
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
    roleId: number
    isActive: boolean
  }>
) {
  return await prisma.user.update({
    where: { id },
    data,
    include: {
      role: true,
    },
  })
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  })
}

// ==================== Category Helpers ====================

export async function getAllCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  })
}

export async function getAllCategoriesIncludingInactive() {
  return await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  })
}

export async function getCategoryById(id: number) {
  return await prisma.category.findUnique({
    where: { id },
  })
}

export async function getCategoryByQuery(query: string) {
  return await prisma.category.findUnique({
    where: { query },
  })
}

export async function createCategory(data: {
  query: string
  label: string
  keyphrase: string
  description?: string
  icon?: string
  color?: string
  prompt?: string
  displayOrder?: number
  isActive?: boolean
}) {
  return await prisma.category.create({
    data,
  })
}

export async function updateCategory(
  id: number,
  data: Partial<{
    query: string
    label: string
    keyphrase: string
    description: string
    icon: string
    color: string
    prompt: string
    displayOrder: number
    isActive: boolean
  }>
) {
  return await prisma.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: number) {
  return await prisma.category.delete({
    where: { id },
  })
}

export async function toggleCategoryActive(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  return await prisma.category.update({
    where: { id },
    data: { isActive: !category.isActive },
  })
}

// ==================== Statistics Helpers ====================

export async function getDatabaseStats() {
  const [userCount, categoryCount, roleCount] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.role.count(),
  ])

  return {
    users: userCount,
    categories: categoryCount,
    roles: roleCount,
  }
}

