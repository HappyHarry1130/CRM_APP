import React from 'react';
import { Trash2 } from 'lucide-react';
import { Note } from '../../types/api';

interface NoteItemProps {
  note: Note;
  onDelete?: () => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  const formattedDate = new Date(note.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{note.author}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
    </div>
  );
}