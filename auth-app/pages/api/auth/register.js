import { prisma } from '../../../lib/prisma'
import { hashPassword, isValidEmail, isValidPhone } from '../../../lib/auth-utils'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, phone, password, name } = req.body

  // Validate inputs
  if ((!email && !phone) || !password) {
    return res.status(400).json({ message: 'Email or phone, and password are required' })
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ message: 'Invalid phone format' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' })
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {}
        ].filter(obj => Object.keys(obj).length > 0)
      }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        hashedPassword,
        name: name || null,
      }
    })

    return res.status(201).json({ 
      message: 'Account created successfully. You can now sign in.',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'An error occurred. Please try again.' })
  }
}
