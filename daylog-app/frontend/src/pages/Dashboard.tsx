import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useSession, signOut } from '../lib/auth';
import { fetchEntries, fetchUser } from '../lib/api';
import type { Entry, User } from '../types';
import TelegramLink from '../components/TelegramLink';
import EntryItem from '../components/EntryItem';
import { Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  if (isPending ) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-pink-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <nav className="relative z-10 bg-white/80 backdrop-blur-md shadow-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
              <h1 className="text-2xl font-bold gradient-text">Daylog</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-pink-700">Hello, {user.name}</span>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <TelegramLink user={user} onLinked={loadData} />

            {/* Week Calendar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-pink-100 p-4">
              <h2 className="font-semibold mb-3 text-pink-700">Past 7 Days</h2>
              <div className="space-y-2">
                {last7Days.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const count = entriesByDate[dateStr]?.length || 0;
                  const isSelected = format(selectedDate, 'yyyy-MM-dd') === dateStr;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-900 shadow-sm'
                          : 'hover:bg-pink-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{format(date, 'MMM d, yyyy')}</span>
                        <span className={isSelected ? 'text-pink-700' : 'text-pink-400'}>
                          {count} {count === 1 ? 'entry' : 'entries'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-pink-100 p-6">
              <h2 className="text-xl font-bold mb-4 gradient-text">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h2>

              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300" />
                  <p className="text-pink-400">
                    No entries for this day
                  </p>
                </div>
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
