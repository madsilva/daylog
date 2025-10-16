import { useState } from 'react';
import { format } from 'date-fns';
import type { Entry } from '../types';
import { updateEntry, deleteEntry } from '../lib/api';

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
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-gray-500">{formattedTime}</span>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-700"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-900 whitespace-pre-wrap">{entry.content}</p>
      )}
    </div>
  );
}
