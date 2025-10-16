import { useState } from 'react';
import { generateTelegramToken } from '../lib/api';
import type { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, CheckCircle2 } from 'lucide-react';

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
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-pink-400 flex-shrink-0" />
            <div>
              <p className="text-pink-900 font-medium">Telegram Connected</p>
              <p className="text-sm text-pink-600">
                @{user.telegramUsername || user.telegramId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (token) {
    const telegramLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${token}`;

    return (
      <Card className="border-pink-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-pink-400" />
            <CardTitle className="text-base">Connect Telegram</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-pink-700">Click the link below to connect your Telegram account:</p>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full">
              Open Telegram Bot
            </Button>
          </a>
          <p className="text-xs text-pink-500">This link will expire in 10 minutes</p>
          <Button
            onClick={() => setToken(null)}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          <CardTitle className="text-base">Link Telegram</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        <p className="text-sm text-pink-700">
          Connect your Telegram account to create entries via chat
        </p>
        <Button
          onClick={handleGenerateToken}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Link Telegram'}
        </Button>
      </CardContent>
    </Card>
  );
}
