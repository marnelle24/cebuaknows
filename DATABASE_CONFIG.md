# Database Configuration Guide

This project supports **two database setups**:
- **MySQL** for local development
- **PostgreSQL (Supabase)** for production

---

## 🏠 Local Development (MySQL)

### Prerequisites
- MySQL installed and running locally
- Default port: `3306`

### Setup Steps

#### 1. Create MySQL Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE cebuaknows;
CREATE USER 'cebuaknows_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cebuaknows.* TO 'cebuaknows_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2. Configure Environment Variables
Create `.env` file:

```env
# MySQL Connection
DATABASE_URL="mysql://cebuaknows_user:your_password@localhost:3306/cebuaknows"

# Or use root user
DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"

NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 3. Generate Prisma Client
```bash
npm run db:generate
```

#### 4. Push Schema to Database
```bash
npm run db:push
```

#### 5. Seed Database
```bash
npm run db:seed
```

#### 6. Open Prisma Studio
```bash
npm run db:studio
```

---

## 🚀 Production (Supabase - PostgreSQL)

### Prerequisites
- Supabase account and project created
- Database connection string from Supabase dashboard

### Setup Steps

#### 1. Get Supabase Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Copy the **Connection string** (use "Transaction" mode)
4. Replace `[YOUR-PASSWORD]` with your database password

**Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

#### 2. Configure Environment Variables

Update your production environment (Vercel, Railway, etc.):

```env
# Supabase PostgreSQL Connection
DATABASE_URL="postgresql://postgres:your_password@db.abcdefgh.supabase.co:5432/postgres"

NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

#### 3. Generate Prisma Client for Production
```bash
npm run db:generate:prod
```

#### 4. Push Schema to Supabase
```bash
npm run db:push:prod
```

Or use migrations:
```bash
npm run db:migrate:prod
```

#### 5. Seed Production Database
```bash
npm run db:seed:prod
```

---

## 📋 Available Database Scripts

### Development (MySQL)

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client for MySQL |
| `npm run db:push` | Push schema to MySQL database |
| `npm run db:migrate` | Create migration for MySQL |
| `npm run db:studio` | Open Prisma Studio for MySQL |
| `npm run db:seed` | Seed MySQL database |
| `npm run db:reset` | Reset MySQL database |

### Production (Supabase/PostgreSQL)

| Command | Description |
|---------|-------------|
| `npm run db:generate:prod` | Generate Prisma Client for PostgreSQL |
| `npm run db:push:prod` | Push schema to Supabase |
| `npm run db:migrate:prod` | Deploy migrations to Supabase |
| `npm run db:studio:prod` | Open Prisma Studio for Supabase |
| `npm run db:seed:prod` | Seed Supabase database |
| `npm run db:reset:prod` | Reset Supabase database |

---

## 🔄 Switching Between Databases

### Switch from MySQL to PostgreSQL

1. **Update `.env` file:**
   ```env
   DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
   ```

2. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Regenerate and push:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

### Switch from PostgreSQL to MySQL

1. **Update `.env` file:**
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"
   ```

2. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Regenerate and push:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

---

## 🔐 Environment Variables

### Required Variables

```env
# Database Connection String
DATABASE_URL="mysql://user:password@host:port/database"

# Environment
NODE_ENV="development" # or "production"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Optional Variables

```env
# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## 🗄️ Database Schema

Both MySQL and PostgreSQL use the same schema:

### Tables

1. **Role** - User roles (user, publisher, administrator)
2. **User** - User accounts with authentication
3. **Category** - Service categories (hotels, coffee-shops, etc.)

### Relationships

- **User** → **Role** (Many-to-One)
  - Each user has one role
  - Default role: `user` (ID: 1)

---

## 🐛 Troubleshooting

### MySQL Connection Issues

**Error:** `Can't connect to MySQL server`

**Solutions:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check connection string format
3. Ensure database exists
4. Verify user permissions

**Error:** `Access denied for user`

**Solutions:**
1. Check username and password
2. Verify user has permissions: `GRANT ALL PRIVILEGES ON cebuaknows.* TO 'user'@'localhost';`
3. Flush privileges: `FLUSH PRIVILEGES;`

### Supabase Connection Issues

**Error:** `Connection refused` or `Timeout`

**Solutions:**
1. Verify connection string from Supabase dashboard
2. Check if password is correct
3. Ensure your IP is allowed (check Supabase dashboard)
4. Try using connection pooler URL

**Error:** `SSL is required`

**Solutions:**
1. Add `?sslmode=require` to connection string
2. Or use Supabase's connection pooler URL

### Prisma Issues

**Error:** `Prisma Client not generated`

**Solution:**
```bash
npm run db:generate
```

**Error:** `Schema is not in sync`

**Solution:**
```bash
npm run db:push
```

---

## 📚 Resources

- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Supabase Documentation](https://supabase.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 🎯 Quick Reference

### Local Development (MySQL)
```bash
# Setup
npm run db:generate
npm run db:push
npm run db:seed

# Development
npm run db:studio
npm run dev
```

### Production (Supabase)
```bash
# Setup
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod

# Monitor
npm run db:studio:prod
```

---

## ✅ Checklist

### Local Setup
- [ ] MySQL installed and running
- [ ] Database created
- [ ] `.env` file configured with MySQL connection
- [ ] Prisma Client generated
- [ ] Schema pushed to database
- [ ] Database seeded with default data

### Production Setup
- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] Environment variables set in hosting platform
- [ ] Prisma Client generated for production
- [ ] Schema pushed to Supabase
- [ ] Database seeded with default data

---

Need help? Check the troubleshooting section or refer to the full documentation in `DATABASE_SETUP.md`.

