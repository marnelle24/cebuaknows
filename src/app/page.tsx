'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import MapDisplay from '@/components/MapDisplay'
import ClientOnly from '@/components/ClientOnly'
import SkeletonLoader from '@/components/SkeletonLoader'
import { Star, MapPin, Coffee, Camera } from 'lucide-react'

const HomePage: React.FC = () => {
  const popularCategories = [
    {
      id: 1,
      title: "Tourist Spots",
      description: "Discover amazing destinations",
      icon: <Camera className="w-6 h-6" />,
      count: "50+"
    },
    {
      id: 2,
      title: "Hotels & Resorts",
      description: "Find perfect accommodations",
      icon: <Star className="w-6 h-6" />,
      count: "100+"
    },
    {
      id: 3,
      title: "Coffee Shops",
      description: "Best local cafes",
      icon: <Coffee className="w-6 h-6" />,
      count: "75+"
    },
    {
      id: 4,
      title: "Local Attractions",
      description: "Hidden gems to explore",
      icon: <MapPin className="w-6 h-6" />,
      count: "200+"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Map */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-4 lg:py-16 py-0">
          
          <div className="flex flex-col lg:flex-row items-start justify-start gap-0 lg:gap-12">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left lg:text-left flex-1 flex flex-col items-start justify-start"
            >
              <Image
                alt="CebuaKnows"
                src="/logo2.png"
                width={400}
                height={60}
                className="z-20 transition-all duration-300 w-full lg:mt-16 mt-0"
                priority
              />
              <div className="flex flex-col lg:mt-28 mt-12">
                <h1 className="font-sans lg:text-6xl text-4xl font-bold text-gray-800 mb-2 lg:text-left text-center">
                  Explore{' '}
                  <span className="bg-gradient-to-r from-[#F7AE1D] to-[#FFB84D] bg-clip-text text-transparent">
                    Cebu
                  </span>
                </h1>
                <p className="text-md lg:text-xl lg:text-left text-center tracking-wide text-gray-600 max-w-2xl lg:max-w-none mt-3">
                  Click on any region to discover amazing places, local attractions, and hidden gems throughout Cebu Province
                </p>
              </div>
            </motion.div>

            {/* Map Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center flex-1 w-full lg:w-auto lg:pt-28 pt-2"
            >
              <ClientOnly fallback={
                <div className="relative w-full aspect-[213/466] max-w-xl mx-auto">
                  <SkeletonLoader variant="rectangle" className="w-full h-full rounded-2xl" />
                </div>
              }>
                <MapDisplay />
              </ClientOnly>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="lg:mt-20 mt-0 lg:py-16 py-0">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What&apos;s Popular
            </h2>
            <p className="text-lg text-gray-600">
              Discover the most sought-after experiences in Cebu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#F7AE1D] to-[#FFB84D] rounded-xl text-white shadow-lg">
                    {category.icon}
                  </div>
                  <span className="text-sm font-semibold text-[#F7AE1D] bg-[#F7AE1D]/10 px-3 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready to Explore Cebu?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start your journey by clicking on any region in the map above. Discover local attractions, 
              find the best restaurants, book accommodations, and much more!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                onClick={() => {
                  document.querySelector('.map-container')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  })
                }}
                className="bg-gradient-to-r from-[#F7AE1D] to-[#FFB84D] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore the Map
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage