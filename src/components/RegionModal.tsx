'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Coffee, Hotel, Camera, Utensils, Church, Car } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GreatFind {
  id: string
  type: 'accommodation' | 'food' | 'activities' | 'shopping' | 'nature' | 'culture'
  title: string
  description: string
  query: string
  label: string
  keyphrase: string
  icon: React.ReactNode
}

interface RegionModalProps {
  isVisible: boolean
  regionName: string
  onClose: () => void
  onExplore: (regionName: string) => void
}

const RegionModal: React.FC<RegionModalProps> = ({
  isVisible,
  regionName,
  onClose,
  onExplore
}) => {
  const router = useRouter()
  // const [selectedCategory, setSelectedCategory] = useState<GreatFind | null>(null)

  const formatRegionName = (name: string): string => {
    if (!name) return ''

    // Handle special cases
    if (name.includes('-city')) {
      return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Capitalize first letter of each word
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
  }

  const greatFinds: GreatFind[] = [
    {
      id: '1',
      type: 'accommodation',
      title: `Top Hotels in ${formatRegionName(regionName)}`,
      description: 'Discover the best hotels and accommodations with great reviews',
      query: 'hotels',
      label: 'hotels',
      keyphrase: 'top hotels',
      icon: <Hotel className="w-6 h-6" />
    },
    {
      id: '2',
      type: 'food',
      title: `Top Coffee Shops in ${formatRegionName(regionName)}`,
      description: 'Best local cafes and coffee spots to relax and unwind',
      query: 'coffee-shops',
      label: 'coffee shops',
      keyphrase: 'top coffee shops',
      icon: <Coffee className="w-6 h-6" />
    },
    {
      id: '3',
      type: 'food',
      title: `Local Delicacies in ${formatRegionName(regionName)}`,
      description: 'Authentic local cuisine and traditional food specialties',
      query: 'delicacies',
      label: 'delicacies',
      keyphrase: 'top delicacies',
      icon: <Utensils className="w-6 h-6" />
    },
    {
      id: '4',
      type: 'activities',
      title: `Top Tourist Spots in ${formatRegionName(regionName)}`,
      description: 'Popular destinations and must-visit landmarks',
      query: 'tourist-spots',
      label: 'tourist spots',
      keyphrase: 'top tourist destinations',
      icon: <Camera className="w-6 h-6" />
    },
    {
      id: '5',
      type: 'culture',
      title: `Churches in ${formatRegionName(regionName)}`,
      description: 'Historical churches and religious landmarks',
      query: 'churches',
      label: 'churches',
      keyphrase: 'churches',
      icon: <Church className="w-6 h-6" />
    },
    {
      id: '6',
      type: 'activities',
      title: `Car Rentals in ${formatRegionName(regionName)}`,
      description: 'Reliable car rental services for your convenience',
      query: 'car-rentals',
      label: 'car rentals',
      keyphrase: 'car rentals',
      icon: <Car className="w-6 h-6" />
    }
  ]

  const handleCategoryClick = useCallback((category: GreatFind) => {
    // Navigate to the place inquiry route
    router.push(`/place/${regionName}/${category.query}`)
    onClose()
  }, [regionName, router, onClose])

  const handleExplore = useCallback(() => {
    onExplore(regionName)
    onClose()
  }, [regionName, onExplore, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#F7AE1D]/10 to-[#FFB84D]/10">
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                Great Finds in {formatRegionName(regionName)}
              </h2>
              <button
                className="bg-gray-200/60 hover:bg-gray-300/80 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 transition-all duration-200 hover:scale-105"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {greatFinds.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 m-2 rounded-xl cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#F7AE1D]/10 hover:to-[#FFB84D]/20 border border-gray-200/50 hover:border-[#F7AE1D]/30 transition-all duration-300 hover:shadow-lg"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#F7AE1D] to-[#FFB84D] flex items-center justify-center text-white shadow-lg">
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1 text-gray-800 leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-tight">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-[#F7AE1D] to-[#FFB84D] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleExplore}
              >
                Explore {formatRegionName(regionName)}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RegionModal
