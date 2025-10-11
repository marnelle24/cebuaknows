'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Info } from 'lucide-react'
import Link from 'next/link'

const SideBarNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  const menuItems = [
    { href: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '/about', label: 'About', icon: <Info className="w-5 h-5" /> }
  ]

  return (
    <>
      {/* Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        className="fixed right-0 lg:top-8 top-8 -translate-y-1/2 flex items-center justify-center p-3 bg-amber-300/70 hover:bg-amber-300/80 cursor-pointer backdrop-blur-xl transition-all duration-300 rounded-l-lg border-l border-t border-b border-white/20 z-50 shadow-lg"
        onClick={toggleSidebar}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Menu className="w-6 h-6 text-black/50" />
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-white"
              >
                Menu
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                onClick={closeSidebar}
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6">
              <ul className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
                      onClick={closeSidebar}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-[#F7AE1D] group-hover:text-[#FFB84D] transition-colors duration-200"
                      >
                        {item.icon}
                      </motion.div>
                      <span className="font-medium group-hover:text-[#F7AE1D] transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-white/70 text-sm"
              >
                <p>Everything you need to know about Cebu</p>
                <p className="mt-2 text-[#F7AE1D]">CebuaKnows React</p>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default SideBarNavigation
