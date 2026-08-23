# CineScope

<div align="center">
  <img src="./frontend/src/assets/logo.svg" alt="CineScope logo" width="100" />
  <h3>Experience cinema like never before.</h3>
  <p>A full-stack movie and TV discovery platform powered by TMDB.</p>
</div>

## Overview

CineScope helps users discover movies and TV shows, inspect detailed metadata, search across titles, and maintain a personal favourites list. The application includes authentication, onboarding preferences, profile management, responsive light/dark themes, and a backend API that protects credentials and normalizes TMDB responses.

## Features

- Trending home dashboard with Hollywood, Bollywood, and TV sections
- Movie and TV search with paginated results
- Detailed movie and TV pages with posters, backdrops, ratings, genres, trailers, cast, creators/directors, production details, seasons, budget, and revenue where available
- Email registration with OTP verification
- Email/password login and Google authentication
- Access-token and refresh-token authentication using HTTP-only cookies
- Automatic access-token refresh in the frontend API client
- Password reset by email
- Profile editing, avatar upload, and genre-preference onboarding
- Authenticated favourites synchronization backed by MongoDB
- Redis caching for dashboard data
- Responsive UI with light/dark mode, animations, loading states, and toast notifications

## Tech stack

### Frontend

- React 19 and React Router
- Vite
- Tailwind CSS and DaisyUI
- Zustand for authentication, theme, and favourites state
- Axios and TanStack Query
- Motion, Recharts, Lucide React, React Toastify, and Lottie

### Backend

- Node.js with Express 5
- MongoDB with Mongoose
- Redis/Upstash Redis for caching
- JWT, bcrypt, cookie-parser, and CORS
- TMDB API for movie and TV data
- Brevo for transactional email
- Google OAuth and Cloudinary image uploads

## Project structure

```text
CineScope/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Authentication, dashboard, movie, and favourite logic
│   │   ├── db/                # MongoDB and Redis connections
│   │   ├── middleware/        # Authentication and request validation
│   │   ├── models/            # User and favourites schemas
│   │   ├── routes/            # Express API routes
│   │   ├── utils/             # API responses, errors, mail, and cookie helpers
│   │   └── index.js           # Backend entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── Pages/             # Application screens and detail views
│   │   ├── components/        # Shared UI, cards, navigation, and skeletons
│   │   ├── hooks/             # Reusable hooks such as image upload
│   │   ├── lib/               # API client and static data
│   │   └── store/             # Zustand stores
│   └── package.json
├── package.json               # Root scripts for running both apps
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database
- Redis-compatible database (Upstash Redis is supported)
- TMDB API key
- Google OAuth credentials if Google sign-in is enabled
- Brevo credentials for OTP and password-reset email
- Cloudinary upload preset and cloud name for avatar uploads

## Installation

```bash
git clone https://github.com/Arslan950/CineScope.git
cd CineScope

npm install
npm install --prefix backend
npm install --prefix frontend
```

## Environment variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CORS=http://localhost:5174
FRONTEND_URL=http://localhost:5174

MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
TMDB_API_KEY=your_tmdb_api_key

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

OTP_SERVER_SECRET=your_otp_signing_secret
BREVO_API_KEY=your_brevo_api_key
MAIL_FROM=verified_sender@example.com
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUD_PRESET=your_unsigned_upload_preset
```

Never commit either `.env` file or expose backend secrets in frontend variables.

## Running locally

Run both services from the repository root:

```bash
npm run dev
```

Or run them independently:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

The frontend runs at `http://localhost:5174` and proxies `/api` requests to the backend configured by `VITE_BACKEND_URL`. The backend listens on the port configured by `PORT`.

## API reference

All protected endpoints require the access-token cookie. Responses use a consistent `{ success, message, data }` shape.

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/healthcheck/` | Check API availability | Public |
| POST | `/api/auth/register` | Register and send OTP | Public |
| POST | `/api/auth/verifyOTP` | Verify registration OTP | Public |
| POST | `/api/auth/login` | Log in with email and password | Public |
| POST | `/api/auth/google` | Authenticate with Google | Public |
| POST | `/api/auth/refresh-accessToken` | Refresh the access token | Public |
| POST | `/api/auth/forget-password` | Request a password-reset email | Public |
| POST | `/api/auth/reset-password/:resetPasswordToken` | Set a new password | Public |
| POST | `/api/auth/logout` | Log out the current user | Protected |
| GET | `/api/auth/userInfo` | Get the current user | Protected |
| PATCH | `/api/auth/editInfo` | Update profile and preferences | Protected |
| DELETE | `/api/auth/delete-account` | Delete the current account | Protected |
| GET | `/api/get-dashboard-data/` | Get cached trending dashboard data | Protected |
| POST | `/api/explore/search-results` | Search movies and TV shows | Protected |
| POST | `/api/explore/movie-result` | Get movie details | Protected |
| POST | `/api/explore/tv-result` | Get TV details | Protected |
| GET | `/api/favourites/get-list` | Get the user’s favourites | Protected |
| PUT | `/api/favourites/sync` | Sync favourites changes | Protected |

## Frontend routes

- `/` - Landing page
- `/login`, `/signup` - Authentication
- `/forgetPassword`, `/resetPassword/:resetPasswordToken` - Password recovery
- `/onBoarding` - Avatar and genre preferences
- `/home` - Trending dashboard
- `/explore` - Search and discovery
- `/explore/movie` and `/explore/tv` - Detailed media views
- `/favorites` - Saved favourites
- `/profile` - Account settings

## Data and attribution

Movie and TV metadata, ratings, imagery, and trailers are retrieved from [TMDB](https://www.themoviedb.org/). CineScope is not endorsed or certified by TMDB. Cloudinary is used for profile image uploads.

## Contact

- Email: arslan48950@gmail.com
- Project: [github.com/Arslan950/CineScope](https://github.com/Arslan950/CineScope)
- Demo: [cinescope-liart-eight.vercel.app](https://cinescope-25sj.onrender.com/)
