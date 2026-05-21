# AI Data Analytics Platform

A modern Next.js foundation for a scalable AI-powered data analytics career platform.

## Architecture

- `app/` — Next.js App Router entrypoints and route placeholders
- `components/` — reusable UI primitives and layout components
- `config/` — platform metadata and navigation definitions
- `lib/` — shared utilities like `cn`
- `styles/` — global Tailwind styles and theme variables
- `types/` — shared TypeScript contracts
- `data/` — content-ready data models and sample metadata
- `public/` — static assets and brand resources

## Installed stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Framer Motion ready for animations
- Responsive mobile-first foundation
- Theme system via `next-themes`

## Next step

1. Run `npm install`
2. Run `npm run dev`
3. Move your existing AI-generated `*.jsx` course modules into the new structure
   - `app/courses/` for course content routes
   - `components/` for reusable blocks and section components
   - `data/` for serialized syllabus content and module metadata
4. Build out authenticated dashboards and career workflows on top of this foundation
