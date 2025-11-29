# Personal Blog Frontend

A React + TypeScript frontend for a developer-focused personal blog with a Substack-inspired reading experience. It renders Markdown posts with syntax highlighting and provides an admin console for writing and managing content.

## Features
- **Public site**: home feed with search/pagination, post detail pages with highlighted code and copy buttons, tag-filtered listings, and an about page sourced from public settings.
- **Markdown rendering**: uses `react-markdown` with GitHub-flavored Markdown, code highlighting via `rehype-highlight`, line numbers, copy-to-clipboard actions, and inline images rendered in order with optional captions.
- **Admin console**: login flow, post creation/editing with live preview and image uploads, publish/unpublish actions, tag management, and editable site settings.
- **Theming**: light/dark mode toggle with preferences persisted and applied app-wide.

## Tech stack
- React 18 + TypeScript, Vite
- Tailwind CSS with `@tailwindcss/typography`
- React Router for routing
- TanStack Query for data fetching and caching
- `react-markdown`, `remark-gfm`, and `rehype-highlight`
- Axios-based API client targeting the provided OpenAPI spec (`openapi-blog.yaml`)

## Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the dev server**
   ```bash
   npm run dev
   ```
   The app runs on the Vite default port (5173) and expects the backend at `http://localhost:8080/api`.
3. **Build for production**
   ```bash
   npm run build
   ```
4. **Preview the production build**
   ```bash
   npm run preview
   ```

### Running with mock data (no backend required)
Set `VITE_USE_MOCKS=true` to serve the UI with in-memory endpoints powered by `axios-mock-adapter`:

```bash
VITE_USE_MOCKS=true npm run dev
```

Mock credentials for the admin area:
- **Username:** `admin@example.com`
- **Password:** `password`

## Configuration
- API base URL is set to `http://localhost:8080/api` in `src/api/http.ts`. Update it there if your backend runs elsewhere.
- Admin authentication stores the returned access token in `localStorage`; protected routes redirect to the login page when unauthenticated.

## Project layout
- `src/main.tsx`: application entry with routing, theming, and React Query providers.
- `src/routes/`: route definitions and protected route handling.
- `src/components/`: shared UI elements (Markdown renderer, pagination, post cards, theme toggle, etc.).
- `src/pages/`: public pages (Home, PostDetail, TagPosts, About).
- `src/pages/admin/`: admin flows (Login, Posts, PostEditor, Tags, Settings).
- `src/api/`: Axios client plus public/admin endpoint helpers.
- `src/hooks/`: React Query hooks for data access.
- `src/types/api.ts`: shared API DTO types.

## API reference
This frontend is built against the OpenAPI description in `openapi-blog.yaml` (included in the repo). The API client handles public endpoints for posts/tags/settings and authenticated admin endpoints for posts, tags, settings, and uploads.

## Authentication
Call `/auth/login` via the login page to obtain a bearer token; it is persisted in `localStorage` and automatically attached to admin requests. Logging out clears the token and returns users to the login screen.
