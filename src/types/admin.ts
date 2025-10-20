export interface Category {
  id: number
  label: string
  query: string
  keyphrase: string
  description?: string
  icon?: string
  color?: string
  prompt?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryFormData {
  id?: number
  label: string
  query: string
  keyphrase: string
  description?: string
  icon?: string
  color?: string
  prompt?: string
  displayOrder: number
  isActive: boolean
}

export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  roleId: number
  role: {
    id: number
    name: string
    description?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  id?: string
  email: string
  username: string
  password?: string
  firstName?: string
  lastName?: string
  roleId: number
  isActive: boolean
}

export interface Role {
  id: number
  name: string
  description?: string
}
