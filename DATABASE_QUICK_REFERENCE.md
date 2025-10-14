# Database Quick Reference

## 🚀 Quick Start Commands

### Local Development (MySQL)

```bash
# 1. Configure .env
DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"

# 2. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 3. Open Prisma Studio
npm run db:studio
```

### Production (Supabase - PostgreSQL)

```bash
# 1. Configure environment variables in your hosting platform
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# 2. Setup database
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod

# 3. Open Prisma Studio
npm run db:studio:prod
```

---

## 📋 Environment Variables

### .env (Local Development)
```env
# MySQL
DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production Environment
```env
# PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

---

## 🔧 Database Scripts

### Development Scripts
```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema to MySQL
npm run db:migrate     # Create migration
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database
npm run db:reset       # Reset database
```

### Production Scripts
```bash
npm run db:generate:prod    # Generate Prisma Client for PostgreSQL
npm run db:push:prod        # Push schema to Supabase
npm run db:migrate:prod     # Deploy migrations
npm run db:studio:prod      # Open Prisma Studio for Supabase
npm run db:seed:prod        # Seed Supabase
npm run db:reset:prod       # Reset Supabase
```

---

## 🔄 Switching Databases

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

## 🗄️ Database Schema

### Tables

| Table | Description | Records |
|-------|-------------|---------|
| **Role** | User roles | 3 (user, publisher, administrator) |
| **User** | User accounts | 0 (initially) |
| **Category** | Service categories | 10 (hotels, coffee-shops, etc.) |

### Relationships

```
User (Many) ──┐
              ├──> Role (One)
```

---

## 💡 Common Operations

### Get All Categories
```typescript
import { getAllCategories } from '@/lib/db-helpers'
const categories = await getAllCategories()
```

### Create User
```typescript
import { createUser } from '@/lib/db-helpers'
const user = await createUser({
  email: 'user@example.com',
  username: 'johndoe',
  password: 'hashed_password',
  roleId: 1
})
```

### Get User with Role
```typescript
import { getUserByEmail } from '@/lib/db-helpers'
const user = await getUserByEmail('user@example.com')
console.log(user.role.name) // 'user', 'publisher', or 'administrator'
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

## 📚 Full Documentation

- **Setup Guide**: `DATABASE_SETUP.md`
- **Configuration**: `DATABASE_CONFIG.md`
- **Quick Start**: `DATABASE_QUICK_START.md`
- **Summary**: `DATABASE_SUMMARY.md`

---

## ✅ Checklist

### Local Setup
- [ ] MySQL installed and running
- [ ] Database created
- [ ] `.env` configured
- [ ] Prisma Client generated
- [ ] Schema pushed
- [ ] Database seeded

### Production Setup
- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] Environment variables set
- [ ] Prisma Client generated
- [ ] Schema pushed
- [ ] Database seeded

---

**Need help?** See `DATABASE_CONFIG.md` for detailed instructions.

