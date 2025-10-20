'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UserList from './UserList'
import UserForm from './UserForm'
import { User, UserFormData, Role } from '@/types/admin'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null)
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Fetch users and roles
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users?t=${Date.now()}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        if (data.pagination) {
          setPagination(data.pagination)
        }
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles')
      const data = await response.json()

      if (data.success) {
        setRoles(data.data)
      } else {
        setError(data.error || 'Failed to fetch roles')
      }
    } catch (error) {
      setError('Failed to fetch roles')
      console.error('Error fetching roles:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  // Handle create new user
  const handleCreateNew = () => {
    setEditingUser(undefined)
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  // Handle edit user
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  // Handle form submission
  const handleSubmit = async (formData: UserFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      
      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || 'User saved successfully')
        setShowForm(false)
        setEditingUser(undefined)
        await fetchUsers() // Refresh the list
      } else {
        setError(data.error || 'Failed to save user')
      }
    } catch (error) {
      setError('Failed to save user')
      console.error('Error saving user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete user
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('User deleted successfully')
        fetchUsers() // Refresh the list
      } else {
        setError(data.error || 'Failed to delete user')
      }
    } catch (error) {
      setError('Failed to delete user')
      console.error('Error deleting user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle toggle active status
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const user = users.find(u => u.id === id)
      if (!user) return

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          isActive
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
        fetchUsers() // Refresh the list
      } else {
        setError(data.error || 'Failed to update user')
      }
    } catch (error) {
      setError('Failed to update user')
      console.error('Error updating user:', error)
    }
  }

  // Handle password reset form submission
  const handlePasswordResetSubmit = async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    if (!editingUser) return

    try {
      setIsPasswordResetLoading(true)
      setPasswordResetError(null)

      const response = await fetch(`/api/admin/users/${editingUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: data.newPassword
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPasswordResetSuccess('Password reset successfully')
        // Clear success message after 3 seconds
        setTimeout(() => {
          setPasswordResetSuccess(null)
        }, 3000)
      } else {
        setPasswordResetError(result.error || 'Failed to reset password')
      }
    } catch (error) {
      setPasswordResetError('Failed to reset password')
      console.error('Error resetting password:', error)
    } finally {
      setIsPasswordResetLoading(false)
    }
  }

  // Handle page change
  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users?page=${page}&limit=${pagination.limit}&t=${Date.now()}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        if (data.pagination) {
          setPagination(data.pagination)
        }
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cancel form
  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(undefined)
    setError(null)
    setSuccess(null)
    setPasswordResetError(null)
    setPasswordResetSuccess(null)
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-md p-4"
          >
            <div className="text-green-800 text-sm">{success}</div>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-md p-4"
          >
            <div className="text-red-800 text-sm">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User List */}
      {!showForm && (
        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onCreateNew={handleCreateNew}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* User Form */}
      <AnimatePresence>
        {showForm && (
          <UserForm
            user={editingUser}
            roles={roles}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            onPasswordReset={handlePasswordResetSubmit}
            isPasswordResetLoading={isPasswordResetLoading}
            passwordResetError={passwordResetError}
            passwordResetSuccess={passwordResetSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
