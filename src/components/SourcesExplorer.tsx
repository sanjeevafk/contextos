'use client';

import React, { useState } from 'react';
import { KnowledgeItem } from '../types';
import {
  BookOpen,
  Search,
  MessageSquare,
  GitPullRequest,
  GitCommit,
  AlertCircle,
  FileText,
  ChevronRight
} from 'lucide-react';

interface SourcesExplorerProps {
  sources: KnowledgeItem[];
  onSelectSource: (sourceId: string) => void;
}

export const SourcesExplorer: React.FC<SourcesExplorerProps> = ({ sources, onSelectSource }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getSourceIcon = (type: KnowledgeItem['type']) => {
    switch (type) {
      case 'slack':
        return <MessageSquare className="w-4 h-4 text-pink-600" />;
      case 'github_pr':
        return <GitPullRequest className="w-4 h-4 text-[#188049]" />;
      case 'github_commit':
        return <GitCommit className="w-4 h-4 text-blue-600" />;
      case 'jira':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'docs':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const filtered = sources.filter((item) => {
    const matchesType = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Enterprise Knowledge Sources
            </h2>
            <p className="text-xs text-slate-500">
              Connected enterprise repositories: Slack war-rooms, GitHub PRs/commits, Jira incidents, and Confluence docs.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Total Seed Artifacts: <strong className="text-slate-800">{sources.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search raw artifacts..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-mono shadow-2xs">
          {['all', 'jira', 'github_pr', 'github_commit', 'slack', 'docs'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-lg transition uppercase text-[11px] cursor-pointer ${
                activeFilter === f
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Sources List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSource(item.id)}
            className="w-full text-left p-4 hover:bg-slate-50/80 transition flex items-start justify-between gap-4 group cursor-pointer"
          >
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="mt-0.5 p-2 rounded-xl bg-[#f8fafc] border border-slate-200 group-hover:border-slate-300 flex-shrink-0">
                {getSourceIcon(item.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {item.id}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    by {item.author} · {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-purple-700 transition">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug font-sans">
                  {item.content}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-700">
              <span className="text-[11px] font-mono hidden md:inline">Inspect</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
