# Database Setup Guide

This project uses Prisma ORM with PostgreSQL for database management.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local or remote)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database Connection

Create a `.env` file in the root directory (if it doesn't exist) and add your database connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**Local PostgreSQL Example:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cebuaknows"
```

**Remote PostgreSQL Example (Supabase, Railway, etc.):**
```env
DATABASE_URL="postgresql://user:password@hostname:5432/database"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Schema to Database

This will create the tables in your database:

```bash
npm run db:push
```

Or use migrations for production:

```bash
npm run db:migrate
```

### 5. Seed Database with Default Data

This will populate the database with:
- Roles (user, publisher, administrator)
- Categories (hotels, coffee-shops, tourist-spots, etc.)

```bash
npm run db:seed
```

## Database Schema

### Tables

#### 1. **Role**
- Stores user roles: `user`, `publisher`, `administrator`
- Default role for new users is `user`

#### 2. **User**
- User accounts with authentication
- Linked to Role table via `roleId`
- Includes: email, username, password, firstName, lastName

#### 3. **Category**
- Service categories from the location page
- Includes: hotels, coffee-shops, tourist-spots, milk-tea-shops, diving-spots, delicacies, churches, car-rentals, tourist-inn, politician
- Each category has: query, label, keyphrase, description, icon, color, prompt

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema changes to database (development) |
| `npm run db:migrate` | Create and apply migrations (production) |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:seed` | Seed database with default data |

## Using Prisma Client in Your Code

```typescript
import { prisma } from '@/lib/prisma'

// Example: Get all categories
const categories = await prisma.category.findMany({
  where: { isActive: true },
  orderBy: { displayOrder: 'asc' }
})

// Example: Create a new user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    username: 'johndoe',
    password: 'hashed_password',
    roleId: 1 // user role
  }
})

// Example: Get user with role
const userWithRole = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { role: true }
})
```

## Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

This opens a GUI at `http://localhost:5555` where you can view and edit your database.

## Environment Variables

Make sure your `.env` file includes:

```env
DATABASE_URL="your_database_connection_string"
```

**Important:** Never commit your `.env` file to version control!

## Troubleshooting

### Connection Issues

1. Verify PostgreSQL is running
2. Check connection string format
3. Ensure database exists
4. Verify credentials are correct

### Reset Database

To reset and reseed the database:

```bash
npx prisma migrate reset
```

This will:
- Drop all tables
- Recreate them
- Run seed script

## Production Deployment

For production:

1. Use migrations instead of `db:push`:
   ```bash
   npm run db:migrate
   ```

2. Set `DATABASE_URL` environment variable in your hosting platform

3. Run seed script (if needed):
   ```bash
   npm run db:seed
   ```

4. Generate Prisma Client in your build process:
   ```bash
   npm run db:generate
   ```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js with Prisma](https://www.prisma.io/docs/guides/database/using-prisma-with-planetscale)

