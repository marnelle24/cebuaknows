'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import { Place, Location, Category } from '@/types/admin'

interface PlaceFormData {
  name: string
  slug: string
  description: string
  address?: string
  phone?: string
  website?: string
  hours?: string
  priceRange?: string
  highlights?: string
  locationId: number
  categoryId: number
  isActive: boolean
  isVerified: boolean
  images: { url: string; alt?: string; caption?: string; order: number; isPrimary: boolean }[]
  amenities: number[]
  businessHours: { dayOfWeek: number; openTime?: string; closeTime?: string; isClosed: boolean }[]
  contactInfo: { type: string; value: string; label?: string; isPrimary: boolean }[]
  seo: { title?: string; description?: string; keywords?: string; canonical?: string }
}
import PlaceForm from '../PlaceForm'

export default function PlaceManagement() {
  const [places, setPlaces] = useState<Place[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [showForm, setShowForm] = useState(false)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)

  // Fetch data
  const fetchPlaces = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedLocation && { location: selectedLocation }),
        ...(selectedCategory && { category: selectedCategory })
      })

      const response = await fetch(`/api/places?${params}`)
      const data = await response.json()

      if (data.success) {
        setPlaces(data.data)
        setPagination(data.pagination)
      } else {
        setError(data.error || 'Failed to fetch places')
      }
    } catch (error) {
      setError('Failed to fetch places')
      console.error('Error fetching places:', error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page, pagination.limit, searchTerm, selectedLocation, selectedCategory])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      const data = await response.json()
      if (data.success) {
        setLocations(data.data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }


  useEffect(() => {
    fetchPlaces()
    fetchLocations()
    fetchCategories()
  }, [fetchPlaces])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this place?')) {
      return
    }

    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Place deleted successfully')
        fetchPlaces()
      } else {
        setError(data.error || 'Failed to delete place')
      }
    } catch (error) {
      setError('Failed to delete place')
      console.error('Error deleting place:', error)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Place ${isActive ? 'activated' : 'deactivated'} successfully`)
        fetchPlaces()
      } else {
        setError(data.error || 'Failed to update place')
      }
    } catch (error) {
      setError('Failed to update place')
      console.error('Error updating place:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleAddPlace = () => {
    setEditingPlace(null)
    setShowForm(true)
  }

  const handleEditPlace = (place: Place) => {
    setEditingPlace(place)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPlace(null)
  }

  const handleFormSubmit = async (data: PlaceFormData) => {
    try {
      const method = editingPlace ? 'PUT' : 'POST'
      const url = editingPlace ? `/api/places/${editingPlace.id}` : '/api/places'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(editingPlace ? 'Place updated successfully' : 'Place created successfully')
        setShowForm(false)
        setEditingPlace(null)
        fetchPlaces()
      } else {
        setError(result.error || 'Failed to save place')
      }
    } catch (error) {
      setError('Failed to save place')
      console.error('Error saving place:', error)
    }
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl leading-relaxed font-bold text-gray-900 sm:text-3xl sm:truncate">
              Places Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage places, locations, and amenities
            </p>
          </div>
          <button
            onClick={handleAddPlace}
            className="inline-flex cursor-pointer hover:-translate-y-0.5 duration-300 text-xs transition-all items-center px-3 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-0 focus:ring-green-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Place
          </button>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-md p-4"
            >
              <div className="text-green-800 text-sm">{success}</div>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-md p-4"
            >
              <div className="text-red-800 text-sm">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location.id} value={location.name}>
                  {location.displayName}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.query}>
                  {category.label}
                </option>
              ))}
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Filter className="w-4 h-4 mr-2 inline" />
              More Filters
            </button>
          </div>
        </div>

        {/* Places Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : places.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No places found
                    </td>
                  </tr>
                ) : (
                  places.map((place, index) => (
                    <motion.tr
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {place.images && place.images.length > 0 ? (
                              <Image
                                className="h-10 w-10 rounded-full object-cover"
                                src={place.images[0].url}
                                alt={place.name}
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {place.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {place.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{place.location?.displayName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {place.category?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {place.rating ? place.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(place.id, !place.isActive)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            place.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {place.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditPlace(place)}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(place.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Place Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <PlaceForm
              place={editingPlace}
              locations={locations}
              categories={categories}
              amenities={[]}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              isLoading={isLoading}
              userRole="administrator"
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
