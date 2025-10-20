'use client'

import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
  className?: string
}

export default function AdminLayout({ children, className = '' }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className={`flex-1 ${className}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
