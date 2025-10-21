'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, MapPin, Clock, Star, Phone, Globe, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Place, Location, Category, Amenity } from '@/types/admin'

interface PlaceFormProps {
  place?: Place | null
  locations: Location[]
  categories: Category[]
  amenities: Amenity[]
  onSubmit: (data: PlaceFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  userRole?: 'administrator' | 'publisher'
}

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
  images: PlaceImageData[]
  amenities: number[]
  businessHours: BusinessHoursData[]
  contactInfo: ContactInfoData[]
  seo: SEOData
}

interface PlaceImageData {
  url: string
  alt?: string
  caption?: string
  order: number
  isPrimary: boolean
}

interface BusinessHoursData {
  dayOfWeek: number
  openTime?: string
  closeTime?: string
  isClosed: boolean
}

interface ContactInfoData {
  type: string
  value: string
  label?: string
  isPrimary: boolean
}

interface SEOData {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const CONTACT_TYPES = [
  'phone', 'email', 'website', 'social', 'other'
]

export default function PlaceForm({
  place,
  locations,
  categories,
  amenities,
  onSubmit,
  onCancel,
  isLoading = false,
  userRole = 'publisher'
}: PlaceFormProps) {
  const [formData, setFormData] = useState<PlaceFormData>({
    name: place?.name || '',
    slug: place?.slug || '',
    description: place?.description || '',
    address: place?.address || '',
    phone: place?.phone || '',
    website: place?.website || '',
    hours: place?.hours || '',
    priceRange: place?.priceRange || '',
    highlights: place?.highlights || '',
    locationId: place?.locationId || 0,
    categoryId: place?.categoryId || 0,
    isActive: place?.isActive ?? true,
    isVerified: place?.isVerified ?? false,
    images: place?.images?.map(img => ({
      url: img.url,
      alt: img.alt || '',
      caption: img.caption || '',
      order: img.order,
      isPrimary: img.isPrimary
    })) || [],
    amenities: place?.amenities?.map(pa => pa.amenityId) || [],
    businessHours: place?.businessHours?.map(bh => ({
      dayOfWeek: bh.dayOfWeek,
      openTime: bh.openTime || '',
      closeTime: bh.closeTime || '',
      isClosed: bh.isClosed
    })) || Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      openTime: '',
      closeTime: '',
      isClosed: false
    })),
    contactInfo: place?.contactInfo?.map(ci => ({
      type: ci.type,
      value: ci.value,
      label: ci.label || '',
      isPrimary: ci.isPrimary
    })) || [],
    seo: {
      title: place?.seo?.title || '',
      description: place?.seo?.description || '',
      keywords: place?.seo?.keywords || '',
      canonical: place?.seo?.canonical || ''
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('basic')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.locationId) {
      newErrors.locationId = 'Location is required'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await onSubmit(formData)
  }

  const handleInputChange = (field: keyof PlaceFormData, value: string | number | boolean | PlaceImageData[] | number[] | BusinessHoursData[] | ContactInfoData[] | SEOData) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    handleInputChange('slug', slug)
  }

  const addImage = () => {
    const newImage: PlaceImageData = {
      url: '',
      alt: '',
      caption: '',
      order: formData.images.length,
      isPrimary: formData.images.length === 0
    }
    handleInputChange('images', [...formData.images, newImage])
  }

  const updateImage = (index: number, field: keyof PlaceImageData, value: string | boolean) => {
    const updatedImages = formData.images.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    )
    handleInputChange('images', updatedImages)
  }

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    handleInputChange('images', updatedImages)
  }

  const setPrimaryImage = (index: number) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }))
    handleInputChange('images', updatedImages)
  }

  const addContactInfo = () => {
    const newContact: ContactInfoData = {
      type: 'phone',
      value: '',
      label: '',
      isPrimary: formData.contactInfo.length === 0
    }
    handleInputChange('contactInfo', [...formData.contactInfo, newContact])
  }

  const updateContactInfo = (index: number, field: keyof ContactInfoData, value: string | boolean) => {
    const updatedContactInfo = formData.contactInfo.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    )
    handleInputChange('contactInfo', updatedContactInfo)
  }

  const removeContactInfo = (index: number) => {
    const updatedContactInfo = formData.contactInfo.filter((_, i) => i !== index)
    handleInputChange('contactInfo', updatedContactInfo)
  }

  const updateBusinessHours = (dayIndex: number, field: keyof BusinessHoursData, value: string | boolean) => {
    const updatedBusinessHours = formData.businessHours.map((bh, i) => 
      i === dayIndex ? { ...bh, [field]: value } : bh
    )
    handleInputChange('businessHours', updatedBusinessHours)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: MapPin },
    { id: 'details', label: 'Details', icon: Star },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'seo', label: 'SEO', icon: Globe }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] h-screen overflow-hidden"
    >
      {/* Header */}
      <div className="flex from-slate-300 to-slate-300 via-slate-100 bg-gradient-to-r from-20% to-100% items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {place ? 'Edit Place' : 'Add New Place'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {place ? 'Update place information' : 'Create a new place listing'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-white cursor-pointer drop-shadow-lg hover:text-gray-400 duration-300 transition-all"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange('name', e.target.value)
                      if (!place) {
                        handleSlugChange(e.target.value)
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter place name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.slug ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="url-friendly-slug"
                  />
                  {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe the place..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => handleInputChange('locationId', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.locationId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value={0}>Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.displayName}
                      </option>
                    ))}
                  </select>
                  {errors.locationId && <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.categoryId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value={0}>Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>

              {/* Status Controls - Only for Admin */}
              {userRole === 'administrator' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Place is active
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isVerified"
                      checked={formData.isVerified}
                      onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">
                      Place is verified
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.website ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <input
                  type="text"
                  value={formData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $10-25, Budget-friendly, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highlights
                </label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => handleInputChange('highlights', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Key features, special offers, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenities.map(amenity => (
                    <label key={amenity.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity.id)}
                        onChange={(e) => {
                          const updatedAmenities = e.target.checked
                            ? [...formData.amenities, amenity.id]
                            : formData.amenities.filter(id => id !== amenity.id)
                          handleInputChange('amenities', updatedAmenities)
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Images</h4>
                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Image
                </button>
              </div>

              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {image.url ? (
                          <Image
                            src={image.url}
                            alt={image.alt || ''}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image URL
                            </label>
                            <input
                              type="url"
                              value={image.url}
                              onChange={(e) => updateImage(index, 'url', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Alt Text
                            </label>
                            <input
                              type="text"
                              value={image.alt}
                              onChange={(e) => updateImage(index, 'alt', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Describe the image"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Caption
                          </label>
                          <input
                            type="text"
                            value={image.caption}
                            onChange={(e) => updateImage(index, 'caption', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Image caption"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={image.isPrimary}
                                onChange={() => setPrimaryImage(index)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-900">Primary image</span>
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Business Hours</h4>
              <div className="space-y-4">
                {formData.businessHours.map((hours, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-700">
                        {DAYS_OF_WEEK[hours.dayOfWeek]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hours.isClosed}
                        onChange={(e) => updateBusinessHours(index, 'isClosed', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">Closed</label>
                    </div>
                    {!hours.isClosed && (
                      <>
                        <input
                          type="time"
                          value={hours.openTime}
                          onChange={(e) => updateBusinessHours(index, 'openTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={hours.closeTime}
                          onChange={(e) => updateBusinessHours(index, 'closeTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Contact Information</h4>
                <button
                  type="button"
                  onClick={addContactInfo}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Add Contact
                </button>
              </div>

              <div className="space-y-4">
                {formData.contactInfo.map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={contact.type}
                          onChange={(e) => updateContactInfo(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {CONTACT_TYPES.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          value={contact.value}
                          onChange={(e) => updateContactInfo(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Contact value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={contact.label}
                          onChange={(e) => updateContactInfo(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Display label"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contact.isPrimary}
                          onChange={(e) => updateContactInfo(index, 'isPrimary', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Primary contact</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeContactInfo(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">SEO Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo.title}
                    onChange={(e) => handleInputChange('seo', { ...formData.seo, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SEO title"
                    maxLength={60}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.seo.title?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo.description}
                    onChange={(e) => handleInputChange('seo', { ...formData.seo, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SEO description"
                    maxLength={160}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.seo.description?.length || 0}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seo.keywords}
                    onChange={(e) => handleInputChange('seo', { ...formData.seo, keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={formData.seo.canonical}
                    onChange={(e) => handleInputChange('seo', { ...formData.seo, canonical: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/canonical-url"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : place ? 'Update Place' : 'Create Place'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
