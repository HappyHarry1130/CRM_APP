import React, { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { VCSearchPage } from "./components/VCSearchPage";
import { MediaSearchPage } from "./components/MediaSearchPage";
import { CRMDashboard } from "./components/CRMDashboard";
import { ProfilePage } from "./components/ProfilePage";
import { TasksPage } from "./components/tasks/TasksPage";
import { AuthPage } from "./components/auth/AuthPage";
import { Task, VCContact, MediaContact, User, Note } from "./types";
import firebase from "./utilies/firebase/firebaseConfig";
import { db } from "./utilies/firebase/firebaseConfig";
import {
  vcContacts as mockVCContacts,
  mediaContacts as mockMediaContacts,
} from "./services/api";

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<(VCContact | MediaContact)[]>(() => {
    const initialContacts = [...mockVCContacts, ...mockMediaContacts].map(
      (contact) => ({
        ...contact,
        notes: [],
        tasks: [],
        status: "new",
        lastUpdated: new Date().toISOString(),
      })
    );

    return initialContacts.map((contact, index) => ({
      ...contact,
      status: ["new", "contacted", "negotiating", "closed"][index % 4],
    }));
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId) {
          console.log("No user ID found");
          setLoading(false);
          return;
        }

        const unsubscribe = db
          .collection("users")
          .doc(userId)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              console.log("User data:", userData);

              const contacts = userData?.contact_info || [];
              console.log("All contacts:", contacts);

              const allTasks: Task[] = [];
              const allNotes: Note[] = [];

              contacts.forEach((contact: any) => {
                console.log("Processing contact:", contact);
                console.log("Contact tasks:", contact.tasks);
                console.log("Contact notes:", contact.notes);

                if (contact.tasks && Array.isArray(contact.tasks)) {
                  contact.tasks.forEach((task: Task) => {
                    allTasks.push({
                      ...task,
                      contactId: contact.id,
                      contactName: contact.name,
                      contactType: "sectors" in contact ? "vc" : "media",
                    });
                  });
                }
                if (contact.notes && Array.isArray(contact.notes)) {
                  contact.notes.forEach((note: Note) => {
                    allNotes.push({
                      ...note,
                      contactId: contact.id,
                      contactName: contact.name,
                      contactType: "sectors" in contact ? "vc" : "media",
                    });
                  });
                }
              });

              console.log("Final allTasks:", allTasks);
              console.log("Final allNotes:", allNotes);

              allTasks.sort(
                (a, b) =>
                  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              );

              setTasks(allTasks);
              setNotes(allNotes);
            } else {
              console.log("Document does not exist");
            }
            setLoading(false);
          });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveRoute("dashboard");
  };

  const handleAddTask = async (
    contactId: string,
    contactName: string,
    contactType: "vc" | "media",
    task: { action: string; dueDate: string }
  ) => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      const userRef = db.collection("users").doc(userId);
      const doc = await userRef.get();
      const userData = doc.data();

      if (!userData) return;

      const newTask = {
        id: crypto.randomUUID(),
        action: task.action,
        dueDate: task.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        contactId,
        contactName,
        contactType,
      };

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

      await userRef.update({
        contact_info: updatedContacts,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleTaskComplete = async (taskId: string) => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      const userRef = db.collection("users").doc(userId);
      const doc = await userRef.get();
      const userData = doc.data();

      if (!userData) return;

      const contacts = userData.contact_info || [];
      const updatedContacts = contacts.map((contact: any) => {
        if (contact.tasks) {
          return {
            ...contact,
            tasks: contact.tasks.map((task: Task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            ),
          };
        }
        return contact;
      });

      await userRef.update({
        contact_info: updatedContacts,
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      const userRef = db.collection("users").doc(userId);
      const doc = await userRef.get();
      const userData = doc.data();

      if (!userData) return;

      const contacts = userData.contact_info || [];
      const updatedContacts = contacts.map((contact: any) => {
        if (contact.tasks) {
          return {
            ...contact,
            tasks: contact.tasks.filter((task: Task) => task.id !== taskId),
          };
        }
        return contact;
      });

      await userRef.update({
        contact_info: updatedContacts,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  // const handleAddToPipeline = (contact: VCContact | MediaContact) => {
  //   setContacts((prev) => {
  //     const existingContact = prev.find((c) => c.id === contact.id);
  //     if (existingContact) {
  //       return prev.filter((c) => c.id !== contact.id);
  //     } else {
  //       return [...prev, { ...contact, status: "new", tasks: [], notes: [] }];
  //     }
  //   });
  // };

  const handleAddToPipeline = async (investor: VCContact | MediaContact) => {
    // console.log(investor);
    console.log("user", user);
    const firebaseId = user.id;
    investor.status = "new";
    const contactType = "sectors" in investor ? "vc" : "media";
    investor.contactType = contactType;
    console.log("Contact type:", contactType);
    try {
      const response = await fetch("http://localhost:5000/api/v1/add_contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact_info: investor,
          firebaseId: firebaseId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Contact added successfully:", result.message);
        alert("Contact added successfully!");
      } else {
        console.error("Error:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add contact");
    }
  };

  const handleAddNote = async (
    contactId: string,
    note: { content: string; author: string; type: string }
  ) => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      const userRef = db.collection("users").doc(userId);
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
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (contactId: string, noteId: string) => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      const userRef = db.collection("users").doc(userId);
      const doc = await userRef.get();
      const userData = doc.data();

      if (!userData) return;

      const contacts = userData.contact_info || [];
      const updatedContacts = contacts.map((contact: any) => {
        if (contact.notes) {
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

  const handleRemoveFromPipeline = async (contactId: string) => {
    const firebaseId = user.id;
    console.log("firebaseId", firebaseId);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/remove_contact",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contactId: contactId,
            firebaseId: firebaseId,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Contact removed successfully:", result.message);
        alert("Contact removed successfully!");
      } else {
        console.error("Error:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to remove contact");
    }
  };

  const getPipelineContactIds = () => contacts.map((contact) => contact.id);

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeRoute) {
      case "dashboard":
        return <Dashboard onRouteChange={setActiveRoute} />;
      case "vc":
        return (
          <VCSearchPage
            onAddToPipeline={handleAddToPipeline}
            pipelineContacts={getPipelineContactIds()}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAddTask={(contactId, task) => {
              const contact = contacts.find((c) => c.id === contactId);
              if (contact) {
                handleAddTask(contactId, contact.name, "vc", task);
              }
            }}
            onToggleTaskComplete={handleToggleTaskComplete}
            onDeleteTask={handleDeleteTask}
            tasks={tasks}
            onRemoveFromPipeline={handleRemoveFromPipeline}
          />
        );
      case "media":
        return (
          <MediaSearchPage
            onAddToPipeline={handleAddToPipeline}
            pipelineContacts={getPipelineContactIds()}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAddTask={(contactId, task) => {
              const contact = contacts.find((c) => c.id === contactId);
              if (contact) {
                handleAddTask(
                  contactId,
                  "author" in contact ? contact.author : contact.name,
                  "media",
                  task
                );
              }
            }}
            onToggleTaskComplete={handleToggleTaskComplete}
            onDeleteTask={handleDeleteTask}
            tasks={tasks}
            onRemoveFromPipeline={handleRemoveFromPipeline}
          />
        );
      case "crm":
        return (
          <CRMDashboard
            contacts={contacts}
            setContacts={setContacts}
            onAddTask={(contactId, contactName, contactType, task) =>
              handleAddTask(contactId, contactName, contactType, task)
            }
            tasks={tasks}
            onToggleTaskComplete={handleToggleTaskComplete}
            onDeleteTask={handleDeleteTask}
          />
        );
      case "profile":
        return <ProfilePage user={user} onUpdateUser={setUser} />;
      case "tasks":
        return (
          <TasksPage
            tasks={tasks}
            onToggleComplete={handleToggleTaskComplete}
            onDelete={handleDeleteTask}
            onAddTask={(task) =>
              handleAddTask(crypto.randomUUID(), "General Task", "vc", task)
            }
          />
        );
      default:
        return <Dashboard onRouteChange={setActiveRoute} />;
    }
  };

  return (
    <Layout
      activeRoute={activeRoute}
      onRouteChange={setActiveRoute}
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default Dashboard;
