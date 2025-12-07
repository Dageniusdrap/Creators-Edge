---
description: How to get a free YouTube Data API Key from Google Cloud
---

# Getting a YouTube Data API Key

To enable the "Viral Script Generator" and other social analysis features in Creators Edge, you need a free API Key from Google.

### Step 1: Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. Click the **Project dropdown** (top left) and select **"New Project"**.
4. Name it `CreatorsEdge-Dev` and click **Create**.

### Step 2: Enable the YouTube API
1. In the sidebar, go to **APIs & Services > Library**.
2. Search for `"YouTube Data API v3"`.
3. Click on the result and press the blue **Enable** button.

### Step 3: Create Credentials
1. After enabling, click **"Create Credentials"** (top right) or go to **APIs & Services > Credentials** in the sidebar.
2. Click **+ CREATE CREDENTIALS** and select **API Key**.
3. Your new API key will appear (e.g., `AIzaSyD...`). **Copy this key.**

### Step 4: Configure Your App
1. Open the `.env` file in your project root.
2. Add the following line:
   ```env
   YOUTUBE_API_KEY=your_copied_key_here
   ```
3. Save the file.
4. Restart your development server (`Ctrl+C` then `npm run dev`) to load the new key.

### (Optional) Step 5: Security Best Practice
To prevent others from using your quota:
1. On the Credentials page, click the **Edit icon** (pencil) next to your API Key.
2. Under **API restrictions**, select **Restrict key**.
3. In the dropdown, check **YouTube Data API v3**.
4. Click **Save**.
