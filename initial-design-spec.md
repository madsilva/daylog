# Daylog

## Overview
Daylog is an app that lets you record your daily activities in an easy and natural way, by sending texts. I struggle with keeping a journaling habit, but I message people every day. I want to make an app that will let me casually send messages throughout the day of things I want to remember for that day, and the app will organize them by day for me to view later. 

## Parts of the app
### Chatbot
- The chatbot that collects entries will initially be implemented as a Telegram bot

### Website
- The app will have a website where users will sign up, manage their account, and most importantly, view their log of entries.


## Core user flows
### Signing up - happens on the site

### Making an entry - happens in the Telegram bot chat
The user makes an entry by just messaging the bot something, no command required. The bot will take the contents of the user's message and create a new entry with a timestamp for when it was created.

### Viewing entries - happens on the site
The user can view their entries on the site. More complex viewing and filtering will come later, but for MVP:
- The user can see a weekly calendar of the past 7 days that displays the entries for each of the past 7 days in a list
- The user can select a specific date to see entries from


## Data models
### User
- `id`: UUID, primary key
- `name`: string
- `email`: email
- `telegram_id`: string, unique Telegram user ID
- `telegram_username`: string
- `telegram_auth_token`: null, temporary token for linking, cleared after use

### Entry
- `content`: text field
- `timestamp`: datetime created