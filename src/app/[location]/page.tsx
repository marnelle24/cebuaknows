'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Hotel, 
  Coffee, 
  Camera, 
  Utensils, 
  Church, 
  Car, 
  MapPin,
  Waves,
  Building,
  Users
} from 'lucide-react'

const LocationPage: React.FC = () => {
  const params = useParams()
  const location = params.location as string

  const formatLocationName = (name: string): string => {
    if (!name) return ''
    
    if (name.includes('-city')) {
      return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
  }

  const services = [
    {
      query: 'hotels',
      label: 'Hotels',
      keyphrase: 'top-hotels',
      icon: <Hotel className="w-6 h-6" />,
      description: 'Best accommodations and resorts',
      color: 'from-blue-500 to-blue-600'
    },
    {
      query: 'coffee-shops',
      label: 'Coffee Shops',
      keyphrase: 'top-coffee-shops',
      icon: <Coffee className="w-6 h-6" />,
      description: 'Local cafes and coffee spots',
      color: 'from-amber-500 to-amber-600'
    },
    {
      query: 'tourist-spots',
      label: 'Tourist Spots',
      keyphrase: 'top-tourist-destinations',
      icon: <Camera className="w-6 h-6" />,
      description: 'Must-visit attractions and landmarks',
      color: 'from-green-500 to-green-600'
    },
    {
      query: 'milk-tea-shops',
      label: 'Milk Tea Shops',
      keyphrase: 'top-milk-tea-shops',
      icon: <Coffee className="w-6 h-6" />,
      description: 'Popular bubble tea and beverage shops',
      color: 'from-purple-500 to-purple-600'
    },
    {
      query: 'diving-spots',
      label: 'Diving Spots',
      keyphrase: 'top-diving-spots',
      icon: <Waves className="w-6 h-6" />,
      description: 'Amazing underwater experiences',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      query: 'delicacies',
      label: 'Delicacies',
      keyphrase: 'top-delicacies',
      icon: <Utensils className="w-6 h-6" />,
      description: 'Local cuisine and traditional foods',
      color: 'from-red-500 to-red-600'
    },
    {
      query: 'churches',
      label: 'Churches',
      keyphrase: 'churches',
      icon: <Church className="w-6 h-6" />,
      description: 'Historical and religious landmarks',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      query: 'car-rentals',
      label: 'Car Rentals',
      keyphrase: 'car-rentals',
      icon: <Car className="w-6 h-6" />,
      description: 'Vehicle rental services',
      color: 'from-gray-500 to-gray-600'
    },
    {
      query: 'tourist-inn',
      label: 'Tourist Inn',
      keyphrase: 'top-tourist-inn',
      icon: <Building className="w-6 h-6" />,
      description: 'Budget-friendly accommodations',
      color: 'from-orange-500 to-orange-600'
    },
    {
      query: 'politician',
      label: 'Politicians',
      keyphrase: 'current-politicians',
      icon: <Users className="w-6 h-6" />,
      description: 'Local government officials',
      color: 'from-teal-500 to-teal-600'
    }
  ]

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.query}
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
                    <div className={`p-4 bg-gradient-to-br ${service.color} rounded-2xl text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#F7AE1D] transition-colors duration-300">
                      {service.label}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

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
