'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Category {
  id?: number
  label: string
  query: string
  keyphrase: string
  description?: string
  icon?: string
  color?: string
  prompt?: string
  displayOrder: number
  isActive: boolean
}

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: Category) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    label: category?.label || '',
    query: category?.query || '',
    keyphrase: category?.keyphrase || '',
    description: category?.description || '',
    icon: category?.icon || '',
    color: category?.color || '',
    prompt: category?.prompt || '',
    displayOrder: category?.displayOrder || 0,
    isActive: category?.isActive ?? true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required'
    }

    if (!formData.query.trim()) {
      newErrors.query = 'Query is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.query)) {
      newErrors.query = 'Query must contain only lowercase letters, numbers, and hyphens'
    }

    if (!formData.keyphrase.trim()) {
      newErrors.keyphrase = 'Keyphrase is required'
    }

    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Display order must be a positive number'
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

  const handleInputChange = (field: keyof Category, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {category ? 'Edit Category' : 'Create New Category'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Label */}
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
              Label *
            </label>
            <input
              type="text"
              id="label"
              value={formData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600 ${
                errors.label ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Hotels"
            />
            {errors.label && (
              <p className="mt-1 text-sm text-red-600">{errors.label}</p>
            )}
          </div>

          {/* Query */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Query *
            </label>
            <input
              type="text"
              id="query"
              value={formData.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600 ${
                errors.query ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., hotels"
            />
            {errors.query && (
              <p className="mt-1 text-sm text-red-600">{errors.query}</p>
            )}
          </div>

          {/* Keyphrase */}
          <div>
            <label htmlFor="keyphrase" className="block text-sm font-medium text-gray-700 mb-2">
              Keyphrase *
            </label>
            <input
              type="text"
              id="keyphrase"
              value={formData.keyphrase}
              onChange={(e) => handleInputChange('keyphrase', e.target.value)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600 ${
                errors.keyphrase ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., top-hotels"
            />
            {errors.keyphrase && (
              <p className="mt-1 text-sm text-red-600">{errors.keyphrase}</p>
            )}
          </div>

          {/* Icon */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <input
              type="text"
              id="icon"
              value={formData.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              className="w-full px-3 py-2 text-slate-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600"
              placeholder="e.g., hotel"
            />
          </div>

          {/* Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              id="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-full px-3 py-2 text-slate-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600"
              placeholder="e.g., from-blue-500 to-blue-600"
            />
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              id="displayOrder"
              value={formData.displayOrder}
              onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border text-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600 ${
                errors.displayOrder ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
            />
            {errors.displayOrder && (
              <p className="mt-1 text-sm text-red-600">{errors.displayOrder}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-slate-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600"
            placeholder="Brief description of the category"
          />
        </div>

        {/* Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            AI Prompt Template
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-slate-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-slate-600"
            placeholder="e.g., List the top and most recommended politicians in the province of <selectedProvince> that is specifically located in <selectedLocation>"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm cursor-pointer uppercase tracking-wider hover:scale-110 duration-300 transition-all font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm cursor-pointer uppercase tracking-wider hover:scale-110 duration-300 transition-all font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-0 focus:ring-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
