import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  Mail,
  Building2,
  Tag,
  GripVertical,
  Users2,
  Newspaper,
} from "lucide-react";
import { VCContact, MediaContact, Note, Task } from "../../types";
import { ContactDetailModal } from "../ContactDetailModal";
import { MediaDetailModal } from "../MediaDetailModal";

interface KanbanCardProps {
  contact: VCContact | MediaContact;
  onAddNote: (contactId: string, note: Omit<Note, "id" | "timestamp">) => void;
  onDeleteNote: (contactId: string, noteId: string) => void;
  onAddTask: (
    contactId: string,
    task: { action: string; dueDate: string }
  ) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  tasks: Task[];
  isDragging?: boolean;
}

export function KanbanCard({
  contact,
  onAddNote,
  onDeleteNote,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
  tasks,
  isDragging = false,
}: KanbanCardProps) {
  const [showModal, setShowModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableNodeDragging,
  } = useSortable({
    id: contact.id,
    data: {
      type: "contact",
      contact,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableNodeDragging ? 0.5 : undefined,
  };

  const isVC = contact.contactType === "vc";
  const mediaContact = contact as MediaContact;
  const vcContact = contact as VCContact;

  const handleAddNote = (note: Omit<Note, "id" | "timestamp">) => {
    onAddNote(contact.id, note);
  };

  const handleDeleteNote = (noteId: string) => {
    onDeleteNote(contact.id, noteId);
  };

  const handleAddTask = (task: { action: string; dueDate: string }) => {
    onAddTask(contact.id, task);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isSortableNodeDragging) {
      setShowModal(true);
    }
  };

  const notesCount = contact.notes?.length || 0;
  const tasksCount = tasks.length;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group bg-white rounded-lg shadow-sm border border-gray-200 transition-all ${
          isDragging ? "shadow-xl rotate-3" : "hover:shadow-md"
        }`}
      >
        <div className="p-4">
          <div
            {...attributes}
            {...listeners}
            className="opacity-0 group-hover:opacity-100 -mt-2 -ml-2 mb-2 p-2 w-fit cursor-grab active:cursor-grabbing transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          <div onClick={handleClick} className="space-y-3 cursor-pointer">
            <div>
              <div className="flex items-center justify-between mb-2">
                {isVC ? (
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                ) : (
                  <h4 className="font-medium text-gray-900">
                    {contact.author}
                  </h4>
                )}
                {isVC ? (
                  <Users2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <Newspaper className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                {isVC ? contact.contact_info.website : contact.website_url}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                {isVC ? contact.contact_info.emails?.[0] : contact.email}
              </a>
            </div>

            <div className="flex flex-wrap gap-1">
              {isVC
                ? vcContact.sectors?.slice(0, 2).map((sector) => (
                    <span
                      key={sector}
                      className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
                    >
                      {sector}
                    </span>
                  ))
                : mediaContact.topics
                    ?.split(",")
                    .slice(0, 2)
                    .map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700"
                      >
                        {topic.trim()}
                      </span>
                    ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              {notesCount > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{notesCount} notes</span>
                </div>
              )}
              {tasksCount > 0 && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{tasksCount} tasks</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal &&
        (isVC ? (
          <ContactDetailModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            contact={vcContact}
            showNotes={true}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAddTask={handleAddTask}
            onToggleTaskComplete={onToggleTaskComplete}
            onDeleteTask={onDeleteTask}
            tasks={tasks}
            isInPipeline={true}
          />
        ) : (
          <MediaDetailModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            contact={mediaContact}
            showNotes={true}
            onAddNote={handleAddNote}
            onAddTask={handleAddTask}
            onToggleTaskComplete={onToggleTaskComplete}
            onDeleteTask={onDeleteTask}
            tasks={tasks}
            isInPipeline={true}
          />
        ))}
    </>
  );
}
