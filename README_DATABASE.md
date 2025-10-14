# Database Setup - Complete Guide

## 🎯 Overview

This project uses **Prisma ORM** with support for:
- **MySQL** - Local development
- **PostgreSQL (Supabase)** - Production

---

## 🚀 Quick Start

### Option 1: Local Development (MySQL)

```bash
# 1. Create .env file
echo 'DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"' > .env

# 2. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 3. Start development
npm run dev
```

### Option 2: Production (Supabase)

```bash
# 1. Set environment variables in your hosting platform
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# 2. Setup database
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod

# 3. Deploy
npm run build
npm start
```

---

## 📁 Project Structure

```
prisma/
├── schema.prisma              # Main schema (MySQL for dev)
├── schema.production.prisma   # Production schema (PostgreSQL)
└── seed.ts                    # Seed script

src/
├── lib/
│   ├── prisma.ts              # Prisma client instance
│   └── db-helpers.ts          # Database helper functions
├── types/
│   └── database.ts            # TypeScript types
└── app/
    └── api/                   # API routes
        ├── categories/
        └── users/

.env.example                   # Environment variables template
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================

# LOCAL DEVELOPMENT (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"

# PRODUCTION (Supabase - PostgreSQL)
# Uncomment and use this for production
# DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# ============================================
# NEXT.JS CONFIGURATION
# ============================================

NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ============================================
# SUPABASE CONFIGURATION (Optional)
# ============================================

# NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
# SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## 🗄️ Database Schema

### Tables

#### 1. **Role** (3 records)
```sql
- id: Int (Primary Key)
- name: String (Unique) - 'user', 'publisher', 'administrator'
- description: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 2. **User** (0 records initially)
```sql
- id: Int (Primary Key)
- email: String (Unique)
- username: String (Unique)
- password: String
- firstName: String (Optional)
- lastName: String (Optional)
- roleId: Int (Foreign Key → Role.id, Default: 1)
- isActive: Boolean (Default: true)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 3. **Category** (10 records)
```sql
- id: Int (Primary Key)
- query: String (Unique) - URL-friendly identifier
- label: String - Display name
- keyphrase: String - SEO keyphrase
- description: String (Optional)
- icon: String (Optional)
- color: String (Optional)
- prompt: String (Optional)
- isActive: Boolean (Default: true)
- displayOrder: Int (Default: 0)
- createdAt: DateTime
- updatedAt: DateTime
```

### Relationships

```
User ──┐
       ├──> Role (Many-to-One)
       │    - Each user has one role
       │    - Default role: 'user' (ID: 1)
```

---

## 📋 Available Scripts

### Development (MySQL)

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |
| `npm run db:reset` | Reset database |

### Production (Supabase)

| Command | Description |
|---------|-------------|
| `npm run db:generate:prod` | Generate Prisma Client for PostgreSQL |
| `npm run db:push:prod` | Push schema to Supabase |
| `npm run db:migrate:prod` | Deploy migrations |
| `npm run db:studio:prod` | Open Prisma Studio for Supabase |
| `npm run db:seed:prod` | Seed Supabase |
| `npm run db:reset:prod` | Reset Supabase |

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

### Using Prisma Client

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

## 🔄 Switching Between Databases

### MySQL → PostgreSQL

1. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
   ```

2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Regenerate and push:
   ```bash
   npm run db:generate
   npm run db:push
   ```

### PostgreSQL → MySQL

1. Update `.env`:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"
   ```

2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

3. Regenerate and push:
   ```bash
   npm run db:generate
   npm run db:push
   ```

---

## 🐛 Troubleshooting

### MySQL Issues

**Can't connect to MySQL:**
```bash
# Check if MySQL is running
mysql -u root -p

# Create database
CREATE DATABASE cebuaknows;
```

**Access denied:**
```sql
GRANT ALL PRIVILEGES ON cebuaknows.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
```

### Supabase Issues

**Connection refused:**
- Check connection string from Supabase dashboard
- Verify password is correct
- Check if IP is allowed

**SSL required:**
- Add `?sslmode=require` to connection string
- Or use connection pooler URL

### Prisma Issues

**Client not generated:**
```bash
npm run db:generate
```

**Schema not in sync:**
```bash
npm run db:push
```

---

## 📚 Documentation

- **Quick Start**: `DATABASE_QUICK_START.md`
- **Configuration**: `DATABASE_CONFIG.md`
- **Quick Reference**: `DATABASE_QUICK_REFERENCE.md`
- **Full Setup**: `DATABASE_SETUP.md`
- **Summary**: `DATABASE_SUMMARY.md`

---

## ✅ Setup Checklist

### Local Development
- [ ] MySQL installed and running
- [ ] Database created
- [ ] `.env` file configured
- [ ] Prisma Client generated
- [ ] Schema pushed to database
- [ ] Database seeded with default data
- [ ] Prisma Studio opened and verified

### Production
- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] Environment variables set in hosting platform
- [ ] Prisma Client generated for production
- [ ] Schema pushed to Supabase
- [ ] Database seeded with default data
- [ ] Application deployed and tested

---

## 🎉 You're All Set!

Your database is ready to use. Start building your application!

```bash
# Local development
npm run dev

# Production
npm run build
npm start
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation files
3. Check Prisma documentation: https://www.prisma.io/docs
4. Check Supabase documentation: https://supabase.com/docs

---

**Happy Coding! 🚀**

