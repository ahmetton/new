import { prisma } from '../../../lib/prisma'
import { isValidEmail } from '../../../lib/auth-utils'
import { sendPasswordResetEmail } from '../../../lib/email'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' })
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ 
        message: 'If an account exists, a password reset link has been sent to your email',
        smtpConfigured: false
      })
    }

    // Generate secure reset token using crypto
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires
      }
    })

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset?token=${token}`
    const emailResult = await sendPasswordResetEmail(user.email, token, resetUrl)

    return res.status(200).json({ 
      message: 'If an account exists, a password reset link has been sent to your email',
      smtpConfigured: !emailResult.logged,
      tokenLogged: emailResult.logged
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return res.status(500).json({ message: 'An error occurred. Please try again.' })
  }
}
