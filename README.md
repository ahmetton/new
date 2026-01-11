# ahmetton/new Repository

This repository contains a WordPress LMS plugin/theme and a standalone authentication system with automatic integration.

## Contents

### 📁 v/ - WordPress LMS System
Contains WordPress plugin and theme for educational/LMS functionality:
- `الإضافة/` - WordPress plugin for LMS features (includes Next.js integration)
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

## 🔗 WordPress Integration

The authentication system is **automatically integrated** with WordPress. When users click registration links in WordPress, they are redirected to the professional Next.js authentication page.

**[→ Integration Guide (Arabic)](./INTEGRATION_GUIDE_AR.md)**

### Quick Setup for Integration:

1. **Start the auth app:**
```bash
cd auth-app
npm install
npm run prisma:push
npm run dev
```

2. **Configure WordPress:**
Edit `/v/الإضافة/includes/nextjs-auth-integration.php` line 13:
```php
define( 'WPEDU_AUTH_APP_URL', 'http://localhost:3000' );
```

3. **Test:** Click any registration link in WordPress - you'll be redirected to the professional auth page!

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
├── v/                                # WordPress content
│   ├── الإضافة/                     # WordPress plugin
│   │   └── includes/
│   │       └── nextjs-auth-integration.php  # Integration file
│   └── القالب/                      # WordPress theme
├── auth-app/                         # Authentication system
│   ├── pages/                       # Next.js pages
│   ├── components/                  # React components
│   ├── lib/                        # Utilities
│   ├── prisma/                     # Database schema
│   └── README.md                   # Detailed docs
├── INTEGRATION_GUIDE_AR.md         # Integration guide (Arabic)
└── README.md                       # This file
```

## Contributing

Please ensure any contributions maintain the security and quality standards of the project.

## License

See individual component licenses.
