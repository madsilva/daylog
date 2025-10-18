import { useState } from 'react';
import { format } from 'date-fns';
import type { Entry } from '../types';
import { updateEntry, deleteEntry } from '../lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Save, X } from 'lucide-react';

interface EntryItemProps {
  entry: Entry;
  onUpdate: (entry: Entry) => void;
  onDelete: (entryId: string) => void;
}

export default function EntryItem({ entry, onUpdate, onDelete }: EntryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(entry.content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (editedContent.trim() === entry.content) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      const updated = await updateEntry(entry.id, editedContent.trim());
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    setLoading(true);
    try {
      await deleteEntry(entry.id);
      onDelete(entry.id);
    } catch (err) {
      alert('Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(entry.content);
    setIsEditing(false);
  };

  const timestamp = new Date(entry.timestamp);
  const formattedTime = format(timestamp, 'h:mm a');

  return (
    <Card className="border-pink-100 bg-gradient-to-br from-white to-pink-50/30">
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-pink-500">{formattedTime}</span>
          {!isEditing && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                disabled={loading}
                className="h-8 px-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                disabled={loading}
                className="h-8 px-2 text-pink-600 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 border border-pink-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-pink-900 placeholder:text-pink-300"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={loading}
                size="sm"
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={loading}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-pink-900 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
        )}
      </CardContent>
    </Card>
  );
}
