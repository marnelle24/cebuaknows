'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import UserManagement from '@/components/admin/UserManagement'

export default function AdminUsers() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (session.user.role !== 'administrator') {
      router.push('/user')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!session || session.user.role !== 'administrator') {
    return null
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl leading-relaxed font-bold text-gray-900 sm:text-3xl sm:truncate">
                User Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage user accounts, roles, and permissions
              </p>
            </div>
          </div>

          {/* User Management Component */}
          <div className="mt-8">
            <UserManagement />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}