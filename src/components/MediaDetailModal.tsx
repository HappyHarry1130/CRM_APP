import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Globe,
  MapPin,
  Tag,
  Newspaper,
  ExternalLink,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Award,
  Radio,
  Mic,
  Rss,
  Phone,
  CheckSquare,
  Plus,
} from "lucide-react";
import { MediaContact, Note, Task } from "../types";
import { MessageGenerator } from "./MessageGenerator";
import { NotesSection } from "./notes/NotesSection";
import { TaskForm } from "./tasks/TaskForm";
import { TaskList } from "./tasks/TaskList";
import { db } from "../utilies/firebase/firebaseConfig";
import firebase from "../utilies/firebase/firebaseConfig";

type TabType = "overview" | "contacts" | "topics" | "notes" | "tasks";

interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: MediaContact;
  showNotes?: boolean;
  onAddNote?: (note: Omit<Note, "id" | "timestamp">) => void;
  onDeleteNote?: (noteId: string) => void;
  onAddTask?: (task: { action: string; dueDate: string }) => void;
  onToggleTaskComplete?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  tasks?: Task[];
  isInPipeline?: boolean;
  onTogglePipeline?: () => void;
  onRemoveFromPipeline?: (contactId: string) => void;
}

export function MediaDetailModal({
  isOpen,
  onClose,
  contact,
  showNotes = true,
  onAddNote,
  onDeleteNote,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
  isInPipeline = false,
  onTogglePipeline,
  onRemoveFromPipeline,
}: MediaDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [messageType, setMessageType] = useState<"email" | "social" | null>(
    null
  );
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState<[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId || !contact.id) return;

        const userRef = db.collection("users").doc(userId);

        const unsubscribe = userRef.onSnapshot((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const contacts = userData?.contact_info || [];
            const currentContact = contacts.find(
              (c: any) => c.id === contact.id
            );

            if (currentContact) {
              setTasks(currentContact.tasks || []);
            } else {
              setTasks([]);
            }
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    if (isInPipeline) {
      fetchTasks();
    }
  }, [contact.id, isInPipeline]);

  if (!isOpen) return null;

  const location = [
    contact.location?.city,
    contact.location?.state,
    contact.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const topics = contact.topics
    ? contact.topics.split(",").map((topic) => topic.trim())
    : [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "journalists":
        return <Newspaper className="w-5 h-5" />;
      case "podcasts":
        return <Mic className="w-5 h-5" />;
      case "youtubers":
        return <Radio className="w-5 h-5" />;
      case "magazines":
        return <Rss className="w-5 h-5" />;
      default:
        return <Newspaper className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "journalists":
        return "bg-purple-100 text-purple-700";
      case "podcasts":
        return "bg-green-100 text-green-700";
      case "youtubers":
        return "bg-red-100 text-red-700";
      case "magazines":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Match Score
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {contact.relevance_score}%
                    </span>
                  </div>
                  <div className="h-12 w-px bg-gray-200"></div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setMessageType("email")}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Draft Email
                    </button>
                    <button
                      onClick={() => setMessageType("social")}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-100 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      Draft Social Message
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                About
              </h4>
              <p className="text-gray-600">{contact.description}</p>
            </div>

            {/* Media Outlets */}
            {contact.outlets && contact.outlets.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Media Outlets
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {contact.outlets.map((outlet) => (
                    <div
                      key={outlet.name}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <a
                            href={outlet.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          >
                            {outlet.name}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {outlet.title && (
                            <p className="text-sm text-gray-600 mt-1">
                              {outlet.title}
                            </p>
                          )}
                        </div>
                        {outlet.email && (
                          <a
                            href={`mailto:${outlet.email}`}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h4>
              <div className="space-y-4">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.website_url && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a
                      href={contact.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contact.website_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "topics":
        return (
          <div className="space-y-6">
            {topics.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Coverage Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              {isInPipeline && <NotesSection contactId={contact.id} />}
            </div>
          </div>
        );

      case "tasks":
        return (
          <div className="space-y-6">
            {isInPipeline &&
              (showTaskForm ? (
                <TaskForm
                  contactId={contact.id}
                  onSubmit={(task) => {
                    onAddTask?.(task);
                    setShowTaskForm(false);
                  }}
                  onClose={() => setShowTaskForm(false)}
                />
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tasks
                    </h3>
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </button>
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : tasks.length > 0 ? (
                    <TaskList
                      tasks={tasks}
                      onToggleComplete={onToggleTaskComplete || (() => {})}
                      onDelete={onDeleteTask || (() => {})}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tasks yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Create your first task for this contact
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl">
          <div className="flex justify-between items-start p-6 border-b border-gray-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                {contact.type && (
                  <span
                    className={`px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-2 ${getTypeColor(
                      contact.type
                    )}`}
                  >
                    {getTypeIcon(contact.type)}
                    {contact.type.charAt(0).toUpperCase() +
                      contact.type.slice(1)}
                  </span>
                )}
                {contact.category && (
                  <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                    {contact.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {contact.author || contact.site_name}
                </h3>
                {onTogglePipeline && (
                  <button
                    onClick={() => {
                      if (isInPipeline) {
                        onRemoveFromPipeline?.(contact.id);
                      } else {
                        onTogglePipeline();
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isInPipeline
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {isInPipeline ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14" />
                        </svg>
                        Remove from Pipeline
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 5v14m-7-7h14" />
                        </svg>
                        Add to Pipeline
                      </>
                    )}
                  </button>
                )}
              </div>
              {location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{location}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <nav className="flex space-x-4">
              {(
                [
                  "overview",
                  "contacts",
                  "topics",
                  "notes",
                  "tasks",
                ] as TabType[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm font-medium rounded-md capitalize ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {messageType ? (
              <MessageGenerator
                contact={contact}
                type={messageType}
                onClose={() => setMessageType(null)}
              />
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
