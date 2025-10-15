'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  RefreshCw,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface PlaceResult {
  name: string
  description: string
  address?: string
  category?: string
  highlights?: string
  rating?: number
}

// Helper functions
const formatLocationName = (name: string): string => {
  if (!name) return ''
  
  if (name.includes('-city')) {
    return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
  
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

const formatInquiryName = (name: string): string => {
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const generateMockResults = (inquiryType: string, locationName: string): PlaceResult[] => {
    const baseResults = {
      'hotels': [
        {
          name: `Grand ${formatLocationName(locationName)} Hotel`,
          description: 'Luxury hotel with stunning ocean views and world-class amenities.',
          address: `Main Street, ${formatLocationName(locationName)}`,
          category: 'Luxury Hotel',
          highlights: 'Ocean view, Spa, Pool, Restaurant',
          rating: 4.8
        },
        {
          name: `${formatLocationName(locationName)} Beach Resort`,
          description: 'Beachfront resort perfect for families and couples.',
          address: `Beach Road, ${formatLocationName(locationName)}`,
          category: 'Beach Resort',
          highlights: 'Private beach, Water sports, Kids club',
          rating: 4.5
        }
      ],
      'coffee-shops': [
        {
          name: `Café ${formatLocationName(locationName)}`,
          description: 'Cozy local coffee shop with freshly roasted beans and homemade pastries.',
          address: `Central Plaza, ${formatLocationName(locationName)}`,
          category: 'Coffee Shop',
          highlights: 'Local beans, Free WiFi, Outdoor seating',
          rating: 4.6
        },
        {
          name: 'Brew & Beans',
          description: 'Modern coffee house with specialty drinks and light meals.',
          address: `Downtown, ${formatLocationName(locationName)}`,
          category: 'Specialty Coffee',
          highlights: 'Specialty drinks, Vegan options, Study-friendly',
          rating: 4.4
        },
        {
          name: 'Sage Spanish Latte Cafe',
          description: 'Coffee shop with a cozy atmosphere and great coffee.',
          address: `Downtown, ${formatLocationName(locationName)}`,
          category: 'Specialty Coffee',
          highlights: 'Specialty drinks, Local Latte, cozy atmosphere',
          rating: 4.4
        }
      ],
      'tourist-spots': [
        {
          name: `${formatLocationName(locationName)} Heritage Park`,
          description: 'Historical park showcasing local culture and traditions.',
          address: `Heritage District, ${formatLocationName(locationName)}`,
          category: 'Historical Site',
          highlights: 'Cultural exhibits, Guided tours, Photo spots',
          rating: 4.7
        },
        {
          name: `${formatLocationName(locationName)} Viewpoint`,
          description: 'Scenic viewpoint offering panoramic views of the surrounding area.',
          address: `Hilltop Road, ${formatLocationName(locationName)}`,
          category: 'Scenic Viewpoint',
          highlights: 'Panoramic views, Sunset viewing, Hiking trail',
          rating: 4.9
        }
      ]
    }

    return baseResults[inquiryType as keyof typeof baseResults] || [
      {
        name: `Popular ${formatInquiryName(inquiryType)} in ${formatLocationName(locationName)}`,
        description: `Discover the best ${formatInquiryName(inquiryType).toLowerCase()} that ${formatLocationName(locationName)} has to offer.`,
        address: `${formatLocationName(locationName)}, Cebu`,
        category: formatInquiryName(inquiryType),
        highlights: 'Highly recommended, Local favorite',
        rating: 4.5
      }
    ]
}

const PlaceInquiryPage: React.FC = () => {
  const params = useParams()
  const location = params.location as string
  const inquiry = params.inquiry as string
  
  const [results, setResults] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate API call with mock data
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock data based on inquiry type
        const mockResults: PlaceResult[] = generateMockResults(inquiry, location)
        setResults(mockResults)
      } catch {
        setError('Failed to fetch results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [location, inquiry])

  const handleRetry = () => {
    setResults([])
    setError(null)
    setLoading(true)
    // Trigger useEffect again
    window.location.reload()
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto md:px-4 px-2">
        {/* Header */}
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
          <Link href="/" className="z-20 hover:scale-105 transition-all duration-600 lg:w-1/2 w-full">
            <Image
              alt="CebuaKnows"
              src="/logo2.png"
              width={250}
              height={100}
              className="w-full h-full object-contain"
              priority
            />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
              {formatInquiryName(inquiry)} in {formatLocationName(location)}
            </h1>
            <p className="md:text-lg text-md text-gray-600">
              Discover the best {formatInquiryName(inquiry).toLowerCase()} in the area
            </p>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                <RefreshCw className="w-6 h-6 text-[#F7AE1D] animate-spin" />
                <span className="text-lg font-medium text-gray-700">
                  Finding the best {formatInquiryName(inquiry).toLowerCase()}...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Something went wrong
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        
        <AnimatePresence>
          {!loading && !error && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {results.map((result, index) => (
                <Link
                  href={`/place/${location}/${result.name}`}
                  key={index}
                  className="group cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                  >
                    {/* Thumbnail Image Placeholder */}
                    <div className="relative w-full h-56 bg-gray-200 rounded-t-xl mb-4 flex items-center justify-center overflow-hidden">
                      {result.rating && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-200 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-yellow-700">
                            {result.rating}
                          </span>
                        </div>
                      )}
                      <Image
                        src="/logo.png"
                        alt={`${result.name} thumbnail`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex flex-col md:items-start gap-2 px-6 py-2">
                      <div className="flex-1">
                        <div className="flex flex-col items-start justify-between mb-3">
                          <h3 className="text-xl truncate font-bold text-gray-800 mb-1">
                            {result.name}
                          </h3>
                          {result.address && (
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{result.address}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3 text-sm leading-tight max-h-20 overflow-hidden">
                          {result.description}
                        </p>
                        
                        {result.highlights && (
                          <div className="text-sm text-gray-600 mb-3">
                            <p className="font-bold">Highlights:</p> {result.highlights}
                          </div>
                        )}

                        {result.category && (
                          <div className="inline-block bg-[#F7AE1D]/10 text-[#F7AE1D] px-3 py-1 rounded-full text-sm font-medium mb-3">
                            {result.category}
                          </div>
                        )}
                      </div>                    
                      {/* <div className="flex flex-col gap-2">
                        <button className="flex items-center text-sm gap-2 bg-[#F7AE1D]/90 hover:bg-[#F7AE1D] cursor-pointer hover:scale-105 transition-all duration-300 text-white font-medium py-2 px-4 rounded-lg">
                          <ExternalLink className="w-4 h-4" />
                          View Details
                        </button>
                      </div> */}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        <AnimatePresence>
          {!loading && !error && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  We couldn&apos;t find any {formatInquiryName(inquiry).toLowerCase()} in {formatLocationName(location)} at the moment.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Link
              href={`/${location}`}
              className="flex justify-center mt-10 text-center items-center gap-2 text-[#F7AE1D] hover:text-[#FFB84D] transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to {formatLocationName(location)}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default PlaceInquiryPage
