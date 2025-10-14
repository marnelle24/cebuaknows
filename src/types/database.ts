// ==================== User Types ====================

export type UserWithRole = {
  id: number
  email: string
  username: string
  password: string
  firstName: string | null
  lastName: string | null
  roleId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  role: {
    id: number
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export type CreateUserInput = {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  roleId?: number
}

export type UpdateUserInput = Partial<{
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  roleId: number
  isActive: boolean
}>

// ==================== Role Types ====================

export type RoleType = 'user' | 'publisher' | 'administrator'

export type RoleWithUsers = {
  id: number
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  users: Array<{
    id: number
    email: string
    username: string
    password: string
    firstName: string | null
    lastName: string | null
    roleId: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }>
}

// ==================== Category Types ====================

export type CategoryInput = {
  query: string
  label: string
  keyphrase: string
  description?: string
  icon?: string
  color?: string
  prompt?: string
  displayOrder?: number
  isActive?: boolean
}

export type UpdateCategoryInput = Partial<{
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

// ==================== Service Category (from location page) ====================

export type ServiceCategory = {
  query: string
  label: string
  keyphrase: string
  description: string
  icon: string
  color: string
  prompt?: string
}

// ==================== Database Stats ====================

export type DatabaseStats = {
  users: number
  categories: number
  roles: number
}

