'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering anything on server
  if (typeof window === 'undefined') {
    return <>{fallback}</>
  }

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <div suppressHydrationWarning>{children}</div>
}

export default ClientOnly
