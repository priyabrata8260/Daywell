# Daywell PWA setup

Daywell is a local-first Progressive Web App. Vite bundles the Supabase client into the app shell, and the service worker caches the built app files so the task manager can reopen offline after an online visit. Authentication still requires an internet connection. See [AUTH_SETUP.md](AUTH_SETUP.md) for Supabase and Google setup.

## Run and deploy

1. Copy `.env.example` to `.env.local` and add the Supabase Project URL and publishable key.
2. Run `npm install` and `npm run dev` for local development.
3. For hosting, run `npm run build`, then publish `dist/` to a stable HTTPS origin. HTTPS is required for service workers and phone installation (localhost is permitted for local development).
4. Open the hosted app online once to cache its files and sign in on that device.

On Android, open the HTTPS app in Chrome and use **More → Install app** or **Add to Home screen**. On iPhone, open it in Safari, tap **Share → Add to Home Screen**, then launch it once while online.

## Offline and local data

Tasks, Projects, Areas, Resources, and settings are stored in browser local storage, separated by Supabase user ID. Authentication session data is persisted locally by Supabase Auth. The app does not upload or sync task data. A network is required for sign-up, login, Google OAuth, confirmation, password reset, and session refresh. Already saved task data and the cached app can remain usable offline after a successful sign-in on that browser/device.

Use **Backup & data → Export backup** to protect or transfer data. Import the JSON backup on another device; import replaces that device/account’s current local profile. Keep backups somewhere separate from the phone.
