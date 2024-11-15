import React, { useState } from "react";
import { KanbanBoard } from "./kanban/KanbanBoard";
import { Users2, Newspaper } from "lucide-react";
import { VCContact, MediaContact } from "../types";
import { useEffect } from "react";
import { db } from "../utilies/firebase/firebaseConfig";
import firebase from "../utilies/firebase/firebaseConfig";
import { Note } from "../types/api";

type Contact = VCContact | MediaContact;
type ContactType = "all" | "vc" | "media";

interface CRMDashboardProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  onAddTask: (
    contactId: string,
    contactName: string,
    contactType: "vc" | "media",
    task: { action: string; dueDate: string }
  ) => void;
  onAddNote: (contactId: string, note: Omit<Note, "id" | "timestamp">) => void;
  onDeleteNote: (contactId: string, noteId: string) => void;
  tasks: [];
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function CRMDashboard({
  contacts,
  setContacts,
  onAddTask,
  onAddNote,
  onDeleteNote,
  tasks,
  onToggleTaskComplete,
  onDeleteTask,
}: CRMDashboardProps) {
  const [contactType, setContactType] = useState<ContactType>("all");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId) return;

        // Set up real-time listener on the user document
        const unsubscribe = db
          .collection("users")
          .doc(userId)
          .onSnapshot(
            (doc) => {
              if (doc.exists) {
                const userData = doc.data();
                const contactsList = userData?.contact_info || [];
                setContacts(contactsList);
              }
            },
            (error) => {
              console.error("Error fetching contacts:", error);
            }
          );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up contacts listener:", error);
      }
    };

    fetchContacts();
  }, [setContacts]);

  const handleContactMove = async (contactId: string, newStatus: string) => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      const userRef = db.collection("users").doc(userId);

      const doc = await userRef.get();
      const currentContacts = doc.data()?.contact_info || [];

      const updatedContacts = currentContacts.map((contact: Contact) =>
        contact.id === contactId
          ? {
              ...contact,
              status: newStatus,
              lastUpdated: new Date().toISOString(),
            }
          : contact
      );

      await userRef.update({
        contact_info: updatedContacts,
      });
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleAddTaskForContact = (
    contactId: string,
    task: { action: string; dueDate: string }
  ) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      onAddTask(
        contactId,
        contact.contactType === "media" ? contact.name : contact.author,
        contact.contactType,
        task
      );
    }
  };

  const getContactTasks = (contactId: string) => {
    return tasks.filter((task) => task.contactId === contactId);
  };

  const filteredContacts = contacts.filter((contact) => {
    if (contactType === "all") return true;
    return contactType === "vc"
      ? contact.contactType === "vc"
      : contact.contactType === "media";
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setContactType("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              contactType === "all"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Contacts
          </button>
          <button
            onClick={() => setContactType("vc")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              contactType === "vc"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users2 className="w-4 h-4" />
            VC Contacts
          </button>
          <button
            onClick={() => setContactType("media")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              contactType === "media"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            Media Contacts
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <KanbanBoard
          contacts={filteredContacts}
          onContactMove={handleContactMove}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          onAddTask={handleAddTaskForContact}
          onToggleTaskComplete={onToggleTaskComplete}
          onDeleteTask={onDeleteTask}
          getContactTasks={getContactTasks}
        />
      </div>
    </div>
  );
}
