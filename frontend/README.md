# Tastlytics — Restaurant Discovery & Review Platform

## Setup

```bash
npm install
cp .env.example .env      # set REACT_APP_API_URL=http://localhost:8000
npm start                  # http://localhost:3000
```

## Pages
- `/`                  — Explore (search, filter, browse restaurants)
- `/restaurants/:id`   — Restaurant detail + reviews
- `/login`             — Login (User / Owner)
- `/signup`            — Signup (User / Owner)
- `/profile`           — Profile management
- `/preferences`       — AI preference settings
- `/favorites`         — Saved restaurants
- `/history`           — Activity history
- `/assistant`         — AI chat assistant
- `/add-restaurant`    — Add new restaurant
- `/owner/dashboard`   — Owner analytics dashboard

## Backend Endpoints Expected
- POST `/auth/login` → `{ access_token, user }`
- POST `/auth/signup`
- GET  `/restaurants` (params: q, cuisine_type, city, sort)
- GET  `/restaurants/:id`
- GET/POST `/restaurants/:id/reviews`
- GET/POST/DELETE `/users/favorites`
- GET/PUT `/users/preferences`
- GET `/users/history`
- POST `/ai-assistant/chat`
- GET `/owner/dashboard`
