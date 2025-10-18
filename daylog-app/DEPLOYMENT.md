# Deployment Guide

## Backend - Railway

### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### 2. Deploy Backend
1. Click "Deploy from GitHub repo"
2. Select your `daylog-app` repository
3. Railway will detect it's a monorepo
4. Set **Root Directory** to `backend`
5. Click "Deploy"

### 3. Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a database and auto-populate `DATABASE_URL`

### 4. Set Environment Variables
In Railway project settings → Variables, add:

```
BETTER_AUTH_SECRET=<generate a random 32+ character string>
BOT_API_KEY=<generate a random 32+ character string>
TELEGRAM_BOT_TOKEN=<your bot token from @BotFather>
FRONTEND_URL=<will add after deploying frontend>
BETTER_AUTH_URL=<your-railway-backend-url>
API_URL=<your-railway-backend-url>
```

**To generate random secrets:**
```bash
openssl rand -base64 32
```

### 5. Get Your Backend URL
- After deployment, Railway gives you a URL like: `https://your-app.up.railway.app`
- Copy this URL - you'll need it for frontend

### 6. Run Database Migrations
Railway doesn't run migrations automatically, so you need to do this manually:

**Option A: Run locally pointing to Railway DB**
1. Copy the `DATABASE_URL` from Railway
2. Create a `.env.production` file in backend:
```
DATABASE_URL=<railway-database-url>
```
3. Run: `DATABASE_URL=<railway-db-url> bun run db:push`

**Option B: Use Railway CLI**
```bash
npm i -g @railway/cli
railway login
railway link
railway run bun run db:push
```

---

## Frontend - Vercel

### 1. Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"

### 2. Deploy Frontend
1. Import your `daylog-app` repository
2. Vercel detects monorepo
3. Set **Root Directory** to `frontend`
4. Set **Framework Preset** to `Vite`
5. Click "Deploy"

### 3. Set Environment Variables
In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://your-app.up.railway.app
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

### 4. Redeploy
After adding environment variables:
1. Go to Deployments tab
2. Click the three dots on latest deployment
3. Click "Redeploy"

---

## Final Steps

### 1. Update Backend FRONTEND_URL
1. Go back to Railway
2. Add environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```
3. Railway will auto-redeploy

### 2. Set Telegram Bot Webhook (if needed in future)
Currently using polling, but if you switch to webhooks:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-app.up.railway.app/api/bot/webhook"
```

---

## Costs

**Railway Free Tier:**
- $5 of usage per month
- More than enough for a demo project
- Automatically sleeps when inactive

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Perfect for demos

**Total Cost: $0** for your class demo! 🎉

---

## Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Make sure all environment variables are set
- Verify DATABASE_URL is set by Railway's PostgreSQL addon

### Frontend can't connect to backend
- Check CORS settings in backend (should allow your Vercel URL)
- Verify VITE_API_URL is correct in Vercel
- Check browser console for errors

### Database migrations not applied
- Run `bun run db:push` with Railway's DATABASE_URL
- Or use Railway CLI to run migrations

### Telegram bot not responding
- Verify TELEGRAM_BOT_TOKEN is correct
- Check Railway logs for bot errors
- Make sure bot is started (check server.ts imports bot)
