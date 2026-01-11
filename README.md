# ahmetton/new Repository

This repository contains a WordPress LMS plugin/theme and a standalone authentication system.

## Contents

### 📁 v/ - WordPress LMS System
Contains WordPress plugin and theme for educational/LMS functionality:
- `الإضافة/` - WordPress plugin for LMS features
- `القالب/` - WordPress theme

### 🔐 auth-app/ - Professional Authentication System
A modern, secure authentication system built with Next.js and NextAuth.js.

**Features:**
- Email or Phone login
- Social authentication (Google, Facebook)
- Password reset functionality
- User registration
- Remember me option
- Professional responsive UI

**[→ View Full Documentation](./auth-app/README.md)**

## Quick Start - Authentication System

```bash
cd auth-app
npm install
npm run prisma:push
npm run dev
```

Visit http://localhost:3000 to see the authentication system.

For detailed setup instructions, OAuth configuration, and SMTP setup, see the [auth-app README](./auth-app/README.md).

## Repository Structure

```
.
├── v/                    # WordPress content
│   ├── الإضافة/         # WordPress plugin
│   └── القالب/          # WordPress theme
├── auth-app/            # Authentication system
│   ├── pages/          # Next.js pages
│   ├── components/     # React components
│   ├── lib/           # Utilities
│   ├── prisma/        # Database schema
│   └── README.md      # Detailed docs
└── README.md          # This file
```

## Contributing

Please ensure any contributions maintain the security and quality standards of the project.

## License

See individual component licenses.
