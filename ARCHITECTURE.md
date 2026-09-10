# Architecture

## Request flow

1. The React app on Vite (or a static host) calls the Express API.
2. `POST /api/urls` validates the destination, stores a document in MongoDB, and returns a public short URL built from `BASE_URL`.
3. Visitors open `GET /:shortId`. The API records a visit, then redirects.
4. `GET /api/urls/:shortId/analytics` returns counts and recent visit metadata.

## Backend layout

- `server.js` — process entry, database connection, listen
- `app.js` — Express middleware and routes
- `config/` — environment and MongoDB
- `models/` — Mongoose schemas
- `controllers/` — HTTP handlers
- `routes/api.js` — versioned JSON API
- `middlewares/` — logging, 404, errors, async wrapper

## Frontend layout

- `src/pages/` — Home, Features, Analytics, About, Contact
- `src/components/` — shared shell
- `src/services/api.js` — fetch client using `VITE_API_URL`

## Production notes

- Restrict CORS with `FRONTEND_ORIGIN`.
- Put a reverse proxy in front of the API for TLS.
- Back up the MongoDB volume.
- Monitor `/api/health`.
- Visit totals are stored on `visitCount`; only the latest 50 user-agents are kept.
