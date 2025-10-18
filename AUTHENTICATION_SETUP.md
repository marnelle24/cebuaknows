# Authentication System Setup Guide

This guide will help you set up the role-based authentication system for Cebuaknows.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/cebuaknows"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database Setup

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Run Database Migration:**
   ```bash
   npm run db:push
   ```

3. **Seed the Database:**
   ```bash
   npm run db:seed
   ```

### 3. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

## 🏗️ System Architecture

### Authentication Flow

1. **Registration/Login:**
   - Users can register with email/password or Google OAuth
   - Default role is assigned as "user"
   - Passwords are hashed using bcrypt

2. **Role-Based Access:**
   - **User:** Basic access to user dashboard
   - **Publisher:** Can manage content and access publisher dashboard
   - **Administrator:** Full system access and admin dashboard

3. **Route Protection:**
   - Middleware protects routes based on user roles
   - Automatic redirection to appropriate dashboard after login

### File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── admin/page.tsx
│   │   ├── publisher/page.tsx
│   │   └── user/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts
│       │   └── register/route.ts
│       └── admin/
│           └── stats/route.ts
├── lib/
│   └── auth.ts
├── stores/
│   └── authStore.ts
├── components/
│   └── SessionProvider.tsx
└── middleware.ts
```

## 🔧 Features

### Authentication Features
- ✅ Email/Password registration and login
- ✅ Google OAuth integration
- ✅ Password hashing with bcrypt
- ✅ Session management with NextAuth.js
- ✅ Role-based access control

### Dashboard Features
- ✅ **Admin Dashboard:** Analytics, user management, system settings
- ✅ **Publisher Dashboard:** Content management, publishing tools
- ✅ **User Dashboard:** Personal preferences, search history, favorites

### Security Features
- ✅ Route protection with middleware
- ✅ Role-based access control
- ✅ Secure session handling
- ✅ CSRF protection

## 🎨 UI/UX Features

- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Modern, clean interface
- ✅ Mobile-friendly navigation
- ✅ Loading states and error handling

## 🚦 Usage Examples

### Protecting Routes

```typescript
// middleware.ts automatically protects routes
// /dashboard/admin - only administrators
// /dashboard/publisher - publishers and administrators
// /dashboard/user - all authenticated users
```

### Using Authentication in Components

```typescript
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (!session) return <div>Please sign in</div>
  
  return <div>Welcome {session.user.name}!</div>
}
```

### Using Zustand Store

```typescript
import { useAuthStore } from '@/stores/authStore'

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuthStore()
  
  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome {user?.name}!</div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  )
}
```

## 🔍 Testing the System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Registration:**
   - Navigate to `/auth/register`
   - Create a new account
   - Verify redirection to user dashboard

3. **Test Login:**
   - Navigate to `/auth/login`
   - Sign in with existing credentials
   - Verify role-based redirection

4. **Test Role-Based Access:**
   - Try accessing `/dashboard/admin` as a regular user
   - Should redirect to `/dashboard/user`

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Issues:**
   - Verify DATABASE_URL is correct
   - Ensure database server is running
   - Check database permissions

2. **Google OAuth Issues:**
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Check redirect URI configuration
   - Ensure Google+ API is enabled

3. **Session Issues:**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Clear browser cookies and try again

### Debug Mode

Enable debug mode by adding to your `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Contributing

When adding new features:

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Test with different user roles
5. Update documentation as needed

## 📄 License

This authentication system is part of the Cebuaknows project.
