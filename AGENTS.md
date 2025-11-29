# AGENTS.md — Frontend (React)

## Goal

Build a **developer-focused personal blog frontend** using **React + TypeScript**, with a look and feel inspired by **Substack** (clean, centered layout, good typography, generous line-height).

The blog is for a SWE and posts are code-heavy. The UI must:

- Render **Markdown articles** with syntax-highlighted code blocks.
- Show **images in the correct order** exactly as in the Markdown.
- Provide a simple **admin console** to write and manage posts, tags, and settings.
- Use **Substack-like layout**: centered content column, readable font sizes, comfortable spacing.

---

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query (React Query) for data fetching
- Tailwind CSS + `@tailwindcss/typography` for a Substack-like article layout
- `react-markdown` + `remark-gfm`
- Syntax highlighting via `rehype-highlight` or Prism integration
- Simple auth: Bearer token stored on client (localStorage is OK for this personal admin app).

Backend base URL: `http://localhost:8080/api`

---

## API Usage (summary)

The frontend calls these main endpoints:

### Public

- `GET /posts`  
  - Query params: `page`, `size`, `tag`, `q`, `sort`  
  - Returns paginated summaries of **published** posts.

- `GET /posts/{slug}`  
  - Returns a single published post with `body` as Markdown string (includes code blocks and images).

- `GET /tags`  
  - Returns all tags.

- `GET /settings/public`  
  - Returns blog title, subtitle, author info, profile image URL, and social links.

### Admin (requires JWT `Authorization: Bearer <token>`)

- Auth:
  - `POST /auth/login` → `{ accessToken, tokenType, expiresIn }`

- Posts:
  - `GET /admin/posts`
  - `GET /admin/posts/{id}`
  - `POST /admin/posts`
  - `PUT /admin/posts/{id}`
  - `DELETE /admin/posts/{id}`
  - `POST /admin/posts/{id}/publish`
  - `POST /admin/posts/{id}/unpublish`

- Tags:
  - `GET /admin/tags`
  - `POST /admin/tags`
  - `PUT /admin/tags/{id}`
  - `DELETE /admin/tags/{id}`

- Settings:
  - `GET /admin/settings`
  - `PUT /admin/settings`

- Uploads:
  - `POST /admin/uploads` (multipart `file` field) → returns JSON with an image `url` to embed in Markdown.

---

## Pages & Routes

Use React Router.

### Public

1. `/` — **Home**
   - Calls `GET /posts`.
   - Displays list of published posts with:
     - Title
     - Excerpt
     - Tags
     - Published date
     - Read time
   - Layout inspired by Substack:
     - Centered column
     - Comfortable line-height and font size
     - Clean, minimal design.

2. `/posts/:slug` — **Post detail**
   - Calls `GET /posts/{slug}`.
   - Renders:
     - Title, tags, published date, read time
     - Markdown body:
       - Code blocks with syntax highlighting, line numbers, and a copy button.
       - Images inline in the correct order.
   - Article styling:
     - Use Tailwind `prose` (and `prose-lg`) to mimic Substack-like readability.
     - Max-width content column, generous margins.

3. `/tags/:slug` — **Posts by tag**
   - Calls `GET /posts?tag={slug}`.
   - Renders a filtered list.

4. `/about`
   - Calls `GET /settings/public`.
   - Displays author bio, photo, and social links.

### Admin

All require a valid access token. If not authenticated, redirect to `/admin/login`.

1. `/admin/login`
   - Form to call `POST /auth/login`.
   - On success, store token and redirect to `/admin/posts`.

2. `/admin/posts`
   - Calls `GET /admin/posts`.
   - Shows list of posts (draft + published) with actions:
     - Create, edit, delete
     - Publish/unpublish.

3. `/admin/posts/new`  
4. `/admin/posts/:id/edit`

   - Markdown editor screen:
     - Fields: title, slug, excerpt, status (draft/published), tag selection, cover image URL, Markdown body.
     - Split layout:
       - Left: Markdown editor (textarea or improved editor).
       - Right: **live preview** using the same Markdown renderer as the public post page.
     - Toolbar actions:
       - Insert fenced code block (e.g. ```ts, ```java).
       - Insert image:
         - Upload image via `POST /admin/uploads`.
         - Insert `![alt text]({url})` at the cursor in the Markdown.

5. `/admin/tags`
   - Manage tags via `/admin/tags` endpoints.

6. `/admin/settings`
   - Manage blog title, subtitle, author bio, profile image URL, and social links.

---

## Markdown & Rendering Requirements

- Backend sends `post.body` as Markdown string.
- Markdown may contain:
  - `![alt](url)` images.
  - Fenced code blocks, e.g.:
    ```md
    ```java
    public class Example {}
    ```
    ```

- Use `ReactMarkdown` with `remark-gfm` and syntax highlighting plugin.
- Implement custom components:
  - `code`:
    - For block code, detect language (e.g. `language-java` class).
    - Render with highlight, line numbers, and optional copy button.
  - `img`:
    - Render as `<figure>` with `<img>` and optional `<figcaption>` (from alt text).
- **Do not reorder content**: render `post.body` as-is so images and code appear in the correct order.

---

## Styling & Layout (Substack-like)

- Use Tailwind for layout and typography.
- Article pages:
  - Centered column with max width (e.g. `max-w-3xl mx-auto`).
  - Use `prose` and `prose-lg` for text.
  - Comfortable line-height and font sizes similar to Substack.
  - Sufficient white space above/below headings and between sections.
- Implement **dark mode** support:
  - Respect `prefers-color-scheme`, plus a manual toggle.
  - Ensure syntax highlighting themes work on both light and dark background.
