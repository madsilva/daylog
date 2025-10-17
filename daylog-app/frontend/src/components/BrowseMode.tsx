import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { Entry } from '@/types';
import EntryItem from './EntryItem';

interface BrowseModeProps {
  entries: Entry[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEntryUpdate: (entry: Entry) => void;
  onEntryDelete: (entryId: string) => void;
  allEntries: Record<string, Entry[]>; // All loaded entries by date
}

export default function BrowseMode({
  entries,
  selectedDate,
  onDateChange,
  onEntryUpdate,
  onEntryDelete,
  allEntries,
}: BrowseModeProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(selectedDate);

  const prevDate = subDays(selectedDate, 1);
  const nextDate = addDays(selectedDate, 1);

  const prevDateStr = format(prevDate, 'yyyy-MM-dd');
  const currentDateStr = format(selectedDate, 'yyyy-MM-dd');
  const nextDateStr = format(nextDate, 'yyyy-MM-dd');

  const prevEntries = allEntries[prevDateStr] || [];
  const nextEntries = allEntries[nextDateStr] || [];

  const handlePrevDay = () => {
    setAnimationDirection('right');
    setTimeout(() => {
      onDateChange(prevDate);
      setAnimationDirection(null);
    }, 300);
  };

  const handleNextDay = () => {
    setAnimationDirection('left');
    setTimeout(() => {
      onDateChange(nextDate);
      setAnimationDirection(null);
    }, 300);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      setCalendarMonth(date);
      setCalendarOpen(false);
    }
  };

  const handleCalendarToggle = () => {
    if (!calendarOpen) {
      setCalendarMonth(selectedDate);
    }
    setCalendarOpen(!calendarOpen);
  };

  return (
    <div className="space-y-4">
      {/* Calendar Selector */}
      <Card className="border-pink-200">
        <CardContent className="pt-4">
          <Button
            variant="outline"
            onClick={handleCalendarToggle}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {format(selectedDate, 'MMMM d, yyyy')}
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${calendarOpen ? 'rotate-90' : ''}`}
            />
          </Button>

          {calendarOpen && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  captionLayout={'dropdown'}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setCalendarMonth(today);
                  onDateChange(today);
                  setCalendarOpen(false);
                }}
                className="w-full"
              >
                Go to Today
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3-Column Day View */}
      <div className="relative overflow-hidden">
        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          {/* Previous Day */}
          <button
            onClick={handlePrevDay}
            className="text-left opacity-40 hover:opacity-60 transition-opacity"
          >
            <DayColumn
              date={prevDate}
              entries={prevEntries}
              onEntryUpdate={onEntryUpdate}
              onEntryDelete={onEntryDelete}
              grayed
            />
          </button>

          {/* Current Day */}
          <div className={animationDirection ? `animate-slide-${animationDirection}` : ''}>
            <DayColumn
              date={selectedDate}
              entries={entries}
              onEntryUpdate={onEntryUpdate}
              onEntryDelete={onEntryDelete}
            />
          </div>

          {/* Next Day */}
          <button
            onClick={handleNextDay}
            className="text-left opacity-40 hover:opacity-60 transition-opacity"
          >
            <DayColumn
              date={nextDate}
              entries={nextEntries}
              onEntryUpdate={onEntryUpdate}
              onEntryDelete={onEntryDelete}
              grayed
            />
          </button>
        </div>

        {/* Mobile: Single column with arrows */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevDay}
              className="flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex-1">
              <DayColumn
                date={selectedDate}
                entries={entries}
                onEntryUpdate={onEntryUpdate}
                onEntryDelete={onEntryDelete}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextDay}
              className="flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DayColumnProps {
  date: Date;
  entries: Entry[];
  onEntryUpdate: (entry: Entry) => void;
  onEntryDelete: (entryId: string) => void;
  grayed?: boolean;
}

function DayColumn({ date, entries, onEntryUpdate, onEntryDelete, grayed }: DayColumnProps) {
  return (
    <Card className={`border-pink-100 ${grayed ? 'opacity-60' : ''}`}>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">
          {format(date, 'EEEE, MMMM d')}
        </h3>

        {entries.length === 0 ? (
          <p className="text-pink-400 text-center py-8">No entries</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                onUpdate={onEntryUpdate}
                onDelete={onEntryDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
