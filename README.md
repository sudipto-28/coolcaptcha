# CoolCaptcha - Deployment Guide

## Project Overview

CoolCaptcha is a captcha verification system with an admin dashboard for managing articles, categories, RSS feeds, and redirect URLs.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager (required - enforced by project configuration)

## Installation

```bash
# Install dependencies
pnpm install
```

## Environment Variables

### API Server (`artifacts/api-server`)

Create a `.env` file in `artifacts/api-server/`:

```env
PORT=8020
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_DIR=/uploads/articles
NODE_ENV=production
LOG_LEVEL=info
```

**Required Variables:**
- `PORT` - Server port (required)
- `DATABASE_URL` - PostgreSQL connection string (required)
- `JWT_SECRET` - Secret key for JWT authentication (required)
- `OPENAI_API_KEY` - OpenAI API key for AI features (required)

**Optional Variables:**
- `FTP_PORT` - FTP port (default: 21)
- `FTP_SECURE` - Enable secure FTP (default: false)
- `FTP_REMOTE_DIR` - Remote directory for uploads (default: /uploads/articles)
- `NODE_ENV` - Environment mode (set to `production` to enable cron service)
- `LOG_LEVEL` - Logging level (default: info)

### Frontend (`artifacts/coolcaptcha`)

Create a `.env` file in `artifacts/coolcaptcha/`:

```env
PORT=3000
BASE_PATH=/
VITE_API_URL=http://your-api-server-url
```

**Required Variables:**
- `PORT` - Frontend server port (required)
- `BASE_PATH` - Base path for the application (required)
- `VITE_API_URL` - API server URL (required)

## Database Setup

### Run Migrations

```bash
cd lib/db
pnpm run push
```

This will create the necessary tables in your PostgreSQL database.

## Building for Production

### API Server

```bash
cd artifacts/api-server
pnpm run build
```

The built files will be in `artifacts/api-server/dist/`

### Frontend

```bash
cd artifacts/coolcaptcha
pnpm run build
```

The built files will be in `artifacts/coolcaptcha/dist/public/`

## Running in Production

### API Server

```bash
cd artifacts/api-server
pnpm run start
```

### Frontend

```bash
cd artifacts/coolcaptcha
pnpm run serve
```

## Development Setup

### API Server

```bash
cd artifacts/api-server
pnpm run dev
```

### Frontend

```bash
cd artifacts/coolcaptcha
pnpm run dev
```

## Project Structure

```
├── artifacts/
│   ├── api-server/          # Express.js backend API
│   │   ├── src/
│   │   │   ├── routes/      # API routes
│   │   │   ├── services/    # Business logic
│   │   │   └── lib/         # Utilities
│   │   └── dist/            # Built files
│   └── coolcaptcha/         # React frontend
│       ├── src/
│       │   ├── pages/       # Page components
│       │   ├── lib/         # API clients
│       │   └── components/   # UI components
│       └── dist/            # Built files
├── lib/
│   ├── db/                  # Database schema and migrations
│   ├── api-client-react/    # Shared API client
│   └── api-zod/             # Shared Zod schemas
└── pnpm-workspace.yaml      # Workspace configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Articles
- `GET /api/articles` - List articles (with pagination)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article
- `PATCH /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### RSS Feeds
- `GET /api/feeds` - List RSS feeds
- `POST /api/feeds` - Create RSS feed
- `PATCH /api/feeds/:id` - Update RSS feed
- `DELETE /api/feeds/:id` - Delete RSS feed

### Redirect URLs
- `GET /api/redirect-urls` - List redirect URLs
- `GET /api/redirect-urls/:id` - Get single redirect URL
- `GET /api/redirect-urls/active/random` - Get random active redirect URL
- `POST /api/redirect-urls` - Create redirect URL
- `PATCH /api/redirect-urls/:id` - Update redirect URL
- `DELETE /api/redirect-urls/:id` - Delete redirect URL

### Stats
- `GET /api/stats` - Get dashboard statistics

## Admin Dashboard

The admin dashboard is available at `/admin` and includes:
- Dashboard with statistics
- Articles management
- Categories management
- RSS feeds management
- Redirect URLs management

## Troubleshooting

### Database Connection Issues
Ensure your `DATABASE_URL` is correctly formatted and the PostgreSQL server is running.

### Cron Service Not Starting
Set `NODE_ENV=production` to enable the cron service in the API server.

### Proxy Issues
Ensure `VITE_API_URL` is set correctly in the frontend environment variables.
