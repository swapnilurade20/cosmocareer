# CosmoCareer

A career development and practical learning platform, with a second division for creative and digital services.

## Technology
- Next.js 15, React 19 and TypeScript
- Tailwind CSS 4
- MongoDB Atlas with Mongoose
- Signed HTTP-only session cookies (JOSE)
- Password hashing with bcrypt

## Local development
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `MONGODB_URI` and a unique `AUTH_SECRET` (at least 32 characters).
5. Run `npm run dev`.

## Authentication currently implemented
- Learner self-registration (public registration always creates the student role).
- Email/password login and logout.
- Seven-day HTTP-only session cookie.
- Current-user endpoint.
- Protected dashboard and role-checked admin route.
- First-admin bootstrap script; it does not create duplicate admin accounts.

To create the first administrator, set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (minimum 14 characters) and optionally `ADMIN_NAME` in your local environment, then run `npm run seed:admin`. Never commit real credentials or environment files.

## Project status
This is an early foundation, not a production-ready launch. Email verification, password reset, rate limiting, staff invitation and permission management, audit logging, automated tests, and production security review are still required. The career assessment, course catalogue, LMS, placement workflows, bilingual CMS, service orders and payment integration are planned follow-on modules. Do not accept live payments until server-side order creation, signature and webhook verification, refunds and reconciliation are implemented and tested.
