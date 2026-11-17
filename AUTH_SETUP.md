# Supabase Authentication setup

Daywell uses Supabase Auth for account identity only. Tasks, Projects, Areas, Resources, and settings stay in browser storage under a key scoped to the signed-in Supabase user ID. No task data is uploaded or synchronized.

## 1. Create the Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In **Project Settings → API**, copy the **Project URL** and **publishable key** (the newer `sb_publishable_...` key; older projects may show an `anon` key).
3. In **Authentication → Providers → Email**, enable email sign-in. Decide whether to require email confirmation; when enabled, a new user must follow the confirmation link before logging in.
4. In **Authentication → URL Configuration**, set **Site URL** to the deployed app origin, such as `https://daywell.example.com`. Add Redirect URLs for every origin used, including `http://localhost:5173/**` for local development, and the deployed app URL (for example `https://daywell.example.com/**`). The app redirects OAuth and password recovery to the current origin.

## 2. Configure Google OAuth

1. In Google Cloud Console, create an OAuth client of type **Web application**. Add your development and production app origins under **Authorized JavaScript origins**, such as `http://localhost:5173` and `https://daywell.example.com`.
2. In Supabase **Authentication → Providers → Google**, enable the provider. Copy the **Callback URL** shown there (normally `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Add that exact callback URL to the Google OAuth client’s **Authorized redirect URIs**. Google redirects to Supabase; Supabase then redirects back to Daywell.
4. Paste the Google OAuth **Client ID** and **Client secret** into the Supabase Google provider settings and save. The Google client secret belongs only in Supabase’s dashboard. Never put it in `.env.local`, `VITE_*`, or source control.

See Supabase’s [Google sign-in guide](https://supabase.com/docs/guides/auth/social-sign-in/auth-google) and [redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls) if the dashboard labels change.

## 3. Configure and run Daywell locally

From this project folder:

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` to the Project URL and `VITE_SUPABASE_PUBLISHABLE_KEY` to the project’s publishable key.
3. Install and start the app:

   ```sh
   npm.cmd install
   npm.cmd run dev
   ```

4. Open the URL Vite prints (usually `http://localhost:5173`). The local app redirect URL is `http://localhost:5173/`; allow `http://localhost:5173/**` under Supabase Redirect URLs and add the origin `http://localhost:5173` under Google Authorized JavaScript origins.
5. For deployment, run `npm run build` and publish the contents of `dist/` to an HTTPS static host. Add that exact origin to Supabase’s Site URL/Redirect URLs and Google’s authorized JavaScript origins, then deploy the updated build.

The publishable key is designed for client use; it is visible in the built app. Do not use a Supabase `service_role` or secret key in this project. Authentication access is enforced by Supabase, but tasks remain local and there is no task database or task RLS policy in this app.

## Local data, sign-in, and offline use

- Sign-up, login, Google OAuth, email confirmation, password reset, and changing a password require internet access and a configured Supabase project.
- Supabase’s browser session is persisted locally. After a successful login, the app shell and SDK are served from the PWA cache and that account’s tasks remain accessible offline on the same browser/device. Auth status cannot be verified or refreshed while offline.
- Each account gets a separate local task profile (`daywell.user.<Supabase user ID>.v1`). Signing out clears the local session from the app entry flow but keeps that account’s tasks on this device. Signing in to another account opens its separate profile.
- The pre-account legacy data key (`daywell.v1`) is unchanged. If it exists on this device and the account has no profile yet, Daywell offers an explicit choice to copy it into the account’s local profile or start empty; this does not remove the original or upload it. No existing account data is reclassified or migrated automatically.
- Account identity does not sync tasks between devices. Use **Backup & data → Export backup** and transfer the JSON file yourself. Import replaces the current account’s local profile on that device.
- On a shared device, sign out before handing it to someone else. Browser storage is device-local, not encrypted per account; someone with access to the same browser profile can inspect its local data.
