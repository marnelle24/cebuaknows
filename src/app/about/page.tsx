'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Heart, Globe, Star, Award } from 'lucide-react'

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Interactive Map",
      description: "Explore Cebu Province with our detailed interactive map featuring all municipalities and cities."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Local Insights",
      description: "Get authentic recommendations from locals and discover hidden gems throughout Cebu."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Curated Content",
      description: "Carefully selected attractions, restaurants, and experiences for the best Cebu adventure."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Comprehensive Guide",
      description: "From tourist spots to local delicacies, find everything you need to know about Cebu."
    }
  ]

  const stats = [
    { number: "44", label: "Municipalities", icon: <MapPin className="w-6 h-6" /> },
    { number: "7", label: "Cities", icon: <Star className="w-6 h-6" /> },
    { number: "1000+", label: "Attractions", icon: <Award className="w-6 h-6" /> },
    { number: "500+", label: "Restaurants", icon: <Heart className="w-6 h-6" /> }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-[#F7AE1D] to-[#FFB84D] bg-clip-text text-transparent">
              CebuaKnows
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your ultimate guide to exploring the beautiful province of Cebu, Philippines. 
            Discover amazing places, local attractions, and authentic experiences through our 
            interactive platform built with modern React and Next.js technology.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/20 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              To make exploring Cebu accessible, enjoyable, and memorable for everyone - 
              from first-time visitors to seasoned travelers.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            What Makes Us Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#F7AE1D] to-[#FFB84D] rounded-xl text-white shadow-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-[#F7AE1D]/10 to-[#FFB84D]/10 rounded-3xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            Cebu by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#F7AE1D] to-[#FFB84D] rounded-xl text-white shadow-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/20 mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              CebuaKnows React is built using cutting-edge web technologies to provide 
              a fast, responsive, and engaging user experience. This version recreates 
              the original Vue.js application with enhanced features and improved performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand'].map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="bg-gradient-to-r from-[#F7AE1D] to-[#FFB84D] text-white px-4 py-2 rounded-full font-medium shadow-lg"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to Explore Cebu?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your journey today and discover what makes Cebu one of the Philippines&apos; 
            most beloved destinations.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F7AE1D] to-[#FFB84D] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MapPin className="w-5 h-5" />
              Start Exploring
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage
