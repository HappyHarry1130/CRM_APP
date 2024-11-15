import React from 'react';
import { Task } from '../../types';
import { Calendar, CheckSquare, Square, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleComplete(task.id)}
              className="mt-1 text-gray-400 hover:text-blue-600"
            >
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div>
              <p className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.action}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                {task.contactName && (
                  <span className="text-sm text-gray-500">
                    {task.contactType === 'vc' ? '👥' : '📰'} {task.contactName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}