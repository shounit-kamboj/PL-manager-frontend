# Collar PL

Web app for powerlifting coaches to manage their athletes, payments, training blocks and competitions in one place.

[Live app](https://www.collarpl.com) · [API repository](https://github.com/shounit-kamboj/PL-manager-backend)

## Features

- **Dashboard** with revenue, retention, overdue payments and upcoming meets at a glance
- **Athletes** with search, sorting and filters by status, age class, federation and qualification level
- **Payments** with paid, unpaid and overdue status, renewing automatically on each athlete's billing cycle
- **Training blocks** showing current, upcoming and past blocks, with update reminders and automatic renewal
- **Meet entries** with a searchable picker over a shared competition calendar, plus custom competitions
- **Accounts** with email verification and password reset
- **Light and dark themes,** and a layout that works on desktop and mobile

## Built with

| Area | Technology |
| --- | --- |
| Framework | React 19, Vite, TypeScript |
| App framework | Refine (data, routing, tables) |
| UI | shadcn/ui on Radix, Tailwind CSS v4 |
| Forms | React Hook Form with Zod validation |
| Auth | Better Auth |
| Hosting | Vercel |

## Engineering notes

- **One source of truth for resources.** Each resource is declared once, and that declaration drives the routes, sidebar, breadcrumbs and page titles.
- **Server-side data handling.** Filtering, sorting and pagination run on the API, so lists stay fast as data grows.
- **Dates that never shift.** Dates are treated as calendar days in the coach's timezone rather than UTC timestamps, so a meet on the 16th always shows as the 16th.
- **Accessible, consistent UI.** Built on Radix primitives through shadcn/ui, with keyboard support and labelled controls.

## Project structure

```
src/
├── App.tsx               Resources, routes and providers
├── pages/                One folder per resource, plus the auth pages
├── components/ui/        shadcn/ui components
├── components/refine-ui/ Layout, views, sidebar and breadcrumbs
├── providers/            REST data provider
└── lib/                  Auth client, date utilities, form schemas
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm start` | Serve the production build |
| `npm test` | Run the test suite (Vitest) |