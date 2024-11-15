import React from 'react';
import { LayoutDashboard, Users2, Newspaper, Target, UserCircle, Rocket, CheckSquare } from 'lucide-react';

interface SidebarProps {
  activeRoute: string;
  onRouteChange: (route: string) => void;
}

export function Sidebar({ activeRoute, onRouteChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vc', label: 'VC Search', icon: Users2 },
    { id: 'media', label: 'Media Search', icon: Newspaper },
    { id: 'crm', label: 'Pipeline', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'profile', label: 'Company Profile', icon: UserCircle },
  ];

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">VenturePress</h1>
        </div>
      </div>

      <nav className="flex-1 py-6">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeRoute === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 mx-3 mb-6 rounded-lg bg-gray-50">
        <p className="text-sm font-medium text-gray-900">Need Help?</p>
        <p className="text-sm text-gray-600 mt-1">Check our documentation or contact support</p>
        <button className="mt-3 w-full px-4 py-2 text-sm font-medium text-blue-700 bg-white rounded-lg border border-blue-200 hover:bg-blue-50">
          View Documentation
        </button>
      </div>
    </div>
  );
}