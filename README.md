# ShortIt

ShortIt is a production-ready URL shortener. Create clean public links, optionally choose a custom alias, and inspect click analytics.

## Pages

- **Home** — shorten a URL
- **Features** — product capabilities and how it works
- **Analytics** — look up click history by short id
- **About** — stack and project background
- **Contact** — message form stored in MongoDB

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, Bootstrap 5 |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Config | `.env` files for API and web app |

## Repository layout

```text
ShortIt/
  Backend/          Express API
  frontend/         React SPA
  docs/             Architecture notes
  docker-compose.yml
```

## Prerequisites

- Node.js 18 or newer
- MongoDB 6+ running locally, or Docker

## Environment variables

Copy the example files before starting:

```bash
copy Backend\.env.example Backend\.env
copy frontend\.env.example frontend\.env
```

### API (`Backend/.env`)

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development` or `production` |
| `PORT` | API port (default `8000`) |
| `BASE_URL` | Public origin used to build short links |
| `MONGO_URL` | MongoDB connection string |
| `FRONTEND_ORIGIN` | Comma-separated CORS origins |

### Frontend (`frontend/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the Express API |

Never commit real `.env` files. Keep secrets in your host or secret manager.

## Local development

Install dependencies:

```bash
npm install
npm run setup
```

Start MongoDB, then run both apps:

```bash
npm run dev
```

- Web app: https://shortit-url.netlify.app
- API: https://shortit-lluo.onrender.com
- Health: https://shortit-lluo.onrender.com/api/health

Or start them separately:

```bash
npm run dev:api
npm run dev:web
```

## API overview

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/urls` | Create a short URL `{ url, customAlias? }` |
| `GET` | `/api/urls` | List recent public links |
| `GET` | `/api/urls/:shortId/analytics` | Click analytics |
| `POST` | `/api/contact` | Store a contact message |
| `GET` | `/api/health` | Liveness and database status |
| `GET` | `/:shortId` | Redirect to the original URL |

## Production build

```bash
npm run build
```

Serve `frontend/dist` with any static host. Point `VITE_API_URL` at the public API origin before building. Set `BASE_URL` and `FRONTEND_ORIGIN` on the API to match that deployment.

## Docker

```bash
docker compose up --build
```

MongoDB, the API, and a static frontend container start together.

## Tests and lint

```bash
npm test
npm run lint
```

## License

MIT. See [LICENSE](LICENSE).
