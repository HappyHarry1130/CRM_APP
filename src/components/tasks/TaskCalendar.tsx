import React from 'react';
import { Task } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskCalendarProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
}

export function TaskCalendar({ tasks, onToggleComplete }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {previousMonthDays.map((_, index) => (
          <div key={`prev-${index}`} className="bg-white p-2 h-32" />
        ))}
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          return (
            <div
              key={day}
              className={`bg-white p-2 h-32 ${
                dayTasks.length > 0 ? 'hover:bg-blue-50' : ''
              }`}
            >
              <div className="font-medium text-sm text-gray-900">{day}</div>
              <div className="mt-1 space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded ${
                      task.completed
                        ? 'bg-green-50 text-green-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {task.action.length > 20
                      ? `${task.action.substring(0, 20)}...`
                      : task.action}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}