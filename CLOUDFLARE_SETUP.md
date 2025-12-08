# Setting up Cloudflare (Domain & R2 Storage)

Follow these exact steps to get your domain and file storage ready.

## Part 1: Buy Your Domain (Cheapest Option)
1.  **Log in** to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **"Domain Registration"** > **"Register Domains"**.
3.  Search for your domain (e.g., `creatorsedge.com`).
4.  Purchase it. (It should be ~$10.44/year).

---

## Part 2: Create R2 Storage Bucket (for Videos)
1.  In the Cloudflare Dashboard, go to **"R2"** on the left sidebar.
2.  If this is your first time, you may need to enter a payment method (You generally won't be charged unless you have millions of users).
3.  Click **"Create Bucket"**.
4.  **Bucket Name:** `creators-edge-assets` (or similar).
5.  **Location:** `Automatic` (Recommended).
6.  Click **"Create Bucket"**.

---

## Part 3: Get Your API Keys
1.  Go to the main **R2** page again.
2.  On the right side, look for **"Manage R2 API Tokens"**.
3.  Click **"Create API Token"**.
4.  **Token Name:** `creators-edge-backend`.
5.  **Permissions:** Select **"Object Read & Write"** (Use the template if available).
6.  **TTL (Time to Live):** Set to `Forever`.
7.  Click **"Create API Token"**.
8.  **IMPORTANT:** Copy these values immediately. You will **NOT** see them again.
    *   `Access Key ID`
    *   `Secret Access Key`

---

## Part 4: Get Your Account ID & Public Domain
1.  Go back to your **Bucket** (`creators-edge-assets`).
2.  **Account ID:** You should see your "Account ID" on the right sidebar of the R2 Overview page. Copy it.
3.  **Public Access (Domain):**
    *   Go to the **"Settings"** tab of your bucket.
    *   Scroll down to **"R2.dev subdomain"**.
    *   Click **"Allow Access"**.
    *   Copy the URL provided (e.g., `pub-xxxxxxxxxxxx.r2.dev`).
    *   *(Optional but recommended)*: If you want a pretty URL like `assets.creatorsedge.com`, you can set that up under "Custom Domains" right above "R2.dev subdomain".

---

## Part 5: Add Keys to Railway
Go to your Railway Project -> Variables, and add these EXACT names:

| Variable Name | Value |
| :--- | :--- |
| `R2_ACCOUNT_ID` | (From Part 4) |
| `R2_ACCESS_KEY_ID` | (From Part 3) |
| `R2_SECRET_ACCESS_KEY` | (From Part 3) |
| `R2_BUCKET_NAME` | `creators-edge-assets` (Your bucket name) |
| `R2_PUBLIC_DOMAIN` | `pub-xxxxxxxx.r2.dev` (From Part 4 - **Exclude** `https://`) |

---

**Done!** Your app will now upload videos directly to Cloudflare and bypass all Railway limits.
