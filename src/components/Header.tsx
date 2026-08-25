'use client';

import React from 'react';
import { Database, Sparkles, RefreshCw, Cpu, Layers, BookOpen, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: 'investigate' | 'memories' | 'sources' | 'mcp';
  setActiveTab: (tab: 'investigate' | 'memories' | 'sources' | 'mcp') => void;
  memoryCount: number;
  onReset: () => void;
  isResetting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  memoryCount,
  onReset,
  isResetting = false,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-[#0d1117]/95 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Track Info */}
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg shadow-sm">
            C<span className="text-emerald-300">OS</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                ContextOS
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-medium">
                  v1.0 Stage-1
                </span>
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-subtle"></span>
                Demo Workspace (FreshCorp)
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Agent-Native Enterprise Memory Layer · <span className="text-zinc-300 font-medium">Freshworks Hackathon Track 2</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('investigate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'investigate'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Investigation Lab
          </button>

          <button
            onClick={() => setActiveTab('memories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'memories'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Company Memory
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px]">
              {memoryCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'sources'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Sources
          </button>

          <button
            onClick={() => setActiveTab('mcp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'mcp'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            MCP Tools
          </button>
        </div>

        {/* Reset / Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            disabled={isResetting}
            title="Reset dataset and memories to initial state"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
