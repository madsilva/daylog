import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useSession, signOut } from '../lib/auth';
import { fetchEntries, fetchUser } from '../lib/api';
import type { Entry, User } from '../types';
import TelegramLink from '../components/TelegramLink';
import EntryItem from '../components/EntryItem';

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!isPending && !session) {
      navigate('/login');
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session, selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, entriesData] = await Promise.all([
        fetchUser(),
        fetchEntries(
          startOfDay(selectedDate).toISOString(),
          endOfDay(selectedDate).toISOString()
        ),
      ]);
      setUser(userData);
      setEntries(entriesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleEntryUpdate = (updatedEntry: Entry) => {
    setEntries(prev =>
      prev.map(e => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  const handleEntryDelete = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

  const entriesByDate = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Daylog</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hello, {user.name}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <TelegramLink user={user} onLinked={loadData} />

            {/* Week Calendar */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-3">Past 7 Days</h2>
              <div className="space-y-2">
                {last7Days.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const count = entriesByDate[dateStr]?.length || 0;
                  const isSelected = format(selectedDate, 'yyyy-MM-dd') === dateStr;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        isSelected
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{format(date, 'MMM d, yyyy')}</span>
                        <span className="text-gray-500">{count} entries</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h2>

              {entries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No entries for this day
                </p>
              ) : (
                <div className="space-y-4">
                  {entries.map(entry => (
                    <EntryItem
                      key={entry.id}
                      entry={entry}
                      onUpdate={handleEntryUpdate}
                      onDelete={handleEntryDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
