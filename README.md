# Pinnel

Trip planner where users plan trips, add places on a map, build a walking route, and share it. React 18 + Vite + TypeScript frontend.

## Stack

React 18, Vite, TypeScript, React Router v6, Zustand, TanStack Query v5, Axios, Leaflet, AWS Cognito

## Setup

```bash
npm install
```

Create `.env.local` with: `VITE_API_URL`, `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_NOMINATIM_URL`.

## Commands

```bash
npm run dev          # dev server → http://localhost:5173
npm run build        # production build
npm run preview      # preview production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Pages

| Route | Page | Auth |
|---|---|---|
| `/` | Landing | No |
| `/dashboard` | Dashboard — user's trips | Yes |
| `/trip/:id` | Trip Planner — map + cards + route | Yes |
| `/t/:slug` | Public Trip — read-only, clone button | No |

## Backend

- Production: `https://api.pinnel.app`
- Local: `http://localhost:8080/api`

All endpoints require `Authorization: Bearer <jwt>` except `/trips/:id`, `/trips` (search), and `/auth/*`.
