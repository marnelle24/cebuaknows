'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import PasswordResetForm from '@/components/PasswordResetForm'
import { User, Mail, Calendar, Shield } from 'lucide-react'

export default function UserProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    fetchUserProfile()
  }, [session, status, router])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      if (data.success) {
        setUser(data.data)
      } else {
        setError(data.error || 'Failed to fetch profile')
      }
    } catch (error) {
      setError('Failed to fetch profile')
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Password changed successfully')
        setShowPasswordForm(false)
      } else {
        setError(result.error || 'Failed to change password')
      }
    } catch (error) {
      setError('Failed to change password')
      console.error('Error changing password:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false)
    setError(null)
    setSuccess(null)
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

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and security settings</p>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-md p-4"
            >
              <div className="text-green-800 text-sm">{success}</div>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-md p-4"
            >
              <div className="text-red-800 text-sm">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              </div>
              <div className="p-6">
                {user ? (
                  <div className="space-y-6">
                    {/* User Avatar and Basic Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.username
                          }
                        </h3>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Role</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role.name === 'administrator' 
                              ? 'bg-red-100 text-red-800' 
                              : user.role.name === 'publisher'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Member Since</p>
                          <p className="text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${
                            user.isActive ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <p className={`text-sm ${
                            user.isActive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading profile information...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Security</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Password</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Keep your account secure by using a strong password.
                    </p>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Form */}
        <AnimatePresence>
          {showPasswordForm && (
            <div className="mt-8">
              <PasswordResetForm
                onSubmit={handlePasswordChange}
                onCancel={handleCancelPasswordChange}
                isLoading={isSubmitting}
                isAdminReset={false}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
