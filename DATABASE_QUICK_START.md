# Database Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Configure Database
Add your PostgreSQL connection string to `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cebuaknows"
```

### Step 2: Create Database Tables
```bash
npm run db:push
```

### Step 3: Seed Default Data
```bash
npm run db:seed
```

**Done!** Your database is ready with:
- ✅ 3 Roles (user, publisher, administrator)
- ✅ 10 Categories (hotels, coffee-shops, tourist-spots, etc.)

---

## 📊 Database Schema

### Tables Created

#### 1. **Role** (3 records)
- `id` - Primary key
- `name` - Role name (user, publisher, administrator)
- `description` - Role description
- `createdAt`, `updatedAt` - Timestamps

#### 2. **User** (0 records initially)
- `id` - Primary key
- `email` - Unique email address
- `username` - Unique username
- `password` - Hashed password
- `firstName`, `lastName` - Optional names
- `roleId` - Foreign key to Role (default: 1 = user)
- `isActive` - Account status
- `createdAt`, `updatedAt` - Timestamps

#### 3. **Category** (10 records)
- `id` - Primary key
- `query` - URL-friendly identifier (e.g., "hotels")
- `label` - Display name (e.g., "Hotels")
- `keyphrase` - SEO keyphrase
- `description` - Category description
- `icon` - Icon identifier
- `color` - Tailwind color classes
- `prompt` - AI prompt template
- `isActive` - Visibility status
- `displayOrder` - UI ordering
- `createdAt`, `updatedAt` - Timestamps

---

## 💻 Usage Examples

### Using Database Helpers

```typescript
import { getAllCategories, getUserByEmail, createUser } from '@/lib/db-helpers'

// Get all active categories
const categories = await getAllCategories()

// Get user by email
const user = await getUserByEmail('user@example.com')

// Create a new user
const newUser = await createUser({
  email: 'john@example.com',
  username: 'johndoe',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  roleId: 1 // user role
})
```

### Using Prisma Client Directly

```typescript
import { prisma } from '@/lib/prisma'

// Get all users with their roles
const users = await prisma.user.findMany({
  include: { role: true }
})

// Get category by query
const category = await prisma.category.findUnique({
  where: { query: 'hotels' }
})

// Create a new category
const newCategory = await prisma.category.create({
  data: {
    query: 'restaurants',
    label: 'Restaurants',
    keyphrase: 'top-restaurants',
    description: 'Best dining spots',
    icon: 'Utensils',
    color: 'from-red-500 to-red-600',
    displayOrder: 11
  }
})
```

### Using API Routes

```typescript
// GET /api/categories
fetch('/api/categories')
  .then(res => res.json())
  .then(data => console.log(data))

// GET /api/categories/hotels
fetch('/api/categories/hotels')
  .then(res => res.json())
  .then(data => console.log(data))

// POST /api/users
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'johndoe',
    password: 'password123'
  })
})
```

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Create migration (production) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed database with default data |

---

## 🎨 Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

Opens at `http://localhost:5555`

---

## 📁 File Structure

```
src/
├── lib/
│   ├── prisma.ts          # Prisma client instance
│   └── db-helpers.ts      # Helper functions
├── types/
│   └── database.ts        # TypeScript types
└── app/
    └── api/
        ├── categories/    # Category API routes
        └── users/         # User API routes

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Seed script
```

---

## 🔧 Common Tasks

### Add a New Category

```typescript
import { createCategory } from '@/lib/db-helpers'

await createCategory({
  query: 'spas',
  label: 'Spas',
  keyphrase: 'top-spas',
  description: 'Relaxation and wellness centers',
  icon: 'Sparkles',
  color: 'from-pink-500 to-pink-600',
  displayOrder: 11
})
```

### Update a Category

```typescript
import { updateCategory } from '@/lib/db-helpers'

await updateCategory(1, {
  description: 'Updated description',
  isActive: true
})
```

### Get User with Role

```typescript
import { getUserByEmail } from '@/lib/db-helpers'

const user = await getUserByEmail('user@example.com')
console.log(user.role.name) // 'user', 'publisher', or 'administrator'
```

### Check User Role

```typescript
const user = await getUserByEmail('user@example.com')

if (user.role.name === 'administrator') {
  // Admin-only code
}
```

---

## 🐛 Troubleshooting

### "Prisma Client not found"
```bash
npm run db:generate
```

### "Connection refused"
- Check if PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Ensure database exists

### Reset Database
```bash
npx prisma migrate reset
```

---

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js + Prisma](https://www.prisma.io/docs/guides/database/using-prisma-with-planetscale)
- [Full Setup Guide](./DATABASE_SETUP.md)

