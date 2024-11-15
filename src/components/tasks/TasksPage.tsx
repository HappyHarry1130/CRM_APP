import React, { useState, useMemo } from "react";
import { Task } from "../../types";
import { TaskList } from "./TaskList";
import { TaskCalendar } from "./TaskCalendar";
import { TaskForm } from "./TaskForm";
import { LayoutList, Calendar, Plus, Filter } from "lucide-react";

interface TasksPageProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onAddTask: (task: { action: string; dueDate: string }) => void;
}

type ViewMode = "list" | "calendar";
type TimeFrame = "all" | "today" | "week" | "month";
type Status = "all" | "pending" | "completed";

export function TasksPage({
  tasks,
  onToggleComplete,
  onDelete,
  onAddTask,
}: TasksPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all");
  const [status, setStatus] = useState<Status>("all");

  console.log("Tasks", tasks);
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((task) =>
        status === "completed" ? task.completed : !task.completed
      );
    }

    // Filter by timeframe
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const monthFromNow = new Date(today);
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);

    if (timeFrame !== "all") {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        switch (timeFrame) {
          case "today":
            return taskDate.getTime() === today.getTime();
          case "week":
            return taskDate >= today && taskDate <= weekFromNow;
          case "month":
            return taskDate >= today && taskDate <= monthFromNow;
          default:
            return true;
        }
      });
    }

    // Sort by due date
    return filtered.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [tasks, timeFrame, status]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar View
          </button>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {viewMode === "list" && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Next 7 Days</option>
              <option value="month">Next 30 Days</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"} found
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <TaskForm
            onSubmit={(task) => {
              onAddTask(task);
              setShowTaskForm(false);
            }}
            onClose={() => setShowTaskForm(false)}
          />
        </div>
      )}

      {viewMode === "list" ? (
        <TaskList
          tasks={tasks}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ) : (
        <TaskCalendar tasks={tasks} onToggleComplete={onToggleComplete} />
      )}
    </div>
  );
}
