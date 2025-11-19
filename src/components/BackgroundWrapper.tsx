'use client'

import { usePathname } from 'next/navigation'

interface BackgroundWrapperProps {
  children: React.ReactNode
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
    const pathname = usePathname()
    const backgroundColor = pathname.startsWith('/admin') || pathname.startsWith('/publisher') || pathname.startsWith('/user') ? 'bg-gray-50' : 'bg-teal-50'
  
  return (
    
    <div
      className={`min-h-screen ${backgroundColor}`}
      suppressHydrationWarning
    >
      {children}
    </div>
  )
}

