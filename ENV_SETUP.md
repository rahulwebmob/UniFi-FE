# Environment Variables Setup Guide

## Overview
This project uses environment variables to manage configuration across different environments (development, production).

## File Structure

```
.env.example        # Template file with all variables (commit this)
.env.development    # Development environment (DO NOT commit)
.env.production     # Production environment (DO NOT commit)
.env               # Local overrides (DO NOT commit)
```

## Setup Instructions

### For Development

1. Copy `.env.example` to `.env.development`
2. Fill in the development values
3. Run `npm run dev` to start development server

### For Production

1. Copy `.env.example` to `.env.production`
2. Fill in the production values
3. Run `npm run build` to create production build

## Available Scripts

```bash
# Development
npm run dev           # Start dev server with development env
npm run dev:prod      # Start dev server with production env (testing)

# Build
npm run build         # Build for production
npm run build:dev     # Build with development env

# Preview
npm run preview       # Preview production build
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BASE_URL` | API server URL | `http://localhost:3000` |
| `VITE_AES_SECRET_KEY` | Encryption key | 16-character string |

### OAuth Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `VITE_LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | Optional |
| `VITE_TWITTER_CLIENT_ID` | Twitter integration ID | Optional |

### Third-party Integrations

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ZOOM_CLIENT_ID` | Zoom integration | For webinars |
| `VITE_COINROUTES_API_KEY` | CoinRoutes API | Optional |
| `VITE_SQUAWK_KEY` | Squawk service key | Optional |
| `VITE_SQUAWK_VALUE` | Squawk service value | Optional |

### CDN & Assets

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CDN` | CDN URL for assets | Local |
| `VITE_PUBLIC_PATH` | Public path | `/` |

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` files with real values
- Use different keys for development and production
- Rotate keys regularly
- Use strong encryption keys (minimum 16 characters)

## Switching Between Environments

### Local Development (default)
```bash
npm run dev
```

### Test with Production Config
```bash
npm run dev:prod
```

### Build for Production
```bash
npm run build
```

## Troubleshooting

### Variable not loading?
1. Check if variable is prefixed with `VITE_`
2. Restart the dev server after changing env files
3. Check the mode in package.json scripts

### Using in Code
```javascript
// Use the ENV object from utils/env.js
import { ENV } from '@/utils/env'

console.log(ENV.BASE_URL)
// NOT: import.meta.env.VITE_BASE_URL
```

## Adding New Variables

1. Add to `.env.example` with description
2. Add to `src/utils/env.js` ENV object
3. Update this documentation
4. Add to appropriate `.env.*` files