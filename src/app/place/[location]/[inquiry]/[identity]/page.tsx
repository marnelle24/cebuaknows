'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock,
  Phone,
  Globe,
  ExternalLink,
  Navigation,
  Heart,
  Share2
} from 'lucide-react'

interface PlaceDetails {
  name: string
  slug: string
  description: string
  address?: string
  category?: string
  highlights?: string
  rating?: number
  phone?: string
  website?: string
  hours?: string
  priceRange?: string
  amenities?: string[]
  images?: string[]
  reviews?: {
    author: string
    rating: number
    comment: string
    date: string
  }[]
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

const generatePlaceDetails = (slug: string, inquiryType: string, locationName: string): PlaceDetails => {
  const baseDetails: { [key: string]: PlaceDetails } = {
    'grand-cebu-hotel': {
      name: `Grand ${formatLocationName(locationName)} Hotel`,
      slug: 'grand-cebu-hotel',
      description: 'Luxury hotel with stunning ocean views and world-class amenities. Experience unparalleled comfort and service in the heart of Cebu.',
      address: `Main Street, ${formatLocationName(locationName)}`,
      category: 'Luxury Hotel',
      highlights: 'Ocean view, Spa, Pool, Restaurant',
      rating: 4.8,
      phone: '+63 32 123 4567',
      website: 'https://grandcebuhotel.com',
      hours: '24/7',
      priceRange: '₱8,000 - ₱25,000',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Room Service'],
      images: ['/logo.png', '/logo.png', '/logo.png'],
      reviews: [
        {
          author: 'Maria Santos',
          rating: 5,
          comment: 'Absolutely stunning views and excellent service. The staff went above and beyond to make our stay memorable.',
          date: '2 days ago'
        },
        {
          author: 'John Smith',
          rating: 4,
          comment: 'Great location and comfortable rooms. The pool area is fantastic.',
          date: '1 week ago'
        }
      ]
    },
    'cebu-beach-resort': {
      name: `${formatLocationName(locationName)} Beach Resort`,
      slug: 'cebu-beach-resort',
      description: 'Beachfront resort perfect for families and couples. Enjoy pristine beaches and tropical paradise.',
      address: `Beach Road, ${formatLocationName(locationName)}`,
      category: 'Beach Resort',
      highlights: 'Private beach, Water sports, Kids club',
      rating: 4.5,
      phone: '+63 32 234 5678',
      website: 'https://cebubeachresort.com',
      hours: '6:00 AM - 10:00 PM',
      priceRange: '₱3,500 - ₱12,000',
      amenities: ['Beach Access', 'Water Sports', 'Kids Club', 'Restaurant', 'Bar', 'WiFi', 'Parking'],
      images: ['/logo.png', '/logo.png', '/logo.png'],
      reviews: [
        {
          author: 'Anna Garcia',
          rating: 5,
          comment: 'Perfect for families! The kids had an amazing time at the beach and kids club.',
          date: '3 days ago'
        }
      ]
    },
    'cafe-cebu': {
      name: `Café ${formatLocationName(locationName)}`,
      slug: 'cafe-cebu',
      description: 'Cozy local coffee shop with freshly roasted beans and homemade pastries. A perfect spot for coffee lovers.',
      address: `Central Plaza, ${formatLocationName(locationName)}`,
      category: 'Coffee Shop',
      highlights: 'Local beans, Free WiFi, Outdoor seating',
      rating: 4.6,
      phone: '+63 32 345 6789',
      website: 'https://cafecebu.com',
      hours: '6:00 AM - 9:00 PM',
      priceRange: '₱120 - ₱350',
      amenities: ['WiFi', 'Outdoor Seating', 'Pastries', 'Local Beans', 'Air Conditioning'],
      images: ['/logo.png', '/logo.png', '/logo.png'],
      reviews: [
        {
          author: 'Carlos Mendez',
          rating: 5,
          comment: 'Best coffee in town! The baristas are knowledgeable and the atmosphere is perfect for work.',
          date: '1 day ago'
        }
      ]
    },
    'brew-beans': {
      name: 'Brew & Beans',
      slug: 'brew-beans',
      description: 'Modern coffee house with specialty drinks and light meals. Trendy spot for coffee enthusiasts.',
      address: `Downtown, ${formatLocationName(locationName)}`,
      category: 'Specialty Coffee',
      highlights: 'Specialty drinks, Vegan options, Study-friendly',
      rating: 4.4,
      phone: '+63 32 456 7890',
      website: 'https://brewandbeans.com',
      hours: '7:00 AM - 10:00 PM',
      priceRange: '₱150 - ₱400',
      amenities: ['WiFi', 'Vegan Options', 'Study Area', 'Specialty Drinks', 'Light Meals'],
      images: ['/logo.png', '/logo.png', '/logo.png'],
      reviews: [
        {
          author: 'Lisa Wong',
          rating: 4,
          comment: 'Great atmosphere for studying. The vegan options are delicious!',
          date: '4 days ago'
        }
      ]
    },
    'sage-spanish-latte-cafe': {
      name: 'Sage Spanish Latte Cafe',
      slug: 'sage-spanish-latte-cafe',
      description: 'Coffee shop with a cozy atmosphere and great coffee. Known for their signature Spanish Latte.',
      address: `Downtown, ${formatLocationName(locationName)}`,
      category: 'Specialty Coffee',
      highlights: 'Specialty drinks, Local Latte, cozy atmosphere',
      rating: 4.4,
      phone: '+63 32 567 8901',
      website: 'https://sagespanishlatte.com',
      hours: '6:30 AM - 8:00 PM',
      priceRange: '₱140 - ₱380',
      amenities: ['WiFi', 'Cozy Atmosphere', 'Spanish Latte', 'Pastries', 'Outdoor Seating'],
      images: ['/logo.png', '/logo.png', '/logo.png'],
      reviews: [
        {
          author: 'Miguel Rodriguez',
          rating: 5,
          comment: 'The Spanish Latte here is absolutely amazing! Perfect cozy spot for coffee dates.',
          date: '2 days ago'
        }
      ]
    },
    'heritage-park': {
      name: `${formatLocationName(locationName)} Heritage Park`,
      slug: 'heritage-park',
      description: 'Historical park showcasing local culture and traditions. A must-visit for history enthusiasts.',
      address: `Heritage District, ${formatLocationName(locationName)}`,
      category: 'Historical Site',
      highlights: 'Cultural exhibits, Guided tours, Photo spots',
      rating: 4.7,
      phone: '+63 32 678 9012',
      website: 'https://heritageparkcebu.com',
      hours: '8:00 AM - 5:00 PM',
      priceRange: '₱50 - ₱200',
      amenities: ['Guided Tours', 'Cultural Exhibits', 'Photo Spots', 'Gift Shop', 'Parking'],
      images: ['/logo.png', '/logo.png', '/logo.png'],
      reviews: [
        {
          author: 'Elena Cruz',
          rating: 5,
          comment: 'Rich history and beautiful architecture. The guided tour was very informative.',
          date: '1 week ago'
        }
      ]
    },
    'cebu-viewpoint': {
      name: `${formatLocationName(locationName)} Viewpoint`,
      slug: 'cebu-viewpoint',
      description: 'Scenic viewpoint offering panoramic views of the surrounding area. Perfect for sunset viewing.',
      address: `Hilltop Road, ${formatLocationName(locationName)}`,
      category: 'Scenic Viewpoint',
      highlights: 'Panoramic views, Sunset viewing, Hiking trail',
      rating: 4.9,
      phone: '+63 32 789 0123',
      website: 'https://cebuviewpoint.com',
      hours: '5:00 AM - 7:00 PM',
      priceRange: '₱30 - ₱100',
      amenities: ['Panoramic Views', 'Hiking Trail', 'Sunset Viewing', 'Parking', 'Restrooms'],
      images: ['/logo.png', '/logo.png', '/logo.png'],
      reviews: [
        {
          author: 'David Kim',
          rating: 5,
          comment: 'Breathtaking views! The sunset here is absolutely spectacular. Worth the hike up.',
          date: '5 days ago'
        }
      ]
    }
  }

  return baseDetails[slug] || {
    name: `Popular ${formatInquiryName(inquiryType)} in ${formatLocationName(locationName)}`,
    slug: slug,
    description: `Discover the best ${formatInquiryName(inquiryType).toLowerCase()} that ${formatLocationName(locationName)} has to offer.`,
    address: `${formatLocationName(locationName)}, Cebu`,
    category: formatInquiryName(inquiryType),
    highlights: 'Highly recommended, Local favorite',
    rating: 4.5,
    phone: '+63 32 000 0000',
    hours: '8:00 AM - 8:00 PM',
    priceRange: '₱100 - ₱500',
    amenities: ['WiFi', 'Parking'],
    images: ['/logo.png'],
    reviews: []
  }
}

const PlaceDetailsPage: React.FC = () => {
  const params = useParams()
  const location = params.location as string
  const inquiry = params.inquiry as string
  const identity = params.identity as string
  
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const details = generatePlaceDetails(identity, inquiry, location)
        setPlaceDetails(details)
      } catch (error) {
        console.error('Error fetching place details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaceDetails()
  }, [identity, inquiry, location])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7AE1D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading place details...</p>
        </div>
      </div>
    )
  }

  if (!placeDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Place not found</h1>
          <Link href={`/place/${location}/${inquiry}`} className="text-[#F7AE1D] hover:text-[#FFB84D]">
            ← Back to results
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center lg:my-12 my-6"
        >
          <Link href="/" className="z-20 hover:scale-105 transition-all duration-600 lg:w-1/2 w-full">
            <Image
              alt="CebuaKnows"
              src="/logo2.png"
              width={200}
              height={100}
              className="w-full h-full object-contain"
              priority
            />
          </Link>
        </motion.div>

      <div className="container mx-auto lg:px-4 px-2 lg:py-8 py-4">
        <Link href={`/place/${location}/${inquiry}`} className="flex items-center gap-2 mb-4 hover:-translate-y-0.5 drop-shadow transition-all duration-300 text-[#F7AE1D] hover:text-[#FFB84D]">
          <ArrowLeft className="w-5 h-5" />
          Back to {formatInquiryName(inquiry)}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative h-96 bg-gray-200">
                <Image
                  src={placeDetails.images?.[selectedImage] || '/logo.png'}
                  alt={placeDetails.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {placeDetails.images && placeDetails.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {placeDetails.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-[#F7AE1D]' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${placeDetails.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Place Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-800 leading-tight">{placeDetails.name}</h1>
                    <div className="flex items-center gap-1">
                      <button className="cursor-pointer p-2 text-gray-600 hover:text-[#F7AE1D] transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="cursor-pointer p-2 text-gray-600 hover:text-[#F7AE1D] transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#F7AE1D] mb-2">
                    <span className="text-lg font-medium">{placeDetails.category}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {placeDetails.description}
              </p>

              {placeDetails.highlights && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Highlights</h3>
                  <p className="text-gray-600">{placeDetails.highlights}</p>
                </div>
              )}

              {placeDetails.amenities && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {placeDetails.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-[#F7AE1D]/10 text-[#F7AE1D] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Reviews */}
            {placeDetails.reviews && placeDetails.reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-start gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>
                  {placeDetails.rating && (
                    <div className="flex items-center gap-1 border border-yellow-400/60 rounded-full bg-yellow-200 px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{placeDetails.rating}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {placeDetails.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{review.author}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{review.comment}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              
              {placeDetails.address && (
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#F7AE1D] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">{placeDetails.address}</p>
                    <button className="text-[#F7AE1D] hover:text-[#FFB84D] text-sm mt-1 flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </button>
                  </div>
                </div>
              )}

              {placeDetails.phone && (
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-[#F7AE1D]" />
                  <a href={`tel:${placeDetails.phone}`} className="text-gray-600 hover:text-[#F7AE1D]">
                    {placeDetails.phone}
                  </a>
                </div>
              )}

              {placeDetails.website && (
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-[#F7AE1D]" />
                  <a 
                    href={placeDetails.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#F7AE1D] flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {placeDetails.hours && (
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#F7AE1D]" />
                  <div>
                    <p className="text-gray-600">{placeDetails.hours}</p>
                  </div>
                </div>
              )}

              {placeDetails.priceRange && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-lg font-semibold text-gray-800">{placeDetails.priceRange}</p>
                  <p className="text-sm text-gray-500">Price Range</p>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="space-y-3">
                <button className="w-full bg-[#F7AE1D] hover:bg-[#FFB84D] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </button>
                
                {placeDetails.website && (
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5" />
                    Visit Website
                  </button>
                )}
                
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceDetailsPage
