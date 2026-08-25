'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowRight,
  FileText
} from 'lucide-react';
import { CompanyMemory, KnowledgeItem } from '../types';

interface HomeDashboardProps {
  onAsk: (query: string) => void;
  onNavigateTab: (tab: 'investigate' | 'memories' | 'sources' | 'settings') => void;
  memories: CompanyMemory[];
  sources: KnowledgeItem[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onAsk,
  onNavigateTab,
  memories,
  sources,
}) => {
  const [inputQuery, setInputQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      onAsk(inputQuery.trim());
    }
  };

  const handleChipClick = (q: string) => {
    setInputQuery(q);
    onAsk(q);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full px-6 py-6 min-h-[calc(100vh-2rem)]">
      {/* Top Right Track Banner */}
      <div className="flex justify-end">
        <span className="text-xs font-normal text-slate-500 tracking-normal">
          Track 2 · The Great Agent Hackathon
        </span>
      </div>

      {/* Center Main Stage */}
      <div className="max-w-3xl w-full mx-auto my-auto py-8">
        {/* Greetings */}
        <div className="text-center space-y-1.5 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Good morning
          </h1>
          <p className="text-sm text-slate-500">
            Ask anything across your company&apos;s engineering knowledge.
          </p>
        </div>

        {/* Large Ask Box */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-2.5 pl-5 shadow-xs transition flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#188049]/20 focus-within:border-[#188049]"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about incidents, PRs, docs, or Slack..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition shadow-xs ${
              inputQuery.trim()
                ? 'bg-[#188049] hover:bg-[#156d3e] text-white cursor-pointer'
                : 'bg-[#188049]/70 text-white cursor-default'
            }`}
          >
            Ask
          </button>
        </form>

        {/* Try asking chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500">
          <span className="text-slate-500 font-normal mr-1">Try asking:</span>

          <button
            type="button"
            onClick={() => handleChipClick("Why did Acme payment deployment fail?")}
            className="border border-slate-200/90 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Why did Acme payment deployment fail?
          </button>

          <button
            type="button"
            onClick={() => handleChipClick("Show open incidents")}
            className="border border-slate-200/90 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Show open incidents
          </button>

          <button
            type="button"
            onClick={() => handleChipClick("What changed in the last release?")}
            className="border border-slate-200/90 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition"
          >
            What changed in the last release?
          </button>
        </div>

        {/* 3 Columns Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {/* Card 1: Recent Investigations */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3.5">
                Recent Investigations
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => handleChipClick("Why did Acme's payment deployment fail last month, and has this happened before?")}
                  className="w-full text-left flex items-center justify-between group hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-800 truncate group-hover:text-[#188049]">
                      Acme payment deployment failure
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2 hours ago</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </button>

                <button
                  onClick={() => handleChipClick("Increase in API error rates")}
                  className="w-full text-left flex items-center justify-between group hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-800 truncate group-hover:text-[#188049]">
                      Increase in API error rates
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Yesterday</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </button>

                <button
                  onClick={() => handleChipClick("Auth service latency spike")}
                  className="w-full text-left flex items-center justify-between group hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-800 truncate group-hover:text-[#188049]">
                      Auth service latency spike
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2 days ago</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </button>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('investigate')}
                className="text-xs font-medium text-[#188049] hover:text-[#156d3e] flex items-center gap-1 transition"
              >
                <span>View all investigations</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Company Memory */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3.5">
                Company Memory
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => onAsk("What should I know before changing Acme's payment configuration?")}
                  className="w-full text-left flex items-center justify-between group hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-800 truncate group-hover:text-[#188049]">
                      Payment configuration incidents
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Added 1 day ago</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </button>

                <button
                  onClick={() => onNavigateTab('memories')}
                  className="w-full text-left flex items-center justify-between group hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-800 truncate group-hover:text-[#188049]">
                      Rate limit best practices
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Added 3 days ago</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </button>

                <button
                  onClick={() => onNavigateTab('memories')}
                  className="w-full text-left flex items-center justify-between group hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-800 truncate group-hover:text-[#188049]">
                      On-call escalation flow
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Added 1 week ago</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </button>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('memories')}
                className="text-xs font-medium text-[#188049] hover:text-[#156d3e] flex items-center gap-1 transition"
              >
                <span>View all knowledge</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Connected Sources */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3.5">
                Connected Sources
              </h2>

              <div className="space-y-3.5 text-xs">
                {/* Jira */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Jira Diamond Icon */}
                    <div className="w-4 h-4 rounded-xs bg-[#0052cc] flex items-center justify-center text-white text-[9px] font-bold">
                      ◆
                    </div>
                    <span className="font-medium text-slate-800">Jira</span>
                  </div>
                  <span className="text-slate-400 text-xs font-normal">128 items</span>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* GitHub Cat Icon */}
                    <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-white text-[9px]">
                      🐱
                    </div>
                    <span className="font-medium text-slate-800">GitHub</span>
                  </div>
                  <span className="text-slate-400 text-xs font-normal">342 items</span>
                </div>

                {/* Slack */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Slack Hash Icon */}
                    <div className="w-4 h-4 rounded-xs bg-[#4a154b] flex items-center justify-center text-white text-[9px] font-bold">
                      #
                    </div>
                    <span className="font-medium text-slate-800">Slack</span>
                  </div>
                  <span className="text-slate-400 text-xs font-normal">256 items</span>
                </div>

                {/* Docs */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-xs bg-[#2684ff] flex items-center justify-center text-white">
                      <FileText className="w-2.5 h-2.5" />
                    </div>
                    <span className="font-medium text-slate-800">Docs</span>
                  </div>
                  <span className="text-slate-400 text-xs font-normal">89 items</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('sources')}
                className="text-xs font-medium text-[#188049] hover:text-[#156d3e] flex items-center gap-1 transition"
              >
                <span>Manage sources</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="text-center py-4">
        <p className="text-xs text-slate-400 font-normal">
          ContextOS · Agent-Native Enterprise Memory Layer
        </p>
      </footer>
    </div>
  );
};
