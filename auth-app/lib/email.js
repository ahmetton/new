import nodemailer from 'nodemailer'

export async function sendPasswordResetEmail(email, token, resetUrl) {
  // If SMTP is not configured, log the token to console
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('='.repeat(60))
    console.log('PASSWORD RESET TOKEN (SMTP not configured)')
    console.log('='.repeat(60))
    console.log(`Email: ${email}`)
    console.log(`Token: ${token}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log('='.repeat(60))
    return { success: true, logged: true }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@example.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    })

    return { success: true, logged: false }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error.message }
  }
}
