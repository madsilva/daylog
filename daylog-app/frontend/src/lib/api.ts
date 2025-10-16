import type { Entry, User, TelegramToken } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Entries API
export async function fetchEntries(startDate?: string, endDate?: string): Promise<Entry[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const queryString = params.toString();
  const url = `${API_URL}/api/entries${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    credentials: 'include', // Include cookies for session
  });

  if (!response.ok) throw new Error('Failed to fetch entries');
  const data = await response.json();
  return data.entries;
}

export async function updateEntry(entryId: string, content: string): Promise<Entry> {
  const response = await fetch(`${API_URL}/api/entries/${entryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });

  if (!response.ok) throw new Error('Failed to update entry');
  const data = await response.json();
  return data.entry;
}

export async function deleteEntry(entryId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/entries/${entryId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to delete entry');
}

// User API
export async function fetchUser(): Promise<User> {
  const response = await fetch(`${API_URL}/api/user/me`, {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch user');
  const data = await response.json();
  return data.user;
}

export async function generateTelegramToken(): Promise<TelegramToken> {
  const response = await fetch(`${API_URL}/api/user/generate-telegram-token`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to generate token');
  return response.json();
}
