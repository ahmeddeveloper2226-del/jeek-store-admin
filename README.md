# Jeek Store — Admin Panel (separate site)

Standalone admin console (React + Vite + Firebase Auth + Firestore). It is a different site from the
customer store and nothing in the store links to it. Share its URL only with staff.

## 1. Firebase (use the SAME project as the store)
1. Firestore → **Rules** → paste `firestore.rules` → Publish.
2. Build → **Authentication** → Get started → enable **Email/Password**.
3. Authentication → Users → **Add user**: email `admin@jeek-store.com`, password `123456`.
   Do this immediately after enabling Email/Password. (To use another email, change it in
   `firestore.rules` and in the `VITE_ADMIN_EMAIL` setting too.)
4. Authentication → Settings → User actions → untick **Enable create (sign-up)** if shown.
5. Authentication → Settings → Authorized domains → add your admin site domain
   (e.g. `youruser.github.io`).

## 2. Run locally
```bash
cp .env.example .env     # same Firebase values as the store (+ VITE_ADMIN_EMAIL if changed)
npm install
npm run dev
```
Sign in with the password `123456`. On the first sign-in the default catalog is published automatically.

## 3. Deploy on GitHub Pages
Same steps as the store, in a **separate repository**: Pages source = GitHub Actions, add the
`VITE_FIREBASE_*` secrets (and `VITE_ADMIN_EMAIL` only if you changed it), push to `main`.

The password is stored only in Firebase Authentication — never in the code.
**123456 is a weak password**: change it in Firebase → Authentication → Users when you go live.
