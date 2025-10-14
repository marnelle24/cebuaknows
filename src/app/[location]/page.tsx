'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { getIcon } from '@/lib/iconMapping'

interface Category {
  id: number
  query: string
  label: string
  keyphrase: string
  description: string | null
  icon: string | null
  color: string | null
  isActive: boolean
  displayOrder: number
}

const LocationPage: React.FC = () => {
  const params = useParams()
  const location = params.location as string
  const [services, setServices] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const formatLocationName = (name: string): string => {
    if (!name) return ''
    
    if (name.includes('-city')) {
      return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.success) {
          setServices(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          {/* 
            Note: The `Image` component from 'next/image' needs to be imported.
            Please add `import Image from 'next/image';` at the top of the file
            if it's not already present.
          */}
          <Image
            alt="CebuaKnows"
            src="/logo2.png"
            width={250}
            height={100}
            className="z-20 transition-all duration-300 lg:w-1/2 w-full"
            priority
          />
        </motion.div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-[#F7AE1D]" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              {formatLocationName(location)}
            </h1>
          </div>
          <p className="lg:text-xl text-md text-gray-600 max-w-2xl mx-auto">
            What are you looking for in {formatLocationName(location)}?
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7AE1D]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {services.map((service, index) => {
              const IconComponent = service.icon ? getIcon(service.icon) : null
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={`/place/${location}/${service.query}`}
                    className="block group"
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group-hover:border-[#F7AE1D]/30 h-full">
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-4 bg-gradient-to-br ${service.color || 'from-gray-500 to-gray-600'} rounded-2xl text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          {IconComponent && <IconComponent className="w-6 h-6" />}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#F7AE1D] transition-colors duration-300">
                          {service.label}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {service.description || 'Explore this category'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Back to Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F7AE1D] to-[#FFB84D] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <MapPin className="w-5 h-5" />
            Back to Map
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default LocationPage
