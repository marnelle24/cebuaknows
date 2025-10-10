'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface HeaderDisplayProps {
  msg: string
}

const HeaderDisplay: React.FC<HeaderDisplayProps> = () => {
  const pathname = usePathname()
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const checkScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      const quarterHeight = window.innerHeight / 16
      setIsHeaderFixed(window.pageYOffset >= quarterHeight)
    }
  }, [])

  const resetScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setIsHeaderFixed(false)
  }

  useEffect(() => {
    // Watch for route changes
    if (pathname === '/') {
      resetScroll()
    }
  }, [pathname])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      window.addEventListener('scroll', checkScroll)
      return () => {
        window.removeEventListener('scroll', checkScroll)
      }
    }
  }, [isClient, checkScroll])

  return (
    <motion.div
      className={`w-full transition-all duration-500 ease-in-out flex items-center justify-center z-40 pt-4 ${
        isHeaderFixed 
          ? 'fixed top-0 left-0 backdrop-blur-sm shadow-sm bg-white/10' 
          : 'relative bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      suppressHydrationWarning
    >
      <Link href="/" className="w-full flex justify-center items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
          suppressHydrationWarning
        >
          <Image
            alt="CebuaKnows"
            src="/logo2.png"
            width={400}
            height={60}
            className="px-4 py-2 z-20 transition-all duration-300 w-full h-[60px] object-contain hover:drop-shadow-lg"
            priority
          />
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7AE1D]/20 to-[#FFB84D]/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default HeaderDisplay
