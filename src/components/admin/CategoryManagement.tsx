'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryList from './CategoryList'
import CategoryForm from './CategoryForm'
import { Category, CategoryFormData } from '@/types/admin'

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/categories?t=${Date.now()}`)
      const data = await response.json()

      // console.log('Fetch categories response:', data) // Debug log

      if (data.success) {
        setCategories(data.data)
        if (data.pagination) {
          setPagination(data.pagination)
        }
        // console.log('Categories updated:', data.data) // Debug log
      } else {
        setError(data.error || 'Failed to fetch categories')
      }
    } catch (error) {
      setError('Failed to fetch categories')
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Handle create new category
  const handleCreateNew = () => {
    setEditingCategory(undefined)
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  // Handle edit category
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  // Handle form submission
  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // console.log('Category saved successfully:', data.data) // Debug log
        setSuccess(data.message || 'Category saved successfully')
        setShowForm(false)
        setEditingCategory(undefined)
        await fetchCategories() // Refresh the list
        // console.log('Categories refreshed after save') // Debug log
      } else {
        setError(data.error || 'Failed to save category')
      }
    } catch (error) {
      setError('Failed to save category')
      console.error('Error saving category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete category
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Category deleted successfully')
        fetchCategories() // Refresh the list
      } else {
        setError(data.error || 'Failed to delete category')
      }
    } catch (error) {
      setError('Failed to delete category')
      console.error('Error deleting category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle toggle active status
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const category = categories.find(c => c.id === id)
      if (!category) return

      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...category,
          isActive
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Category ${isActive ? 'activated' : 'deactivated'} successfully`)
        fetchCategories() // Refresh the list
      } else {
        setError(data.error || 'Failed to update category')
      }
    } catch (error) {
      setError('Failed to update category')
      console.error('Error updating category:', error)
    }
  }

  // Handle cancel form
  const handleCancel = () => {
    setShowForm(false)
    setEditingCategory(undefined)
    setError(null)
    setSuccess(null)
  }

  // Handle page change
  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/categories?page=${page}&limit=${pagination.limit}&t=${Date.now()}`)
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
        if (data.pagination) {
          setPagination(data.pagination)
        }
      } else {
        setError(data.error || 'Failed to fetch categories')
      }
    } catch (error) {
      setError('Failed to fetch categories')
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
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

      {/* Category List */}
      {!showForm && (
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onCreateNew={handleCreateNew}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Category Form */}
      <AnimatePresence>
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
