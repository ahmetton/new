# Professional Authentication System

A secure, modern authentication system built with Next.js, NextAuth.js, and Prisma.

## Features

- ✅ **Email or Phone Login** - Users can sign in with either email or phone number
- ✅ **Password Security** - Passwords hashed with bcrypt (12 rounds)
- ✅ **Social Authentication** - Google and Facebook OAuth support
- ✅ **Password Reset** - Secure password reset flow via email
- ✅ **Remember Me** - Extended session duration option
- ✅ **Registration** - Built-in user registration
- ✅ **Session Management** - Secure JWT-based sessions
- ✅ **CSRF Protection** - Built-in with NextAuth.js
- ✅ **Modern UI** - Responsive design with Tailwind CSS
- ✅ **SQLite Database** - Easy local development with Prisma

## Tech Stack

- **Framework:** Next.js 14
- **Authentication:** NextAuth.js (Auth.js)
- **Database:** SQLite (via Prisma ORM)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **Styling:** Tailwind CSS
- **Icons:** React Icons

## Prerequisites

- Node.js 18+ and npm
- Basic knowledge of Next.js

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database (default SQLite - no changes needed for local development)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# OAuth Providers (Optional - see OAuth Setup section below)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# SMTP Configuration (Optional - see Email Setup section below)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="noreply@example.com"
```

**Important:** Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Set Up Database

Generate Prisma client and create the database:

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## OAuth Setup (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add "Facebook Login" product
4. Set Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`
5. Copy App ID and App Secret to `.env`

**Note:** Without OAuth configuration, social login buttons won't appear, but email/phone authentication will still work.

## Email Setup (Optional)

### Using Gmail SMTP

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords)
3. Configure in `.env`:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"
```

### Using Other SMTP Providers

Configure your SMTP settings in `.env` according to your provider's documentation.

**Note:** Without SMTP configuration, password reset tokens will be logged to the server console for development purposes.

## Database Schema

The application uses the following models:

- **User** - Stores user information (email, phone, hashed password)
- **Account** - OAuth account linking
- **Session** - User sessions
- **VerificationToken** - Email verification tokens
- **PasswordResetToken** - Password reset tokens

### View Database

Use Prisma Studio to view and edit data:

```bash
npm run prisma:studio
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/forgot` - Request password reset
- `POST /api/auth/reset` - Reset password with token
- `/api/auth/[...nextauth]` - NextAuth.js endpoints

## Pages

- `/` - Home page (protected, requires authentication)
- `/auth/signin` - Sign in and registration page
- `/auth/reset-request` - Request password reset
- `/auth/reset?token=xxx` - Reset password with token

## Security Features

1. **Password Hashing** - bcrypt with 12 rounds
2. **CSRF Protection** - Built-in with NextAuth.js
3. **Secure Sessions** - JWT with httpOnly cookies
4. **SQL Injection Prevention** - Prisma ORM parameterized queries
5. **XSS Protection** - React's built-in escaping
6. **Password Policy** - Minimum 8 characters
7. **Token Expiration** - Reset tokens expire in 1 hour

## Usage Examples

### Basic Login

1. Navigate to http://localhost:3000
2. You'll be redirected to sign in page
3. Click "Don't have an account? Sign up"
4. Fill in email/phone and password
5. After registration, you'll be automatically signed in

### Password Reset

1. Click "Forgot password?" on sign in page
2. Enter your email address
3. Check email for reset link (or server console if SMTP not configured)
4. Click reset link and enter new password

### Social Login (if configured)

1. Click Google or Facebook button on sign in page
2. Authorize the application
3. You'll be redirected back and signed in

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:studio` - Open Prisma Studio

### Database Migrations

When you modify the Prisma schema:

```bash
npm run prisma:generate
npm run prisma:push
```

## Production Deployment

### Environment Variables

Set these in your production environment:

1. Generate new `NEXTAUTH_SECRET`
2. Set `NEXTAUTH_URL` to your production URL
3. Configure production database URL (PostgreSQL, MySQL, etc.)
4. Set up OAuth credentials for production redirect URIs
5. Configure production SMTP settings

### Database

For production, consider using PostgreSQL or MySQL instead of SQLite:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run migrations:

```bash
npx prisma migrate dev --name init
```

## Troubleshooting

### OAuth Not Working

- Verify redirect URIs match exactly in provider console
- Check CLIENT_ID and CLIENT_SECRET are correct
- Ensure the OAuth provider is enabled

### Email Not Sending

- Verify SMTP credentials are correct
- Check firewall/security settings
- Try a different SMTP provider

### Database Issues

- Delete `prisma/dev.db` and run `npm run prisma:push` again
- Check DATABASE_URL format is correct

## Integration with Existing Projects

This auth system is self-contained in the `/auth-app` directory. To integrate:

1. **Standalone** - Run as separate service on different port
2. **Embedded** - Copy components to your Next.js project
3. **API** - Use the API endpoints from another application

## Security Best Practices

- ✅ Change `NEXTAUTH_SECRET` in production
- ✅ Use HTTPS in production
- ✅ Enable rate limiting on API routes
- ✅ Set secure cookie options in production
- ✅ Regular security updates of dependencies
- ✅ Monitor authentication logs
- ✅ Implement account lockout after failed attempts

## License

This project is created for the ahmetton/new repository.

## Support

For issues or questions, please open an issue in the repository.
