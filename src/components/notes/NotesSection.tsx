import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Note } from "../../types";
import { NoteItem } from "./NoteItem";
import { NoteForm } from "./NoteForm";

import { db } from "../../utilies/firebase/firebaseConfig";
import firebase from "../../utilies/firebase/firebaseConfig";

interface NotesSectionProps {
  contactId: string;
}

export function NotesSection({ contactId }: NotesSectionProps) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    if (!currentUser) {
      console.log("No current user");
      return;
    }
    console.log("ContactID", contactId);
    const userRef = db.collection("users").doc(currentUser.uid);

    const unsubscribe = userRef.onSnapshot((doc) => {
      const userData = doc.data();
      if (!userData) {
        console.log("No user data found");
        return;
      }

      const contacts = userData.contact_info || [];
      console.log("All contacts:", contacts);

      const contact = contacts.find((c: any) => c.id === contactId);
      console.log("Found contact:", contact);
      console.log("Contact ID we're looking for:", contactId);

      const notesToSet = contact?.notes || [];
      console.log("Setting notes:", notesToSet);

      setNotes(notesToSet);
    });

    return () => unsubscribe();
  }, [currentUser, contactId]);

  const handleSubmit = async (note: Omit<Note, "id" | "timestamp">) => {
    try {
      if (!currentUser) return;

      const userRef = db.collection("users").doc(currentUser.uid);
      const doc = await userRef.get();
      const userData = doc.data();

      if (!userData) return;

      const newNote = {
        id: crypto.randomUUID(),
        ...note,
        timestamp: new Date().toISOString(),
      };

      const contacts = userData.contact_info || [];
      const updatedContacts = contacts.map((contact: any) => {
        if (contact.id === contactId) {
          return {
            ...contact,
            notes: [...(contact.notes || []), newNote],
          };
        }
        return contact;
      });

      await userRef.update({
        contact_info: updatedContacts,
      });

      setShowNoteForm(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      if (!currentUser) return;

      const userRef = db.collection("users").doc(currentUser.uid);
      const doc = await userRef.get();
      const userData = doc.data();

      if (!userData) return;

      const contacts = userData.contact_info || [];
      const updatedContacts = contacts.map((contact: any) => {
        if (contact.id === contactId && contact.notes) {
          return {
            ...contact,
            notes: contact.notes.filter((note: Note) => note.id !== noteId),
          };
        }
        return contact;
      });

      await userRef.update({
        contact_info: updatedContacts,
      });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <button
          onClick={() => setShowNoteForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      <div className="space-y-4">
        {showNoteForm && (
          <NoteForm
            onSubmit={handleSubmit}
            onClose={() => setShowNoteForm(false)}
          />
        )}

        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={() => handleDelete(note.id)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No notes yet</p>
        )}
      </div>
    </div>
  );
}
