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

## Employer portal milestone
- Employer accounts are provisioned by an administrator; public signup remains student-only.
- Employer company profiles require administrator verification before job creation.
- Employer portal at `/employer` supports company profile submission, vacancy drafting and applicant review.
- Employer job listings are owner-scoped; employers can only view their own vacancies and applicants.
- Employer candidate updates support screening, interview, offer, hire and rejection stages, with interview timestamps and internal notes.
- Admin employer review at `/admin/employers` approves or rejects company profiles.
- Admin placement CRM includes a job review queue and publication controls. Employer-created jobs remain drafts until staff approval.
- Employer role is assignable by administrators from the user management screen.

## Employer release safeguards
- Employer accounts are not self-registered; an administrator must assign the employer role to an existing account.
- Employer job publication requires both an approved company profile and a separate admin publication action.
- Employer ownership checks are enforced on vacancy and candidate endpoints.
- Automated email/WhatsApp alerts, calendar invitations, employer identity/KYC checks, resume file upload/storage, and legal/compliance workflows are not yet integrated.
- Full build, automated tests and live MongoDB end-to-end testing are still required before production.


## Counsellor CRM milestone
- Counsellor workspace at `/counsellor` for capturing prospective student enquiries.
- Leads store contact details, enquiry source, course interest, pipeline stage, assigned counsellor and next follow-up date.
- Counsellors see only leads assigned to their own account; administrators can review all leads through the same workspace.
- Counsellors can update the admission pipeline and append timestamped counselling notes.
- API access requires an active staff account with the `students.manage` permission; the admin role is permitted.
- This is an initial internal CRM: lead import, reassignment UI, reminders, email/WhatsApp notifications, appointment booking, consent workflows and analytics remain future work.
- Validate the TypeScript build, permissions and real MongoDB workflows before production use.


## Notifications milestone
- Authenticated notification inbox at `/notifications`, with unread counts and mark-read / mark-all-read actions.
- MongoDB notification records are private to the receiving account.
- Students receive an in-app notification when a placement application is submitted.
- Students receive an in-app notification when an employer changes their application stage.
- Email delivery uses the Resend API when `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured; in-app notifications continue when email is not configured.
- Set `NEXT_PUBLIC_APP_URL` to the deployed site URL so email links point to the correct website.
- Email delivery failures are logged and do not block application submission or employer updates.
- WhatsApp delivery via MSG91 is not yet connected; the existing MSG91 key alone is insufficient without approved WhatsApp sender/template configuration and verified recipient consent.
- Configure and verify the sending domain in Resend before enabling production email. Add rate limits, delivery logs, unsubscribe/preferences and end-to-end tests before launch.


## Digital services CRM milestone
- Public service catalogue at `/services`; only published services are shown.
- Admin catalogue management at `/admin/services` supports service descriptions, categories, deliverables, turnaround estimates, prices and advance amounts.
- Signed-in customers can submit a project brief, contact phone, preferred deadline and reference URLs.
- Customer order history at `/service-orders` is scoped to the signed-in account and excludes internal staff notes and payment reconciliation values.
- Admin/staff CRM at `/admin/service-orders` supports the order pipeline, team assignment, internal notes and payment reconciliation records.
- Order status updates create in-app notifications and optional Resend email notifications.
- Service-management APIs require the `services.manage` permission; admin role is allowed.

## Digital services payment and launch safeguards
- The request form does not collect money. Razorpay checkout, server-side order creation, signature verification and webhook reconciliation are not implemented in this milestone.
- Payment values in the CRM are manual reconciliation records only; verify against the payment provider before recording them as received.
- Reference materials are submitted as URLs; private file uploads, virus scanning and secure object storage are not integrated.
- Validate the full TypeScript build, permission boundaries, MongoDB workflows, notification delivery and customer/admin journeys before production launch.
