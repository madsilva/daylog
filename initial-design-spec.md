# Daylog

## Overview
Daylog is an app that lets you record your daily activities in an easy and natural way, by sending texts. I struggle with keeping a journaling habit, but I message people every day. I want to make an app that will let me casually send messages throughout the day of things I want to remember for that day, and the app will organize them by day for me to view later. 

## Parts of the app
### Chatbot
- The chatbot that collects entries will initially be implemented as a Telegram bot. Users will make an account on the site, and then be prompted to connect their account to the Telegram bot. 

### Website
- The app will have a website where users will sign up, manage their account, and most importantly, view their log of entries.


## Core user flows
### Signing up - happens on the site
The user makes an account on the site with a name, email, and password. After signing up, the user sees a button to link to Telegram. 

### copied from claude - this is an idea of how the user can link their account to the telegram bot?
User logs into your web app
They click "Connect Telegram Bot"
Your app generates a unique, temporary token (valid for ~10 minutes)
Show them a link or QR code: https://t.me/your_bot?start=AUTH_TOKEN_HERE
User clicks it, opens Telegram, and sends /start AUTH_TOKEN_HERE to the bot
Your bot receives the message with the token and the user's Telegram ID
Bot validates the token, links that Telegram ID to the user's account, and confirms success

Once linked, every time the user messages your bot:

Bot receives message with the user's Telegram ID
Bot looks up which app account is linked to that Telegram ID
Bot writes data to that account

## Simple Example Flow
```
1. User visits your app → Logs in → Sees "Link Telegram"
2. App generates token "abc123xyz" → Stores in user record
3. App shows: "Click here: https://t.me/yourbot?start=abc123xyz"
4. User clicks → Opens Telegram → Sends "/start abc123xyz"
5. Bot receives: { telegram_id: "987654321", text: "/start abc123xyz" }
6. Bot calls your API: POST /api/link-telegram { token: "abc123xyz", telegram_id: "987654321" }
7. API finds user with that token → Updates telegram_id field → Clears token
8. Bot replies: "✅ Account linked! You can now send data."
9. Later, user messages bot: "Log: Drank 8 glasses of water"
10. Bot receives: { telegram_id: "987654321", text: "Log: Drank..." }
11. Bot queries API: GET /api/user-by-telegram/987654321 → Gets user-123
12. Bot writes data to user-123's account

### Making an entry - happens in the Telegram bot chat
The user makes an entry by just messaging the bot something, no command required. The bot will take the contents of the user's message, make a request to the server, and the server will handle creating a new entry with a timestamp for when it was created. The server will then respond back to the bot if the entry creation succeeded or not, and the bot will respond to the user letting them know their entry was recorded. 

### Viewing entries - happens on the site
The user can view their entries on the site. More complex viewing and filtering will come later, but for MVP:
- The user can see a weekly calendar of the past 7 days that displays the entries for each of the past 7 days in a list
- The user can select a specific date to see entries from

### Editing and deleting entries
On the site, the user can select a given entry and edit the text, which will then be updated in the DB. The user can also delete entries on the site. For MVP, the user can only create entries from the Telegram bot, but only edit or delete them on the site. 

## Technical details
### Tech stack
Frontend
- React
- Vite
- TailwindCSS

Backend
- Express
- BetterAuth for handling user authentication and sessions
- Drizzle with Postgres

## Data models
### User
- `id`: UUID, primary key
- `name`: string
- `email`: email
- `password_hash`: hashed password
- `telegram_id`: string, unique Telegram user ID
- `telegram_username`: string
- `telegram_auth_token`: null, temporary token for linking, cleared after use
- `created_at`: datetime created


### Entry
- `id`: UUID, primary key
- `user_id`: UUID to User instance
- `content`: text field
- `timestamp`: datetime created