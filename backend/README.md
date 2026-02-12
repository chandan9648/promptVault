# PromptVault Backend

Express + MongoDB API for managing AI prompts, authentication, community sharing, AI-assisted tagging, and export features.

## Features
- JWT auth (register/login)
- Prompt CRUD with optional AI tag suggestion (Gemini stub)
- Community: publish/unpublish, list public, like/unlike
- Export: JSON and PDF; Notion integration stub to be added

## Requirements
- Node.js 18+
- MongoDB running locally or URI via env

## Setup
1. Copy environment variables and install dependencies

```bash
cp .env.example .env
npm install
npm run dev
```

Visit http://localhost:3000/health

## Environment Variables
- PORT: default 3000
- MONGODB_URI: e.g., mongodb://localhost:27017/promptvault
- JWT_SECRET: long random string
- GEMINI_API_KEY: optional, enables real AI tagging
- NOTION_API_KEY, NOTION_DATABASE_ID: optional (future)
- CLIENT_ORIGIN: CORS origin for frontend

## API Overview
- POST /api/auth/register
- POST /api/auth/login
- GET /api/prompts
- POST /api/prompts
- GET /api/prompts/:id
- PUT /api/prompts/:id
- DELETE /api/prompts/:id
- POST /api/community/:id/publish
- POST /api/community/:id/unpublish
- GET /api/community/public?tag=&q=&sort=trending|new
- POST /api/community/:id/like
- POST /api/community/:id/unlike
- POST /api/export/json { ids: [] }
- POST /api/export/pdf { ids: [] }

## Notes
- For text search, you may add a MongoDB text index on title/description/text:

```js
// In Mongo shell or via migration
// db.prompts.createIndex({ title: 'text', description: 'text', text: 'text' })
```

- Replace the AI tagging stub in `src/services/aiTagging.js` with real Gemini SDK when ready.
