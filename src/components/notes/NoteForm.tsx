import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Note } from '../../types';

interface NoteFormProps {
  onSubmit: (note: Omit<Note, 'id' | 'timestamp'>) => void;
  onClose: () => void;
}

export function NoteForm({ onSubmit, onClose }: NoteFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({
        content: content.trim(),
        author: 'You',
        type: 'note'
      });
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          rows={3}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-12"
        />
        <div className="absolute bottom-3 right-3 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className="text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}