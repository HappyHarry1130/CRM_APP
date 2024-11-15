import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { db } from "../../utilies/firebase/firebaseConfig";
import firebase from "../../utilies/firebase/firebaseConfig";

interface TaskFormProps {
  onSubmit: (task: { action: string; dueDate: string }) => void;
  onClose: () => void;
  contactId: string; // Add this prop to know which contact to update
}

export function TaskForm({ onSubmit, onClose, contactId }: TaskFormProps) {
  const [action, setAction] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action.trim() || !dueDate) return;

    setIsSubmitting(true);

    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (!userData) {
        throw new Error("User data not found");
      }

      // Create new task object
      const newTask = {
        id: crypto.randomUUID(),
        action: action.trim(),
        dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      // Update the contact's tasks in the contact_info array
      const contacts = userData.contact_info || [];
      const updatedContacts = contacts.map((contact: any) => {
        if (contact.id === contactId) {
          return {
            ...contact,
            tasks: [...(contact.tasks || []), newTask],
          };
        }
        return contact;
      });

      // Update Firestore
      await userRef.update({
        contact_info: updatedContacts,
      });

      // Call the onSubmit prop with the new task
      onSubmit({ action: action.trim(), dueDate });
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Action
        </label>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Enter task action..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!action.trim() || !dueDate || isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            "Add Task"
          )}
        </button>
      </div>
    </form>
  );
}
