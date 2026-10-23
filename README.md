# StudySesh

A focus space for studying: sign in with Google, run a study timer, keep an eye on the clock, and jot questions to a study assistant.

**Live:** https://himeshahuja.github.io/study-sesh/

## Development

Built with React, TypeScript, Vite and Tailwind, with Firebase for Google sign-in.

Create `.env.local` with your Firebase web app config:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

```sh
npm install
npm run dev
```

## Deployment

Pushes to `main` build the site and publish it to GitHub Pages (`.github/workflows/deploy.yml`). The Firebase values are read from the repository's Actions secrets of the same names.

Started from [a8hok/React-typescript-tailwind-boilerplate](https://github.com/a8hok/React-typescript-tailwind-boilerplate) (MIT).
