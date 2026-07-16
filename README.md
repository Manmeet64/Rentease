# RentEase

A car rental web app built with React + Vite, backed by a JSON Server API.

## Structure

- `frontend/` — React + Vite app
- `backend/` — JSON Server API (`db.json` + `json-server`)

## Running locally

**Backend** (in one terminal):

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:3000`.

**Frontend** (in another terminal):

```bash
cd frontend
npm install
npm run dev
```

Copy `frontend/.env.example` to `frontend/.env.local` and fill in:

- `VITE_GOOGLE_MAPS_API_KEY` — a Google Maps Platform API key (Maps JavaScript API, Places API, Geocoding API enabled)
- `VITE_API_BASE_URL` — the backend URL (`http://localhost:3000` locally)

## Deployment

- **Backend** → Render, using `backend/render.yaml`. Root directory: `backend`.
- **Frontend** → Vercel, with root directory `frontend`. Set `VITE_GOOGLE_MAPS_API_KEY` and `VITE_API_BASE_URL` (pointing at the deployed Render URL) as environment variables.
