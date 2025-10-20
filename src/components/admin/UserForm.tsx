'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PasswordResetForm from '@/components/PasswordResetForm'
import { UserFormData, Role } from '@/types/admin'

interface UserFormProps {
  user?: UserFormData
  roles: Role[]
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  onPasswordReset?: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => Promise<void>
  isPasswordResetLoading?: boolean
  passwordResetError?: string | null
  passwordResetSuccess?: string | null
}

export default function UserForm({ 
  user, 
  roles, 
  onSubmit, 
  onCancel, 
  isLoading,
  onPasswordReset,
  isPasswordResetLoading,
  passwordResetError,
  passwordResetSuccess
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: user?.email || '',
    username: user?.username || '',
    password: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    roleId: user?.roleId || 1,
    isActive: user?.isActive ?? true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await onSubmit(formData)
  }

  const handleInputChange = (field: keyof UserFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePasswordResetSubmit = async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    if (onPasswordReset) {
      await onPasswordReset(data)
    }
  }

  const handleCancelPasswordReset = () => {
    setShowPasswordReset(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {user ? 'Edit User' : 'Create New User'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md focus:outline-none duration-300 transition-all focus:ring-1 focus:ring-slate-400 ${
                errors.email ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md focus:outline-none duration-300 transition-all focus:ring-1 focus:ring-slate-400 ${
                errors.username ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="username"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md focus:outline-none duration-300 transition-all focus:ring-1 focus:ring-slate-400 ${
                errors.firstName ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md focus:outline-none duration-300 transition-all focus:ring-1 focus:ring-slate-400 ${
                errors.lastName ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password {!user && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md focus:outline-none duration-300 transition-all focus:ring-1 focus:ring-slate-400 ${
                errors.password ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
            {user && (
              <p className="mt-1 text-xs text-slate-500">
                Leave blank to keep the current password
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="roleId"
              value={formData.roleId}
              onChange={(e) => handleInputChange('roleId', parseInt(e.target.value))}
              className={`capitalize w-full px-3 py-2 border text-slate-800 rounded-md focus:outline-none duration-300 transition-all focus:ring-1 focus:ring-slate-400 ${
                errors.roleId ? 'border-red-300' : 'border-slate-300'
              }`}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} - {role.description}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="mt-1 text-xs text-red-600">{errors.roleId}</p>
            )}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-slate-900">
            User is active
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div>
            {user && onPasswordReset && (
              <button
                type="button"
                onClick={() => setShowPasswordReset(!showPasswordReset)}
                className="px-4 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                disabled={isLoading}
              >
                {showPasswordReset ? 'Hide Password Reset' : 'Reset Password'}
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </div>
      </form>

      {/* Password Reset Section */}
      <AnimatePresence>
        {showPasswordReset && user && onPasswordReset && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200"
          >
            <div className="px-6 py-4 bg-gray-50">
              <h4 className="text-md font-medium text-gray-900 mb-4">Reset Password</h4>
              
              {/* Password Reset Messages */}
              <AnimatePresence>
                {passwordResetSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 bg-green-50 border border-green-200 rounded-md p-3"
                  >
                    <div className="text-green-800 text-sm">{passwordResetSuccess}</div>
                  </motion.div>
                )}
                
                {passwordResetError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 bg-red-50 border border-red-200 rounded-md p-3"
                  >
                    <div className="text-red-800 text-sm">{passwordResetError}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <PasswordResetForm
                onSubmit={handlePasswordResetSubmit}
                onCancel={handleCancelPasswordReset}
                isLoading={isPasswordResetLoading}
                isAdminReset={true}
                userEmail={user.email}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
