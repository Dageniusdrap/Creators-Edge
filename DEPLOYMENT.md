# Deployment Guide for Creators Edge AI

This guide covers how to deploy the application. The recommended architecture is a **Split Deployment**:
1.  **Backend + Database** on [Railway](https://railway.app)
2.  **Frontend** on [Vercel](https://vercel.com)

---

## 🚀 Part 1: Deploy Backend to Railway

Railway is excellent for hosting Node.js servers and PostgreSQL databases with zero configuration.

### 1. Prepare Railway Project
1.  Go to [Railway](https://railway.app) and sign up/login.
2.  Click **"New Project"** -> **"Empty Project"**.
3.  Click **"Add Service"** -> **"Database"** -> **"PostgreSQL"**.
    *   This creates your production database.
    *   Once created, click on the **Postgres** service card → **Variables**.
    *   Copy the `DATABASE_URL`. You will need this.

### 2. Deploy Server Code
1.  Connect your GitHub repository to Railway (or initialize one if you haven't).
2.  In your Railway project, click **"Add Service"** -> **"GitHub Repo"** -> Select your repo.
3.  **Configuring the Service:**
    *   Click on the new service card (creators-edge-server).
    *   Go to **Settings** -> **Root Directory**. Set this to: `/server`.
    *   This tells Railway to only look at the backend folder.
    *   The `start` command should automatically be detected from `package.json` (`node dist/index.js`).

### 3. Environment Variables (Backend)
Go to the **Variables** tab of your Server service and add the following keys. **Use your real production keys**:

| Variable | Value / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `3001` (or let Railway handle it, standard is usually auto-assigned) |
| `DATABASE_URL` | Check the "Shared Variables" or paste the URL from your Postgres service. |
| `JWT_SECRET` | A long, random string (e.g., generate with `openssl rand -hex 32`). |
| `SESSION_SECRET` | Another long, random string. |
| `FRONTEND_URL` | Your Vercel URL (e.g., `https://creators-edge.vercel.app`). *Fill this after deploying frontend.* |
| `BACKEND_URL` | Your Railway Service URL (e.g., `https://creators-edge-server.up.railway.app`). You can find this in Settings -> Networking after generation. |
| `GEMINI_API_KEY` | Your Google Gemini API Key. |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console. |
| `GITHUB_CLIENT_ID` | From GitHub Developer Settings. |
| `GITHUB_CLIENT_SECRET` | From GitHub Developer Settings. |
| `LEMONSQUEEZY_API_KEY` | Your Lemon Squeezy API Key. |
| `LEMONSQUEEZY_STORE_ID`| Your Store ID. |
| `FLW_PUBLIC_KEY` | Flutterwave Public Key. |
| `FLW_SECRET_KEY` | Flutterwave Secret Key. |

**Important:** For OAuth (Google/GitHub), update your "Authorized Redirect URIs" in their respective consoles to match your production backend URL:
*   `https://[YOUR-RAILWAY-URL]/api/auth/google/callback`
*   `https://[YOUR-RAILWAY-URL]/api/auth/github/callback`

---

## ⚡ Part 2: Deploy Frontend to Vercel

Vercel is optimized for React/Vite apps.

### 1. Create Project
1.  Go to [Vercel](https://vercel.com) and sign up/login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.

### 2. Configure Build
1.  **Framework Preset:** Vite (should be detected automatically).
2.  **Root Directory:** `./` (default).
3.  **Build Command:** `npm run build` (default).
4.  **Output Directory:** `dist` (default).

### 3. Environment Variables (Frontend)
Does the frontend need env vars? **No**, because we removed all secrets from the client!
*   The `apiClient.ts` automatically sends requests to `/api/...`.
*   We need to configure Vercel to **Rewrite** these `/api` requests to your Railway Backend.

### 4. Connect Frontend to Backend (The rewrite)
I have created a `vercel.json` file in your root directory.
1.  Open `vercel.json`.
2.  **Update the destination URL**:
    ```json
    "destination": "https://[YOUR-RAILWAY-APP-NAME].railway.app/api/$1"
    ```
    Replace the placeholder with your **actual Railway Server URL**.
3.  Push this change to GitHub.

### 5. Deploy
1.  Click **Deploy** on Vercel.
2.  Once live, copy the final Vercel URL (e.g., `https://creators-edge.vercel.app`).
3.  **Go back to Railway** -> Server Service -> Variables.
4.  Update `FRONTEND_URL` to equal your new Vercel URL.
5.  Railway will redeploy automatically.

---

## ✅ Checklist for Success
1.  **Builds Passing:** Ensure `npm run build` works locally for both frontend and backend.
2.  **Database:** Ensure Railway Postgres is connected via `DATABASE_URL`.
3.  **Secrets:** Double-check all API keys in Railway Variables.
4.  **Redirects:** Verify Google/GitHub Console Redirect URIs match the *Railway* URL.
5.  **Proxy:** Verify `vercel.json` points to the *Railway* URL.

Your app is now production-ready! 🚀
