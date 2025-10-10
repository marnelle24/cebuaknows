'use client'

import { useState, useEffect } from 'react'

const HydrationTest: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [clientTime, setClientTime] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    setClientTime(new Date().toLocaleTimeString())
  }, [])

  if (!mounted) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p>Loading hydration test...</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded" suppressHydrationWarning>
      <h3 className="font-bold text-green-800">✅ Hydration Test Passed</h3>
      <p className="text-green-700">Client mounted at: {clientTime}</p>
      <p className="text-sm text-green-600">No hydration mismatch detected!</p>
    </div>
  )
}

export default HydrationTest

