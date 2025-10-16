import { useState } from 'react';
import { generateTelegramToken } from '../lib/api';
import type { User } from '../types';

interface TelegramLinkProps {
  user: User;
  onLinked: () => void;
}

const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot';

export default function TelegramLink({ user, onLinked }: TelegramLinkProps) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerateToken = async () => {
    setLoading(true);
    setError('');

    try {
      const { token } = await generateTelegramToken();
      setToken(token);
    } catch (err) {
      setError('Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  if (user.telegramId) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-700">
          Telegram linked as <span className="font-medium">@{user.telegramUsername || user.telegramId}</span>
        </p>
      </div>
    );
  }

  if (token) {
    const telegramLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${token}`;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <p className="text-blue-900 font-medium">Click the link below to connect Telegram:</p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Telegram Bot
        </a>
        <p className="text-sm text-blue-700">This link will expire in 10 minutes</p>
        <button
          onClick={() => setToken(null)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      {error && (
        <div className="mb-3 text-red-700 text-sm">{error}</div>
      )}
      <p className="text-gray-700 mb-3">Connect your Telegram account to create entries via chat</p>
      <button
        onClick={handleGenerateToken}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Link Telegram'}
      </button>
    </div>
  );
}
