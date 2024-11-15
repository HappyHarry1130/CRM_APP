import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { VCContact, MediaContact, Note, Task } from "../../types";

type Contact = VCContact | MediaContact;

interface KanbanBoardProps {
  contacts: Contact[];
  onContactMove: (contactId: string, newStatus: string) => void;
  onAddNote: (contactId: string, note: Omit<Note, "id" | "timestamp">) => void;
  onDeleteNote: (contactId: string, noteId: string) => void;
  onAddTask: (
    contactId: string,
    task: { action: string; dueDate: string }
  ) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  getContactTasks: (contactId: string) => Task[];
}

export const STATUSES = [
  { id: "new", label: "New Leads", color: "bg-purple-500" },
  { id: "contacted", label: "Contacted", color: "bg-blue-500" },
  { id: "negotiating", label: "Negotiating", color: "bg-orange-500" },
  { id: "closed", label: "Closed", color: "bg-green-500" },
];

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export function KanbanBoard({
  contacts,
  onContactMove,
  onAddNote,
  onDeleteNote,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
  getContactTasks,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeContactId = active.id.toString();
      const overId = over.id.toString();

      // Find the target status by checking if the over.id matches a status or belongs to a contact
      const targetStatus =
        STATUSES.find((status) => status.id === overId)?.id ||
        contacts.find((contact) => contact.id === overId)?.status;

      if (targetStatus) {
        onContactMove(activeContactId, targetStatus);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeContact = activeId
    ? contacts.find((c) => c.id === activeId)
    : null;

  // Group contacts by status
  const contactsByStatus = STATUSES.reduce((acc, status) => {
    acc[status.id] = contacts.filter((contact) => contact.status === status.id);
    return acc;
  }, {} as Record<string, Contact[]>);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {STATUSES.map((status) => {
          const columnContacts = contactsByStatus[status.id] || [];

          return (
            <SortableContext
              key={status.id}
              items={[
                status.id,
                ...columnContacts.map((contact) => contact.id),
              ]}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={status.id}
                title={status.label}
                color={status.color}
                contacts={columnContacts}
                onAddNote={onAddNote}
                onDeleteNote={onDeleteNote}
                onAddTask={onAddTask}
                onToggleTaskComplete={onToggleTaskComplete}
                onDeleteTask={onDeleteTask}
                getContactTasks={getContactTasks}
              />
            </SortableContext>
          );
        })}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeId && activeContact ? (
          <div className="rotate-3 w-80">
            <KanbanCard
              contact={activeContact}
              onAddNote={onAddNote}
              onDeleteNote={onDeleteNote}
              onAddTask={onAddTask}
              onToggleTaskComplete={onToggleTaskComplete}
              onDeleteTask={onDeleteTask}
              tasks={getContactTasks(activeContact.id)}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
