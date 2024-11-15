import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Settings } from "lucide-react";
import { UserSettingsModal } from "./settings/UserSettingsModal";

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: string;
  onRouteChange: (route: string) => void;
  user: any;
  onLogout: () => void;
  connects: number;
}

export function Layout({
  children,
  activeRoute,
  onRouteChange,
  user,
  onLogout,
  connects,
}: LayoutProps) {
  const [showSettings, setShowSettings] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRoute={activeRoute} onRouteChange={onRouteChange} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeRoute === "vc" && "VC Search"}
              {activeRoute === "media" && "Media Search"}
              {activeRoute === "crm" && "Pipeline"}
              {activeRoute === "profile" && "Company Profile"}
              {activeRoute === "dashboard" && "Dashboard"}
              {activeRoute === "tasks" && "Tasks"}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-gray-500">{`Connects:${connects}`}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>

      <UserSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onLogout={onLogout}
      />
    </div>
  );
}
