import { prisma } from '../../../lib/prisma'
import { hashPassword } from '../../../lib/auth-utils'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' })
  }

  try {
    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    // Check if token is expired
    if (new Date() > resetToken.expires) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
      return res.status(400).json({ message: 'Reset token has expired' })
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { hashedPassword }
    })

    // Delete used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })

    return res.status(200).json({ 
      message: 'Password has been reset successfully. You can now sign in with your new password.' 
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return res.status(500).json({ message: 'An error occurred. Please try again.' })
  }
}
