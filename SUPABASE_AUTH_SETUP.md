# CosmoCareer Supabase Auth setup

CosmoCareer uses Supabase Auth for credentials and MongoDB for application data.

## Hostinger environment variables

Add these values to the Node.js application's environment:

- `NEXT_PUBLIC_SUPABASE_URL`: Project URL from Supabase Project Settings → API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The project's anon/public API key.
- `SUPABASE_SERVICE_ROLE_KEY`: The service-role secret from Supabase Project Settings → API. Keep this server-only; never prefix it with `NEXT_PUBLIC_`.
- Keep the existing `MONGODB_URI` and `AUTH_SECRET` values. MongoDB is still required for user profiles, roles, permissions, courses, lessons, enrolments, payments and certificates.

## Supabase project

1. Create a Supabase project.
2. In Authentication → Providers, ensure Email is enabled.
3. Copy the Project URL, anon/public key and service-role key into Hostinger.
4. Redeploy the latest `main` branch after setting the variables.

New accounts are created in Supabase Auth and receive a MongoDB user profile. Existing MongoDB accounts are migrated lazily: when a user signs in successfully with their existing password, the server creates or updates their Supabase Auth identity and stores its Supabase user ID in their MongoDB profile. Their MongoDB profile, role, permissions and learning/payment records remain in place.

The application continues to use its existing HTTP-only `cosmocareer_session` cookie after Supabase verifies the credentials. This preserves the current role-based routes and MongoDB-backed authorization.

Do not delete the old MongoDB password hashes or database. A successful first login replaces the old hash with a non-password marker because Supabase becomes the credential authority.
