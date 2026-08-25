'use client';

import React from 'react';
import {
  Home as HomeIcon,
  Search,
  Database,
  Share2,
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';

export type NavTab = 'home' | 'investigate' | 'memories' | 'sources' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  memoryCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, memoryCount }) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: HomeIcon },
    { id: 'investigate' as NavTab, label: 'Investigations', icon: Search },
    { id: 'memories' as NavTab, label: 'Company Memory', icon: Database, badge: memoryCount },
    { id: 'sources' as NavTab, label: 'Sources', icon: Share2 },
    { id: 'settings' as NavTab, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/90 bg-white flex flex-col justify-between p-5 min-h-screen flex-shrink-0">
      {/* Top Branding & Nav */}
      <div className="space-y-7">
        {/* Brand Logo */}
        <div className="px-2 pt-1">
          <button
            onClick={() => setActiveTab('home')}
            className="text-2xl font-bold tracking-tight text-slate-900 hover:text-slate-800 transition flex items-center gap-1"
          >
            ContextOS
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#eaf7ee] text-[#188049] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#188049]' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Demo Workspace Pill Card */}
      <div className="pt-4">
        <div className="border border-slate-200/90 rounded-2xl p-3.5 bg-[#fcfdfd] shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
            <span className="text-xs font-semibold text-slate-800">Demo Workspace</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 pl-4">FreshCorp</p>
        </div>
      </div>
    </aside>
  );
};
