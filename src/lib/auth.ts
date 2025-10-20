import { NextAuthOptions } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string
    roleId?: number
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      roleId?: number
    }
  }
}

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is required. Please add it to your .env.local file.')
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Please add it to your .env.local file.')
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth disabled for now
    // ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
    //   GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   })
    // ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            role: true
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ''
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
          role: user.role.name,
          roleId: user.roleId
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.roleId = user.roleId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.roleId = token.roleId as number
      }
      return session
    },
    async signIn() {
      // Google OAuth disabled for now
      // if (account?.provider === "google") {
      //   try {
      //     // Check if user exists
      //     const existingUser = await prisma.user.findUnique({
      //       where: { email: user.email! },
      //       include: { role: true }
      //     })

      //     if (!existingUser) {
      //       // Create new user with default role (user)
      //       const defaultRole = await prisma.role.findFirst({
      //         where: { name: "user" }
      //       })

      //       if (!defaultRole) {
      //         return false
      //       }

      //       await prisma.user.create({
      //         data: {
      //           email: user.email!,
      //           username: user.email!.split('@')[0],
      //           password: '', // OAuth users don't need password
      //           firstName: user.name?.split(' ')[0] || null,
      //           lastName: user.name?.split(' ').slice(1).join(' ') || null,
      //           roleId: defaultRole.id,
      //           isActive: true
      //         }
      //       })
      //     }
      //   } catch (error) {
      //     console.error("Error during Google sign-in:", error)
      //     return false
      //   }
      // }
      return true
    }
  },
  pages: {
    signIn: "/login"
  }
}
