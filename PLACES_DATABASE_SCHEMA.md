# Places Database Schema

## Overview
This schema is designed to support a comprehensive place/business directory system with user reviews, favorites, and detailed business information.

## Core Entities

### 1. **Location** (Cities/Regions)
```sql
- id: Primary key
- name: URL-friendly identifier (e.g., 'cebu', 'oslob')
- displayName: Human-readable name (e.g., 'Cebu', 'Oslob')
- description: Optional description
- isActive: Enable/disable location
```

### 2. **Category** (Business Types)
```sql
- id: Primary key
- query: URL-friendly identifier (e.g., 'hotels', 'coffee-shops')
- label: Display name (e.g., 'Hotels', 'Coffee Shops')
- keyphrase: SEO keyphrase
- description: Category description
- icon: Icon identifier
- color: Theme color
- prompt: AI prompt template
- isActive: Enable/disable category
- displayOrder: UI ordering
```

### 3. **Place** (Main Business Entity)
```sql
- id: Primary key (CUID)
- name: Business name
- slug: URL-friendly identifier
- description: Business description
- address: Physical address
- phone: Contact phone
- website: Business website
- hours: Operating hours (text)
- priceRange: Price range (e.g., '₱100 - ₱500')
- highlights: Key features
- rating: Average rating (calculated)
- isActive: Enable/disable place
- isVerified: Verification status
- locationId: Foreign key to Location
- categoryId: Foreign key to Category
```

## Supporting Entities

### 4. **PlaceImage** (Multiple Images per Place)
```sql
- id: Primary key
- url: Image URL/path
- alt: Alt text for accessibility
- caption: Image caption
- order: Display order
- isPrimary: Primary image flag
- placeId: Foreign key to Place
```

### 5. **Amenity** (Available Amenities)
```sql
- id: Primary key
- name: Amenity name (e.g., 'WiFi', 'Pool')
- description: Amenity description
- icon: Icon identifier
- isActive: Enable/disable amenity
```

### 6. **PlaceAmenity** (Pivot Table - Many-to-Many)
```sql
- id: Primary key
- placeId: Foreign key to Place
- amenityId: Foreign key to Amenity
- Unique constraint on (placeId, amenityId)
```

### 7. **Review** (User Reviews)
```sql
- id: Primary key (CUID)
- rating: 1-5 star rating
- comment: Review text
- isVerified: Verification status
- placeId: Foreign key to Place
- userId: Foreign key to User
```

### 8. **Favorite** (User Favorites)
```sql
- id: Primary key (CUID)
- placeId: Foreign key to Place
- userId: Foreign key to User
- Unique constraint on (placeId, userId)
```

### 9. **BusinessHours** (Detailed Operating Hours)
```sql
- id: Primary key
- dayOfWeek: 0-6 (Sunday-Saturday)
- openTime: Opening time (e.g., '09:00')
- closeTime: Closing time (e.g., '17:00')
- isClosed: Closed on this day
- placeId: Foreign key to Place
- Unique constraint on (placeId, dayOfWeek)
```

### 10. **ContactInfo** (Additional Contact Details)
```sql
- id: Primary key
- type: Contact type ('email', 'phone', 'social', 'other')
- value: Contact value
- label: Display label
- isPrimary: Primary contact flag
- placeId: Foreign key to Place
```

### 11. **SEO** (Search Optimization)
```sql
- id: Primary key
- title: SEO title
- description: Meta description
- keywords: SEO keywords
- canonical: Canonical URL
- placeId: Foreign key to Place (1:1 relationship)
```

## Relationships

### One-to-Many Relationships:
- **Location** → **Place** (1:many)
- **Category** → **Place** (1:many)
- **Place** → **PlaceImage** (1:many)
- **Place** → **Review** (1:many)
- **Place** → **Favorite** (1:many)
- **Place** → **BusinessHours** (1:many)
- **Place** → **ContactInfo** (1:many)
- **User** → **Review** (1:many)
- **User** → **Favorite** (1:many)

### Many-to-Many Relationships:
- **Place** ↔ **Amenity** (via PlaceAmenity pivot table)

### One-to-One Relationships:
- **Place** → **SEO** (1:1)

## Sample Data Structure

Based on the sample identity data, here's how the data would be structured:

### Place Example: "Grand Cebu Hotel"
```json
{
  "id": "clx1234567890",
  "name": "Grand Cebu Hotel",
  "slug": "grand-cebu-hotel",
  "description": "Luxury hotel with stunning ocean views...",
  "address": "Main Street, Cebu",
  "phone": "+63 32 123 4567",
  "website": "https://grandcebuhotel.com",
  "hours": "24/7",
  "priceRange": "₱8,000 - ₱25,000",
  "highlights": "Ocean view, Spa, Pool, Restaurant",
  "rating": 4.8,
  "locationId": 1, // Cebu
  "categoryId": 1  // Hotels
}
```

### Amenities (Many-to-Many)
```json
// PlaceAmenity records
[
  { "placeId": "clx1234567890", "amenityId": 1 }, // WiFi
  { "placeId": "clx1234567890", "amenityId": 2 }, // Pool
  { "placeId": "clx1234567890", "amenityId": 3 }, // Spa
  { "placeId": "clx1234567890", "amenityId": 4 }, // Restaurant
  { "placeId": "clx1234567890", "amenityId": 5 }, // Gym
  { "placeId": "clx1234567890", "amenityId": 6 }, // Parking
  { "placeId": "clx1234567890", "amenityId": 7 }  // Room Service
]
```

### Reviews
```json
[
  {
    "id": "clx9876543210",
    "rating": 5,
    "comment": "Absolutely stunning views and excellent service...",
    "placeId": "clx1234567890",
    "userId": "clx1111111111",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

## Database Indexes

### Performance Indexes:
- `Place.slug` - Unique identifier for URLs
- `Place.locationId` - Filter by location
- `Place.categoryId` - Filter by category
- `Place.rating` - Sort by rating
- `Place.isActive` - Filter active places
- `Review.placeId` - Get reviews for a place
- `Review.userId` - Get user's reviews
- `Review.rating` - Filter by rating
- `Favorite.placeId` - Get favorites for a place
- `Favorite.userId` - Get user's favorites

## Migration Strategy

1. **Phase 1**: Create core tables (Location, Category, Place)
2. **Phase 2**: Add supporting tables (PlaceImage, Amenity, PlaceAmenity)
3. **Phase 3**: Add user interaction tables (Review, Favorite)
4. **Phase 4**: Add advanced features (BusinessHours, ContactInfo, SEO)

## API Endpoints Structure

```
GET    /api/places                    # List places with filters
GET    /api/places/[slug]             # Get place details
POST   /api/places                    # Create place (admin)
PUT    /api/places/[slug]             # Update place (admin)
DELETE /api/places/[slug]             # Delete place (admin)

GET    /api/places/[slug]/reviews     # Get place reviews
POST   /api/places/[slug]/reviews     # Add review
PUT    /api/reviews/[id]              # Update review
DELETE /api/reviews/[id]              # Delete review

POST   /api/places/[slug]/favorite   # Add to favorites
DELETE /api/places/[slug]/favorite    # Remove from favorites

GET    /api/locations                 # List locations
GET    /api/categories                # List categories
GET    /api/amenities                 # List amenities
```

This schema provides a comprehensive foundation for a place directory system with proper relationships, performance optimization, and extensibility for future features.
