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

## LMS assessments and operations milestone
- Quiz authoring API and admin builder with multiple-choice questions, pass marks and attempt limits.
- Learner quiz page; correct answers are withheld until an attempt is submitted.
- Quiz attempt records and automatic scoring.
- Assignment authoring and publication for each course.
- Student written assignment submissions and resubmissions.
- Staff submission review and grading with score validation and feedback.
- Batch creation, course-linked student enrolment and batch roster management.
- Staff attendance marking with present, absent, late and excused states.
- Certificate issue endpoint that checks completion of all course lessons.
- Public certificate verification endpoint and learner-facing verification link.

## Remaining work and release safeguards
- Certificate verification QR images are rendered through a third-party QR image service; use a self-hosted QR generator for a stricter privacy/availability requirement. A downloadable/printable certificate layout is still pending.
- Assignment attachment storage/upload is not integrated; current learner submissions support written work (and the API accepts a URL when submitted directly).
- Batch, attendance, grading and quiz flows need end-to-end testing with real accounts and MongoDB.
- Staff permissions are checked on the new staff routes; map roles to actual course/batch assignments before allowing staff to manage only their own classes.
- Build, lint, automated tests, rate limits, file scanning, and security review must be completed before production.

## Placement CRM milestone
- Admin and authorised placement staff can publish job and internship opportunities.
- Students can browse published openings, submit a resume URL and cover letter, and view their application statuses.
- Candidate pipeline supports applied, screening, interview, offered, hired, rejected and withdrawn stages.
- Staff can add internal notes and record interview scheduling timestamps through the application API.
- Duplicate applications to the same opening are prevented by a database unique index.
- Student application responses omit internal staff notes.
- Admin dashboard and student dashboard now link to the placement workspace.

## Placement release notes
- Resume uploads are not implemented; applicants currently provide a URL. Add private object storage, file-type validation, malware scanning and access-controlled downloads before handling uploaded CVs.
- Employer self-service accounts, automated email/WhatsApp notifications, calendar invitations, interview feedback forms, placement eligibility rules and placement outcome analytics are future work.
- This milestone is code-complete at repository level but has not yet passed a full production build or live MongoDB integration test.
