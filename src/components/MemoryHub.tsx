'use client';

import React, { useState } from 'react';
import { CompanyMemory } from '../types';
import {
  Database,
  Search,
  Tag,
  ShieldCheck,
  Building2,
  Cpu,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MemoryHubProps {
  memories: CompanyMemory[];
  onSelectMemoryForQuery: (memory: CompanyMemory) => void;
  onSelectSource: (sourceId: string) => void;
}

export const MemoryHub: React.FC<MemoryHubProps> = ({
  memories,
  onSelectMemoryForQuery,
  onSelectSource,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags)));

  const filteredMemories = memories.filter((mem) => {
    const matchesSearch =
      searchTerm === '' ||
      mem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mem.rootCause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mem.affectedCustomer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mem.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === null || mem.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Company Memory Layer
            </h2>
            <p className="text-xs text-slate-500">
              Persistent, agent-curated institutional knowledge graph preventing repeated outages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-center">
            <div className="text-sm font-mono font-bold text-blue-600">{memories.length}</div>
            <div className="text-[10px] uppercase font-mono text-slate-500">Active Records</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-center">
            <div className="text-sm font-mono font-bold text-[#188049]">
              {memories.reduce((acc, m) => acc + (m.reuseCount || 0), 0)}
            </div>
            <div className="text-[10px] uppercase font-mono text-slate-500">Total Invocations</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter memories by service, customer, keyword..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
              selectedTag === null
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tags
          </button>
          {allTags.slice(0, 6).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono transition ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-xs space-y-3.5 transition"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
                  {mem.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                  v{mem.version}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Created {new Date(mem.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#188049] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#188049]" />
                  Reused {mem.reuseCount || 0} times
                </span>
                <button
                  onClick={() => onSelectMemoryForQuery(mem)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-medium transition font-mono border border-slate-200 cursor-pointer"
                >
                  <span>Query Memory</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Title & Root Cause */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{mem.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{mem.rootCause}</p>
            </div>

            {/* Entities & Safeguards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">Service:</span>
                  <span className="text-slate-800 font-mono font-medium">{mem.affectedService}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">Customer:</span>
                  <span className="text-slate-800 font-mono font-medium">{mem.affectedCustomer}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">Linked Incidents:</span>
                  <span className="text-rose-700 font-mono text-[11px]">
                    {mem.relatedIncidents.join(', ')}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-3 space-y-1.5">
                <div className="text-[11px] font-mono text-amber-800 uppercase font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  Safeguards Enforced
                </div>
                <ul className="space-y-1">
                  {mem.safeguards.slice(0, 2).map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span className="line-clamp-2">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tags & Sources */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
              <div className="flex flex-wrap items-center gap-1">
                {mem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded font-mono text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {mem.sourceReferences && mem.sourceReferences.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[10px]">Sources:</span>
                  {mem.sourceReferences.map((ref) => (
                    <button
                      key={ref.id}
                      onClick={() => onSelectSource(ref.id)}
                      className="text-blue-600 hover:text-blue-800 underline font-mono text-[11px] cursor-pointer"
                    >
                      {ref.id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
