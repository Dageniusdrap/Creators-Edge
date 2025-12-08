# 🚀 Simple Deployment Guide

We are going to deploy your app in 3 simple phases.
**Railway** = Backend (Brain & Database).
**Vercel** = Frontend (Face of the app).

---

## 🚂 Part 1: Railway (The Backend)

### Step 1: Start a New Project
1.  Go to your **[Dashboard](https://railway.com/dashboard)**. 
    *(If you are on an account page, look for the railway icon in the top left corner)*.
2.  Click the big **"New Project"** button.
3.  Select **"Empty Project"**.

### Step 2: Add the Database
1.  Click **"Create"** (or "Add Service").
2.  Choose **"Database"** ➝ **"PostgreSQL"**.
3.  A "Postgres" card will appear on your screen. Click it.
4.  Click the **"Variables"** tab.
5.  **Copy** the `DATABASE_URL`. (Save this for later!)

### Step 3: Add Your Code
1.  Close the Postgres card (click the X).
2.  Click **"Create"** (or "Add Service") again.
3.  Choose **"GitHub Repo"** ➝ select `creators-edge-ai`.
4.  **⚡ Important:** A new card will appear for your repo. **Click it immediately**.

### Step 4: Point to the Server Folder (Critical!)
1.  Inside your repo's card, click the **"Settings"** tab.
2.  Scroll down to **"Root Directory"**.
3.  Type: `/server`
4.  Press **Enter** or Save.
    *(This fixes the build error by telling Railway the backend code is hidden in the server folder).*

### Step 5: Add Your Secrets (Variables)
1.  Click the **"Variables"** tab.
2.  Add the following keys (click "New Variable" for each):
    *   `DATABASE_URL` ➝ Paste the value you copied in Step 2.
    *   `NODE_ENV` ➝ `production`
    *   `PORT` ➝ `3000`
    *   `JWT_SECRET` ➝ (Type any random password)
    *   `SESSION_SECRET` ➝ (Type any random password)
    *   `GEMINI_API_KEY` ➝ (Your Google credentials)
    *   `GOOGLE_CLIENT_ID` ➝ (Your Google ID)
    *   `GOOGLE_CLIENT_SECRET` ➝ (Your Google Secret)
    *   `GITHUB_CLIENT_ID` ➝ (Your GitHub ID)
    *   `GITHUB_CLIENT_SECRET` ➝ (Your GitHub Secret)
    *   `LEMONSQUEEZY_API_KEY` ➝ (Your Lemon Key)
    *   `LEMONSQUEEZY_STORE_ID` ➝ (Your Store ID)
    *   `FLW_PUBLIC_KEY` ➝ (Flutterwave Public)
    *   `FLW_SECRET_KEY` ➝ (Flutterwave Secret)

### Step 6: Get Your Live URL
1.  Click the **"Settings"** tab.
2.  Scroll to **"Networking"**.
3.  Click **"Generate Domain"**.
4.  **Copy this link** (e.g., `xxx.up.railway.app`). This is your **Backend URL**.
5.  Go back to **"Variables"** and add one last one:
    *   `BACKEND_URL` ➝ Paste your new link.

---

## ▲ Part 2: Vercel (The Frontend)

### Step 1: Deploy
1.  Go to **[Vercel.com](https://vercel.com/new)**.
2.  Find `creators-edge-ai` and click **"Import"**.
3.  Click **"Deploy"**. (Everything else is already perfect).
4.  Wait for the confetti! 🎉
5.  **Copy your website URL** (e.g., `creators-edge.vercel.app`).

---

## 🔗 Part 3: Connect Them (The Bridge)

### Step 1: Tell Railway about the Website
1.  Go back to **Railway** ➝ Click your Repo Card ➝ **"Variables"**.
2.  Add:
    *   `FRONTEND_URL` ➝ Paste your Vercel website link.
    *(Railway will restart automatically. This allows people to log in from your site).*

### Step 2: Tell the Website about Railway
1.  Open the file `vercel.json` **on your computer**.
2.  Find: `"destination": "https://creators-edge-production.up.railway.app/api/$1"`
3.  Replace the URL with your **Real Backend URL** from Railway.
    *(Keep the `/api/$1` at the end!)*.
### 4. Storage (Cloudflare R2) - **REQUIRED for Video Analysis**
To support large video uploads (bypassing Railway's 50MB limit), you must set up Cloudflare R2:
- `R2_ACCOUNT_ID`: Your Cloudflare Account ID.
- `R2_ACCESS_KEY_ID`: R2 Access Key ID.
- `R2_SECRET_ACCESS_KEY`: R2 Secret Access Key.
- `R2_BUCKET_NAME`: The name of your R2 bucket.
- `R2_PUBLIC_DOMAIN`: The public domain for your bucket (e.g., `pub-xxxxxxxx.r2.dev` or `assets.yourdomain.com`).

### 5. Deployment
1. **Push to GitHub**:
    ```bash
    git add vercel.json
    git commit -m "Link frontend to backend"
    git push origin main
    ```

### Step 3: Update Google/GitHub
1.  Go to your Google/GitHub Developer dashboards.
2.  Update "Redirect URIs" to:
    *   `https://<YOUR-BACKEND-URL>/api/auth/google/callback`
    *   `https://<YOUR-BACKEND-URL>/api/auth/github/callback`

**You are done!** 🚀
