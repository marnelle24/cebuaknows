'use client'

import React from 'react'

interface SkeletonLoaderProps {
  variant?: 'rectangle' | 'circle' | 'text'
  className?: string
  width?: string | number
  height?: string | number
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangle',
  className = '',
  width,
  height
}) => {
  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-700'
  
  const variantClasses = {
    rectangle: 'rounded',
    circle: 'rounded-full',
    text: 'rounded h-4'
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export default SkeletonLoader
