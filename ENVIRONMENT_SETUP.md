# Environment Setup Guide

## 🚨 **CRITICAL: Missing Environment Variables**

The server error you're experiencing is because the required environment variables are not set up. Follow these steps to fix it:

## 1. Create Environment File

Create a `.env.local` file in your project root with the following content:

```env
# Database (Update with your actual database credentials)
DATABASE_URL="mysql://username:password@localhost:3306/cebuaknows"

# NextAuth.js (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-replace-with-random-string"

# Google OAuth (Optional - can be left empty for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## 2. Generate a Secret Key

For the `NEXTAUTH_SECRET`, you can generate a random string:

```bash
# Option 1: Use openssl
openssl rand -base64 32

# Option 2: Use node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3. Update Database URL

Make sure your `DATABASE_URL` matches your actual database configuration:

```env
# For local MySQL
DATABASE_URL="mysql://root:password@localhost:3306/cebuaknows"

# For MySQL with different credentials
DATABASE_URL="mysql://your_username:your_password@localhost:3306/cebuaknows"
```

## 4. Restart Development Server

After creating the `.env.local` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 5. Test Authentication

1. Go to `http://localhost:3000`
2. Click the sidebar menu (hamburger icon)
3. Click "Sign Up" or "Sign In"
4. The authentication should now work properly

## 🔧 **Troubleshooting**

### If you still get errors:

1. **Check the terminal output** for specific error messages
2. **Verify database connection** by running:
   ```bash
   npm run db:studio
   ```
3. **Check if all environment variables are loaded** by adding this to your auth.ts temporarily:
   ```typescript
   console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET)
   console.log('DATABASE_URL:', process.env.DATABASE_URL)
   ```

### Common Issues:

- **"NEXTAUTH_SECRET is not defined"** → Add NEXTAUTH_SECRET to .env.local
- **"Database connection failed"** → Check DATABASE_URL format
- **"Google OAuth error"** → Leave GOOGLE_CLIENT_ID empty for now (optional)

## 📝 **Environment Variables Reference**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | MySQL connection string |
| `NEXTAUTH_URL` | ✅ Yes | Your app URL (usually localhost:3000) |
| `NEXTAUTH_SECRET` | ✅ Yes | Random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | ❌ No | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | ❌ No | Google OAuth client secret (optional) |

## 🎯 **Quick Fix**

The fastest way to get it working:

1. Create `.env.local` file
2. Copy the content above
3. Update DATABASE_URL with your credentials
4. Generate a random NEXTAUTH_SECRET
5. Restart the server

This should resolve the server configuration error immediately.
