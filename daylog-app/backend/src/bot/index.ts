import TelegramBot from 'node-telegram-bot-api';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.API_URL || 'http://localhost:3000';
const BOT_API_KEY = process.env.BOT_API_KEY;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
}

if (!BOT_API_KEY) {
  throw new Error('BOT_API_KEY environment variable is required');
}

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('Telegram bot started...');

/**
 * Handle /start command with token for linking accounts
 */
bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from?.id.toString();
  const telegramUsername = msg.from?.username;
  const token = match?.[1];

  if (!token || !telegramId) {
    bot.sendMessage(chatId, 'Invalid link. Please try again from the website.');
    return;
  }

  try {
    // Call backend API to link the account
    const response = await fetch(`${API_URL}/api/bot/link-telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bot-api-key': BOT_API_KEY,
      },
      body: JSON.stringify({
        token,
        telegramId,
        telegramUsername,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      bot.sendMessage(
        chatId,
        `Failed to link account: ${error.error || 'Unknown error'}`
      );
      return;
    }

    bot.sendMessage(
      chatId,
      '✅ Account linked successfully! You can now send messages to create entries.'
    );
  } catch (error) {
    console.error('Error linking account:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});

/**
 * Handle /start command without token
 */
bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'Welcome to Daylog! Please link your account from the website first.'
  );
});

/**
 * Handle /yesterday or /y command with no content
 */
bot.onText(/^\/(yesterday|y)$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Can't create entry for yesterday with no content!");
});

/**
 * Handle /yesterday or /y command for creating yesterday's entry
 */
bot.onText(/^\/(yesterday|y)\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from?.id.toString();
  const content = match?.[2]?.trim(); // The text after the command

  if (!telegramId || !content) {
    bot.sendMessage(chatId, "Can't create entry for yesterday with no content!");
    return;
  }

  try {
    // Get user ID from telegram ID
    const userResponse = await fetch(`${API_URL}/api/bot/user/${telegramId}`, {
      headers: {
        'x-bot-api-key': BOT_API_KEY,
      },
    });

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        bot.sendMessage(
          chatId,
          'Your account is not linked. Please link your account from the website first.'
        );
      } else {
        bot.sendMessage(chatId, 'An error occurred. Please try again later.');
      }
      return;
    }

    const { userId } = await userResponse.json();

    // Create timestamp for yesterday at noon
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);

    // Create entry for yesterday
    const entryResponse = await fetch(`${API_URL}/api/bot/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bot-api-key': BOT_API_KEY,
      },
      body: JSON.stringify({
        userId,
        content,
        timestamp: yesterday.toISOString(),
      }),
    });

    if (!entryResponse.ok) {
      bot.sendMessage(chatId, 'Failed to create entry. Please try again.');
      return;
    }

    bot.sendMessage(chatId, '✅ Entry recorded for yesterday!');
  } catch (error) {
    console.error('Error creating yesterday entry:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});

/**
 * Handle all other messages as entry creation
 */
bot.on('message', async (msg) => {
  // Skip if it's a command
  if (msg.text?.startsWith('/')) {
    return;
  }

  const chatId = msg.chat.id;
  const telegramId = msg.from?.id.toString();
  const content = msg.text;
  const messageDate = msg.date; // Unix timestamp from Telegram

  if (!telegramId || !content) {
    return;
  }

  try {
    // Get user ID from telegram ID
    const userResponse = await fetch(`${API_URL}/api/bot/user/${telegramId}`, {
      headers: {
        'x-bot-api-key': BOT_API_KEY,
      },
    });

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        bot.sendMessage(
          chatId,
          'Your account is not linked. Please link your account from the website first.'
        );
      } else {
        bot.sendMessage(chatId, 'An error occurred. Please try again later.');
      }
      return;
    }

    const { userId } = await userResponse.json();

    // Create entry with Telegram message timestamp
    const entryResponse = await fetch(`${API_URL}/api/bot/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bot-api-key': BOT_API_KEY,
      },
      body: JSON.stringify({
        userId,
        content,
        timestamp: new Date(messageDate * 1000).toISOString(), // Convert Unix timestamp to ISO string
      }),
    });

    if (!entryResponse.ok) {
      bot.sendMessage(chatId, 'Failed to create entry. Please try again.');
      return;
    }

    bot.sendMessage(chatId, '✅ Entry recorded!');
  } catch (error) {
    console.error('Error creating entry:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

export { bot };
