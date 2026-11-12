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

## Authentication
- Learner self-registration (public registration always creates the student role).
- Email/password login and logout.
- Seven-day HTTP-only session cookie.
- Current-user endpoint.
- Protected dashboard and role-checked admin route.
- First-admin bootstrap script. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (minimum 14 characters) and optionally `ADMIN_NAME`, then run `npm run seed:admin`.

## Admin foundation
- Admin-only dashboard at `/admin`.
- Account directory with role and active/inactive controls.
- Configurable staff permission assignments.
- Course creation, draft/published state and catalogue management.
- Course curriculum builder at `/admin/courses/[courseId]` for modules and lessons.
- Audit log records for account and course changes.

## LMS foundation
- MongoDB models for course modules, nested lessons, enrolments, lesson progress, assignments and quizzes.
- Admin APIs to create modules and lessons, including preview lessons and video URLs.
- Public published-course learning page at `/courses/[slug]`.
- Student enrolment API for free published courses; paid enrolment is blocked until secure checkout exists.
- Enrolled students can access lesson video URLs; preview lessons are visible to visitors.
- Lesson progress is saved through a server-side API and a lesson is marked complete at 90% watched.
- Student dashboard shows active courses and lesson progress summaries.

## Important implementation status
This is a development foundation, not a production-ready LMS. Assignment and quiz schemas are present, but submission, grading and quiz-attempt APIs/UI are not yet implemented. The video player currently supports direct video URLs; managed video hosting, signed playback, captions and adaptive streaming are not connected. Progress is saved on video time updates (approximately every 10 seconds); validate browser/device behaviour before launch.

Email verification, password reset, rate limiting, staff invitation and scoped permission enforcement, automated tests, build verification, audit review and production security review are still required. Attendance, certificates with QR verification, batch management, payment processing, placement workflows, bilingual CMS and service orders remain future modules. Do not accept live payments until server-side order creation, signature and webhook verification, refunds and reconciliation are implemented and tested.
