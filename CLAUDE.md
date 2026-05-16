# CLAUDE.md — Pinnel Frontend

## What is Pinnel

Pinnel is a trip planner where users plan trips, add places on a map, build a walking route, and share the trip with others. The core idea: **a trip as a unit of exchange** — create it, share it, someone else clones it in one tap and goes.

Tagline: *"Plan the trip. Fix the chaos. Share the whole thing."*

### Core user flow
1. Pick a city → map loads, place cards appear
2. Add cards (museums, food, viewpoints) → each card drops a pin on the map
3. Hit Finalize → Pinnel reorders stops by proximity, builds the walking route
4. Publish the trip → anyone can clone it in one tap (cards, route, notes included)

### Key features
- **Map + card workspace** with resizable panels
- **Place cards** — photo, rating, price, hours, personal note
- **Route optimization** — reorders stops to minimize walking
- **Daily schedule** builder
- **Mobile view** for use during the trip
- **Trip sharing** — public trip page accessible without registration
- **One-tap duplicate** — clone the whole trip (Trip Remix)
- Authentication via AWS Cognito (Email + Google SSO)

### Coming next (don't build yet, but be aware)
- Photos and articles attached to place cards
- Follow other travelers, curated feeds
- User-created cards for hidden/local places
- Collections: "Best of Milan by locals"
- Reviews tied to real completed trips
- Collaborative trips with friends

---

## Tech Stack

```
React 18
Vite
TypeScript
React Router v6
CSS Modules
Zustand (state management)
React Query (TanStack Query v5) + axios (HTTP requests)
Leaflet + react-leaflet (map)
AWS Cognito (authentication)
```

Package manager: **npm**

---

## AWS Infrastructure (eu-central-1)

| Component | Role |
|---|---|
| EC2 t3.small | Spring Boot backend |
| RDS PostgreSQL | Database |
| ALB | HTTPS termination |
| API Gateway | Routes to EC2 via VPC Link |
| CloudFront + S3 | React SPA hosting |
| Route 53 | DNS + custom domain |
| ACM | SSL certificates |
| Cognito | Auth |
| SES | Email |
| CloudWatch | Logs + metrics |

### Architecture notes
- EC2 + Spring Boot (not Lambda) — avoids cold starts, HikariCP handles DB connection pooling
- ALB → EC2, API Gateway → EC2 via VPC Link
- React SPA: S3 → CloudFront → Route 53

### Backend API
- Base URL (production): `https://api.pinnel.app`
- Base URL (local dev): `http://localhost:8080/api`
- All endpoints require `Authorization: Bearer <jwt>` except public ones
- **Local backend source:** `C:\Projects\pinnel-api` — always check controllers/DTOs there before building API calls on the frontend. Don't assume endpoint shape; read the actual Java code.

Public endpoints (no auth):
- `GET /trips/:id` — view public trips
- `GET /trips` — search trips
- `POST /auth/*` — authentication

---

## Design Language

Pinnel uses a **dark, minimal aesthetic** — clean and focused, not flashy.

### Visual identity
- **Background**: near-black `#0f0f0f`
- **Surface**: dark grey `#181818`, `#222222`
- **Accent**: lime green `#c8ff57` — used for CTAs, active states, numbers
- **Text**: warm off-white `#f0ede8`, muted `#888888`
- **Font**: DM Sans (body), DM Mono (numbers, labels, logo)
- **Borders**: subtle `rgba(255,255,255,0.08)`

### Tone
- Copy is direct and confident: *"Stop winging it."*, *"A trip planner worth keeping"*
- No filler words, no marketing fluff
- Numbers are prominent (clone count, km, walk time, cost)
- Place cards feel like physical index cards — photo, star rating, duration, price, personal note

### Key UI patterns
- **Card workspace** — two-panel layout: cards on left, map on right
- **Pin markers** — lime green diamond shape with number
- **Stats row** — `6.2 km · 1h 20 walk · €15` displayed inline
- **Clone count** — social proof on public trips: `340 Clones`
- **Trip slug** — human-readable URL: `pinnel.app/trips/milan-weekend`

---

## Project Structure

```
src/
├── api/               # axios instance and all API functions
│   ├── client.ts      # axios instance with interceptors
│   ├── trips.ts       # CRUD for trips
│   ├── places.ts      # CRUD for places
│   └── auth.ts        # Cognito requests
├── components/        # reusable components
│   ├── Map/           # Leaflet map wrapper
│   ├── PlaceCard/     # individual place card
│   ├── TripCard/      # trip summary card (dashboard)
│   └── ui/            # Button, Input, Modal, Badge, etc.
├── pages/             # pages (routes)
│   ├── Landing/       # pinnel.app/
│   ├── Dashboard/     # pinnel.app/dashboard
│   ├── TripPlanner/   # pinnel.app/trip/:id
│   └── PublicTrip/    # pinnel.app/t/:slug
├── store/             # Zustand stores
│   ├── authStore.ts   # user, isAuthenticated, token
│   ├── tripStore.ts   # currentTrip, places, isDirty
│   └── mapStore.ts    # center, zoom, selectedPlaceId
├── hooks/             # custom hooks
├── types/             # TypeScript types
├── utils/             # helpers
└── styles/
    └── globals.css    # CSS variables
```

---

## Code Rules

### General

- Always use **TypeScript** — no `any` unless absolutely necessary
- Components must be **functional** with arrow functions only
- One component = one file
- Every component has its own CSS Module: `Component.tsx` + `Component.module.css`
- Component names — **PascalCase**
- Hook names — **camelCase** with `use` prefix: `useTrips.ts`
- Page names — **PascalCase** with `Page` suffix: `DashboardPage.tsx`
- Store file names — **camelCase** with `Store` suffix: `tripStore.ts`
- Only **named exports** — no `export default` for components
- Keep components under 150 lines — split if larger

### TypeScript

```typescript
// ✅ Correct — explicit types
interface Trip {
  id: string
  title: string
  city: string
  country: string
  days: number
  authorId: string
  authorName: string
  cloneCount: number
  mood: TripMood[]
  budgetPerDay: number | null
  currency: string
  isPublic: boolean
  places: Place[]
  createdAt: string
}

interface Place {
  id: string
  tripId: string
  name: string
  address: string
  lat: number
  lng: number
  note: string | null
  cost: number | null
  durationMinutes: number | null
  dayNumber: number
  orderIndex: number
}

type TripMood = 'foodie' | 'budget' | 'luxury' | 'architecture' | 'hidden-gems' | 'slow-travel'

// ✅ Correct — typed component
interface TripCardProps {
  trip: Trip
  onClone: (tripId: string) => void
}

export const TripCard = ({ trip, onClone }: TripCardProps) => {
  return <div>...</div>
}

// ❌ Wrong
const TripCard = (props: any) => { ... }
```

### CSS Modules

```css
/* TripCard.module.css — camelCase class names */
.card { ... }
.cardTitle { ... }
.cardStats { ... }

/* Always use CSS variables */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.cloneCount {
  color: var(--color-accent);
  font-family: var(--font-mono);
}
```

Global CSS variables in `src/styles/globals.css`:

```css
:root {
  /* Colors */
  --color-bg: #0f0f0f;
  --color-surface: #181818;
  --color-surface2: #222222;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border2: rgba(255, 255, 255, 0.14);
  --color-text: #f0ede8;
  --color-text2: #888888;
  --color-text3: #555555;
  --color-accent: #c8ff57;
  --color-accent-dim: rgba(200, 255, 87, 0.12);
  --color-error: #ff5c5c;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  /* Typography */
  --font-sans: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

### Zustand Stores

```typescript
// store/tripStore.ts
import { create } from 'zustand'
import { Trip, Place } from '@/types'

interface TripStore {
  currentTrip: Trip | null
  places: Place[]
  isDirty: boolean
  isLoading: boolean
  setCurrentTrip: (trip: Trip | null) => void
  addPlace: (place: Place) => void
  removePlace: (placeId: string) => void
  updatePlace: (placeId: string, updates: Partial<Place>) => void
  reorderPlaces: (places: Place[]) => void
  clearTrip: () => void
}

export const useTripStore = create<TripStore>((set) => ({
  currentTrip: null,
  places: [],
  isDirty: false,
  isLoading: false,
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addPlace: (place) => set((s) => ({ places: [...s.places, place], isDirty: true })),
  removePlace: (id) => set((s) => ({ places: s.places.filter((p) => p.id !== id), isDirty: true })),
  updatePlace: (id, updates) => set((s) => ({ places: s.places.map((p) => p.id === id ? { ...p, ...updates } : p), isDirty: true })),
  reorderPlaces: (places) => set({ places, isDirty: true }),
  clearTrip: () => set({ currentTrip: null, places: [], isDirty: false }),
}))
```

### React Query + axios

```typescript
// api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) window.location.href = '/'
    return Promise.reject(error)
  }
)
```

```typescript
// api/trips.ts
import { apiClient } from './client'
import { Trip } from '@/types'

export const tripsApi = {
  getTrip: (id: string) =>
    apiClient.get<Trip>(`/trips/${id}`).then((r) => r.data),

  searchTrips: (city: string, mood?: string) =>
    apiClient.get<Trip[]>('/trips', { params: { city, mood } }).then((r) => r.data),

  createTrip: (data: CreateTripDto) =>
    apiClient.post<Trip>('/trips', data).then((r) => r.data),

  cloneTrip: (id: string) =>
    apiClient.post<Trip>(`/trips/${id}/clone`).then((r) => r.data),

  publishTrip: (id: string) =>
    apiClient.patch<Trip>(`/trips/${id}/publish`).then((r) => r.data),
}
```

```typescript
// hooks/useTrips.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripsApi } from '@/api/trips'

export const useTrip = (id: string) =>
  useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripsApi.getTrip(id),
    enabled: !!id,
  })

export const useCloneTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tripsApi.cloneTrip,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  })
}
```

Query key conventions:
- `['trips']` — list of user's trips
- `['trip', id]` — single trip
- `['places', tripId]` — places for a trip
- `['search', city, mood]` — search results

### Routing

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"          element={<LandingPage />} />
      <Route path="/t/:slug"   element={<PublicTripPage />} />   {/* no auth — clone CTA */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/trip/:id"  element={<ProtectedRoute><TripPlannerPage /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
)
```

### Map (Leaflet)

```typescript
// Tile provider — OSM (free, no key)
// URL: https://tile.openstreetmap.org/{z}/{x}/{y}.png

// Place search — Nominatim (free, no key)
// Search: https://nominatim.openstreetmap.org/search?q=...&format=json
// Reverse: https://nominatim.openstreetmap.org/reverse?lat=...&lon=...&format=json

// Fix Leaflet marker icon in Vite — always include this fix
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
})
```

Pin marker style: lime green `#c8ff57` diamond shape, numbered, dark border.

### Authentication (Cognito)

```typescript
// Library: amazon-cognito-identity-js
// Store JWT token in localStorage under key 'token'
// ProtectedRoute checks token on every render
// On 401 from backend — axios interceptor redirects to /
// ACM handles SSL — no manual certificate management
```

---

## Environment Variables

```env
# .env.local — never commit this file
VITE_API_URL=http://localhost:8080/api
VITE_COGNITO_USER_POOL_ID=eu-central-1_xxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_NOMINATIM_URL=https://nominatim.openstreetmap.org
```

All variables must start with `VITE_`.

---

## Workflow

Before starting any feature or fix:
1. Create GitHub issues for all planned tasks (`gh issue create`)
2. Add every issue to the **frontend** project board (`gh project item-add 2 --owner pinnel-org --url <issue-url>`)
3. Create a dedicated branch for the issue: `git checkout -b feat/issue-<number>-short-description`
4. Implement on that branch — one issue per branch, never commit directly to `master`
5. Open a PR when done, link it to the issue

Project boards:
- `frontend` — project ID 2 (`PVT_kwDOELXXNs4BWnWP`)
- `backend` — project ID 3 (`PVT_kwDOELXXNs4BWnW1`)
- `big picture` — project ID 1 (`PVT_kwDOELXXNs4BWnVr`)

---

## What NOT to do

- No `any` in TypeScript
- No business logic directly in components — extract to hooks and stores
- No direct fetch/axios calls in components — only through React Query hooks
- No `useEffect` for data fetching — use React Query
- No inline styles — only CSS Modules
- No components over 150 lines — split into smaller ones
- No missing `key` props on lists
- Never commit `.env.local` to git
- Never hardcode API URLs — always `import.meta.env.VITE_API_URL`
- Never hardcode colors — always use CSS variables

---

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server → http://localhost:5173
npm run build      # production build
npm run preview    # preview production build locally
npm run lint       # run ESLint
npm run type-check # TypeScript check
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.56.0",
    "axios": "^1.7.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "amazon-cognito-identity-js": "^6.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/leaflet": "^1.9.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "eslint": "^9.9.0"
  }
}
```

---

## Pages Overview

| Page | Route | Auth | Description |
|---|---|---|---|
| LandingPage | `/` | No | Product info, request access CTA |
| DashboardPage | `/dashboard` | Yes | User's trips, create new trip |
| TripPlannerPage | `/trip/:id` | Yes | Map + cards + route builder |
| PublicTripPage | `/t/:slug` | No | Read-only trip, Clone button |
