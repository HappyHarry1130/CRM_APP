import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { VCCard } from "./VCCard";
import { FilterDropdownPanel } from "./filters/FilterDropdownPanel";
import { useSearch } from "../hooks/useSearch";
import { useFacets } from "../hooks/useFacets";
import { FilterState, VCContact, Note, Task } from "../types";
import { ContactDetailModal } from "./ContactDetailModal";
import firebase from "../utilies/firebase/firebaseConfig";
import { db } from "../utilies/firebase/firebaseConfig";

interface VCSearchPageProps {
  onAddToPipeline?: (contact: VCContact) => void;
  pipelineContacts?: string[];
  onAddNote?: (contactId: string, note: Omit<Note, "id" | "timestamp">) => void;
  onDeleteNote?: (contactId: string, noteId: string) => void;
  onAddTask?: (
    contactId: string,
    task: { action: string; dueDate: string }
  ) => void;
  onToggleTaskComplete?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onRemoveFromPipeline?: (contactId: string) => void;
  tasks?: Task[];
}

export function VCSearchPage({
  onAddToPipeline,
  pipelineContacts = [],
  onAddNote,
  onDeleteNote,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
  tasks = [],
  onRemoveFromPipeline,
}: VCSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [isAIRecommended, setIsAIRecommended] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { results, loading, error, performSearch, performAISearch } =
    useSearch();
  const { facets } = useFacets("vc");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedContact, setSelectedContact] = useState<VCContact | null>(
    null
  );
  const [userConnects, setUserConnects] = useState<number>(() => {
    const savedConnects = localStorage.getItem("userConnects");
    return savedConnects ? parseInt(savedConnects, 10) : 0;
  });

  const [pipelineStatus, setPipelineStatus] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) return;

    const unsubscribe = db
      .collection("users")
      .doc(userId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const connects = doc.data()?.connects ?? 0;
          setUserConnects(connects);
        }
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPipelineStatus = async () => {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      try {
        const unsubscribe = db
          .collection("users")
          .doc(userId)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              const contacts = userData?.contact_info || [];
              const statusMap = contacts.reduce(
                (acc: { [key: string]: boolean }, contact: any) => {
                  acc[contact.id] = true;
                  return acc;
                },
                {}
              );
              setSector(userData?.company?.industry || "");
              setStage(userData?.company?.stage || "");

              setPipelineStatus(statusMap);
            }
          });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching pipeline status:", error);
      }
    };

    fetchPipelineStatus();
  }, []);

  useEffect(() => {
    const doInitialSearch = async () => {
      console.log("sector", sector);
      console.log("stage", stage);
      try {
        await performSearch(
          "venture capital technology investment",
          "vc",
          sector,
          stage
        );
      } catch (error) {
        console.error("Initial search error:", error);
      }
    };

    doInitialSearch();
  }, [sector, stage]);

  const handleContactClick = async (contact: VCContact) => {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) return;

    if (userConnects <= 0) {
      toast.error("You've run out of connects! Please upgrade your plan.");
      return;
    }

    try {
      await db
        .collection("users")
        .doc(userId)
        .update({
          connects: firebase.firestore.FieldValue.increment(-1),
        });

      setSelectedContact(contact);
    } catch (error) {
      console.error("Error updating connects:", error);
      toast.error("Failed to update connects");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        await performAISearch(searchQuery, "vc");
      } catch (error) {
        console.error("Search error:", error);
      }
    }
  };

  const handleAddNote = (note: Omit<Note, "id" | "timestamp">) => {
    if (
      selectedContact &&
      onAddNote &&
      isContactInPipeline(selectedContact.id)
    ) {
      onAddNote(selectedContact.id, note);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (
      selectedContact &&
      onDeleteNote &&
      isContactInPipeline(selectedContact.id)
    ) {
      onDeleteNote(selectedContact.id, noteId);
    }
  };

  const handleAddTask = (task: { action: string; dueDate: string }) => {
    if (
      selectedContact &&
      onAddTask &&
      isContactInPipeline(selectedContact.id)
    ) {
      onAddTask(selectedContact.id, task);
    }
  };

  const getContactTasks = (contactId: string) => {
    return isContactInPipeline(contactId)
      ? tasks.filter((task) => task.contactId === contactId)
      : [];
  };

  const isContactInPipeline = (contactId: string) => {
    return pipelineStatus[contactId] || false;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search venture capitalists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-20 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isAIRecommended && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md mr-1">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs font-medium">AI Recommended</span>
                </div>
              )}
              <button
                type="submit"
                className="text-gray-400 hover:text-gray-600"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {Object.keys(activeFilters).length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </button>

          {showFilters && (
            <FilterDropdownPanel
              activeFilters={activeFilters}
              onFilterChange={(category, value) =>
                setActiveFilters((prev) => ({ ...prev, [category]: value }))
              }
              onClearFilters={() => setActiveFilters({})}
              onApplyFilters={() => setShowFilters(false)}
              onClose={() => setShowFilters(false)}
              type="vc"
            />
          )}
        </div>
      </div>

      <main>
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((contact) => (
              <VCCard
                key={contact.id}
                contact={contact as VCContact}
                onClick={() => handleContactClick(contact as VCContact)}
                disabled={userConnects <= 0}
                connects={userConnects}
              />
            ))}
          </div>
        )}
      </main>

      {selectedContact && (
        <ContactDetailModal
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          contact={selectedContact}
          showNotes={isContactInPipeline(selectedContact.id)}
          onAddNote={
            isContactInPipeline(selectedContact.id) ? handleAddNote : undefined
          }
          onDeleteNote={
            isContactInPipeline(selectedContact.id)
              ? handleDeleteNote
              : undefined
          }
          onAddTask={
            isContactInPipeline(selectedContact.id) ? handleAddTask : undefined
          }
          onToggleTaskComplete={
            isContactInPipeline(selectedContact.id)
              ? onToggleTaskComplete
              : undefined
          }
          onDeleteTask={
            isContactInPipeline(selectedContact.id) ? onDeleteTask : undefined
          }
          tasks={getContactTasks(selectedContact.id)}
          isInPipeline={isContactInPipeline(selectedContact.id)}
          onTogglePipeline={() => onAddToPipeline?.(selectedContact)}
          onRemoveFromPipeline={() =>
            onRemoveFromPipeline?.(selectedContact.id)
          }
        />
      )}
    </div>
  );
}
