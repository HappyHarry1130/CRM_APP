import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { VCContact, MediaContact, Note, Task } from '../../types';
import { KanbanCard } from './KanbanCard';

type Contact = VCContact | MediaContact;

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  contacts: Contact[];
  onAddNote: (contactId: string, note: Omit<Note, 'id' | 'timestamp'>) => void;
  onDeleteNote: (contactId: string, noteId: string) => void;
  onAddTask: (contactId: string, task: { action: string; dueDate: string }) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  getContactTasks: (contactId: string) => Task[];
}

export function KanbanColumn({ 
  id, 
  title, 
  color, 
  contacts, 
  onAddNote, 
  onDeleteNote,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
  getContactTasks
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    data: {
      type: 'column',
      accepts: ['contact']
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg transition-colors ${
        isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50' : ''
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="ml-auto bg-gray-100 text-gray-600 text-sm font-medium px-2 py-0.5 rounded">
            {contacts.length}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3 min-h-[200px] max-h-[calc(100vh-220px)] overflow-y-auto">
        {contacts.map((contact) => (
          <KanbanCard
            key={contact.id}
            contact={contact}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            onAddTask={onAddTask}
            onToggleTaskComplete={onToggleTaskComplete}
            onDeleteTask={onDeleteTask}
            tasks={getContactTasks(contact.id)}
          />
        ))}
      </div>
    </div>
  );
}