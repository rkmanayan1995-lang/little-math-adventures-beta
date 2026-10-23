# Little Math Adventures — GitHub Deployment & Playable Beta Guide

This guide provides the complete, step-by-step process to push your changes to **GitHub** and automatically generate a **playable, installable (PWA) beta test link** that you can share with parents, teachers, and beta testers.

---

## 🏗️ Architecture Overview

The codebase is pre-configured with:
1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`): Automatically runs tests, builds the production bundle, and deploys directly to **GitHub Pages** on every push to `main`.
2. **PWA Compliance** (`public/manifest.json` & `public/sw.js`): Uses relative asset paths (`./`) and standard Web App Manifest protocols so the game can be installed as a native app on iOS, Android, macOS, and Windows.
3. **Relative Base Path** (`vite.config.ts` with `base: './'`): Ensures that the game loads smoothly whether deployed to a GitHub Pages subfolder (`https://<username>.github.io/<repo-name>/`) or a custom root domain.

---

## 📋 Step-by-Step Deployment Process

### Step 1: Pre-Push Local Verification
Before pushing changes, ensure all tests and production builds pass cleanly:

```bash
# 1. Run full test suite (localization, RTL, progression, screen-time energy)
npm test

# 2. Verify TypeScript types and build
npm run build
```

---

### Step 2: Initialize Git & Connect Your GitHub Repository

If you haven't yet connected this codebase to your GitHub account:

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name it `little-math-adventures` (or your chosen name).
   - Set it to **Public** (recommended for free GitHub Pages).
   - Do **NOT** initialize with a README, `.gitignore`, or license (the codebase already has these).
   - Click **Create repository**.

2. **Initialize Git and link your remote in your terminal**:
   ```bash
   # Initialize git repository
   git init

   # Stage all project files (including .github workflows, public PWA assets, and src)
   git add .

   # Commit the latest features (Conspicuous Globe icon, 7 languages, Arabic RTL, etc.)
   git commit -m "feat: conspicuous language switcher, multi-language support, and PWA setup"

   # Rename branch to main
   git branch -M main

   # Add your GitHub repository as the origin remote
   # (Replace with your actual GitHub username and repository name)
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/little-math-adventures.git

   # Push to GitHub
   git push -u origin main
   ```

---

### Step 3: Enable GitHub Pages in Repository Settings (One-Time Setup)

Once your code is pushed to GitHub:

1. Navigate to your repository on GitHub: `https://github.com/<YOUR-GITHUB-USERNAME>/little-math-adventures`.
2. Click on **Settings** (top tab bar with the gear icon).
3. In the left sidebar under *Code and automation*, click **Pages**.
4. Under **Build and deployment** > **Source**:
   - Select **GitHub Actions** from the dropdown menu (do *not* select "Deploy from a branch").
5. That’s it! GitHub will now automatically trigger the workflow defined in `.github/workflows/deploy.yml`.

---

### Step 4: Access Your Live Playable Beta Test Link

1. Go to the **Actions** tab in your GitHub repository.
2. You will see a running workflow named **Deploy Little Math Adventures to GitHub Pages**.
3. Once the workflow turns green (completed in ~45–60 seconds), click on it.
4. Under the **deploy-pages** step or on the right sidebar, you will find your live URL:
   ```text
   https://<YOUR-GITHUB-USERNAME>.github.io/little-math-adventures/
   ```
5. Click the link to open your live playable game!

---

### Step 5: How Testers Install the Beta Game (PWA)

Your deployed URL meets all Progressive Web App (PWA) criteria (HTTPS, service worker, manifest, icons, standalone display):

- **On Android (Chrome / Brave / Edge)**:
  - Open the link.
  - A browser banner will prompt **"Add Little Math Adventures to Home screen"**, or tap the in-game **Install App** button in the header.
  - The game installs like a native app with offline support.
- **On iOS (Safari)**:
  - Open the link in Safari.
  - Tap the **Share** button (box with upward arrow at the bottom).
  - Tap **"Add to Home Screen"**.
  - Tap **Add** in the top right.
- **On Desktop (Chrome / Edge)**:
  - Click the **Install** icon on the right side of the URL bar, or click the in-game header install button.

---

### Step 6: How to Push Future Updates

Whenever you make new changes (such as adding new levels or tweaking animations):

```bash
# 1. Check changed files
git status

# 2. Stage changes
git add .

# 3. Commit with a clear message
git commit -m "feat: added new adventure destination and voice lines"

# 4. Push to main
git push origin main
```

GitHub Actions will automatically run the tests, compile the bundle, and update the live link within 1 minute. No manual server restarts or redeployment steps required!

---

## ⚡ Alternative: Instant Deployment via Vercel or Netlify

If you prefer a custom URL (e.g., `little-math-adventures.vercel.app`) with automatic preview links for pull requests:

1. **Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Import your GitHub repository.
   - Framework preset: **Vite**.
   - Build command: `npm run build`.
   - Output directory: `dist`.
   - Click **Deploy**. Your game will be live in 30 seconds.
2. **Netlify**:
   - Go to [app.netlify.com/start](https://app.netlify.com/start).
   - Connect your GitHub repo.
   - Build command: `npm run build`, Publish directory: `dist`.
   - Click **Deploy Site**.
