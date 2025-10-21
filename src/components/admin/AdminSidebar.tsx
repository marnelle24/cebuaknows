'use client'

import { useRouter, usePathname } from 'next/navigation'
import { BarChart3, Tag, Users, Settings, LogOut, MapPin } from 'lucide-react'

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      current: pathname === '/admin'
    },
    {
      name: 'Places',
      href: '/admin/places',
      icon: MapPin,
      current: pathname === '/admin/places'
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Tag,
      current: pathname === '/admin/categories'
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      current: pathname === '/admin/users'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: pathname === '/admin/settings'
    }
  ]

  const handleLogout = () => {
    // Add logout logic here
    // console.log('Logout clicked')
  }

  return (
    <div className={`hidden lg:flex lg:flex-shrink-0 ${className}`}>
      <div className="flex w-64 flex-col flex-shrink-0 border-r border-gray-200">
        <div className="flex w-64 flex-col flex-shrink-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`cursor-pointer w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    item.current
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>
          
          {/* Logout Button */}
          <div className="mt-auto px-2 pb-2">
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 duration-300 transition-all hover:text-red-700"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
