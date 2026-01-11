import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../lib/prisma'
import { verifyPassword, isValidEmail, isValidPhone } from '../../../lib/auth-utils'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        const { emailOrPhone, password } = credentials

        if (!emailOrPhone || !password) {
          throw new Error('Please provide email/phone and password')
        }

        // Determine if input is email or phone
        const isEmail = isValidEmail(emailOrPhone)
        const isPhone = isValidPhone(emailOrPhone)

        if (!isEmail && !isPhone) {
          throw new Error('Please provide a valid email or phone number')
        }

        // Find user by email or phone
        const user = await prisma.user.findFirst({
          where: isEmail 
            ? { email: emailOrPhone }
            : { phone: emailOrPhone }
        })

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials')
        }

        // Verify password
        const isValid = await verifyPassword(password, user.hashedPassword)

        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          image: user.image,
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET 
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []
    ),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [FacebookProvider({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        })]
      : []
    ),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.phone = token.phone
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
