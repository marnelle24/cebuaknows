export interface Category {
  id: number
  label: string
  query: string
  keyphrase: string
  description?: string
  icon?: string
  color?: string
  prompt?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryFormData {
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

export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  roleId: number
  role: {
    id: number
    name: string
    description?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  id?: string
  email: string
  username: string
  password?: string
  firstName?: string
  lastName?: string
  roleId: number
  isActive: boolean
}

export interface Role {
  id: number
  name: string
  description?: string
}

// Place-related types
export interface Place {
  id: string
  name: string
  slug: string
  description: string
  address?: string
  phone?: string
  website?: string
  hours?: string
  priceRange?: string
  highlights?: string
  rating?: number
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  locationId: number
  categoryId: number
  location?: Location
  category?: Category
  images?: PlaceImage[]
  amenities?: PlaceAmenity[]
  reviews?: Review[]
  favorites?: Favorite[]
  businessHours?: BusinessHours[]
  contactInfo?: ContactInfo[]
  seo?: SEO
  _count?: {
    reviews: number
    favorites: number
  }
}

export interface Location {
  id: number
  name: string
  displayName: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  places?: Place[]
  _count?: {
    places: number
  }
}

export interface PlaceImage {
  id: number
  url: string
  alt?: string
  caption?: string
  order: number
  isPrimary: boolean
  createdAt: string
  placeId: string
}

export interface Amenity {
  id: number
  name: string
  description?: string
  icon?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  places?: PlaceAmenity[]
  _count?: {
    places: number
  }
}

export interface PlaceAmenity {
  id: number
  placeId: string
  amenityId: number
  place?: Place
  amenity?: Amenity
}

export interface Review {
  id: string
  rating: number
  comment?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
  placeId: string
  userId: string
  place?: Place
  user?: User
}

export interface Favorite {
  id: string
  createdAt: string
  placeId: string
  userId: string
  place?: Place
  user?: User
}

export interface BusinessHours {
  id: number
  dayOfWeek: number
  openTime?: string
  closeTime?: string
  isClosed: boolean
  createdAt: string
  updatedAt: string
  placeId: string
}

export interface ContactInfo {
  id: number
  type: string
  value: string
  label?: string
  isPrimary: boolean
  createdAt: string
  placeId: string
}

export interface SEO {
  id: number
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  createdAt: string
  updatedAt: string
  placeId: string
}
