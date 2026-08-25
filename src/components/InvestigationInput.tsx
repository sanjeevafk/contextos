'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Database, History, HelpCircle } from 'lucide-react';

interface InvestigationInputProps {
  onInvestigate: (query: string) => void;
  isLoading: boolean;
  hasSavedMemory: boolean;
}

export const InvestigationInput: React.FC<InvestigationInputProps> = ({
  onInvestigate,
  isLoading,
  hasSavedMemory,
}) => {
  const [query, setQuery] = useState('');

  const handlePreset = (q: string) => {
    setQuery(q);
    onInvestigate(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onInvestigate(query.trim());
    }
  };

  return (
    <div className="w-full bg-[#111620] border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Input header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Enterprise Investigation Prompt
        </label>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
          <span>Sources: Jira · GitHub · Slack · Docs</span>
        </div>
      </div>

      {/* Main input form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-zinc-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything across enterprise engineering artifacts..."
          disabled={isLoading}
          className="w-full pl-11 pr-32 py-3.5 bg-[#090d13] border border-zinc-700/80 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 transition font-sans"
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`px-4 py-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              !query.trim() || isLoading
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Investigating...
              </>
            ) : (
              <>
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested demo queries */}
      <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-zinc-400 font-mono flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          Judge Demo Queries:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {/* Query 1 */}
          <button
            type="button"
            onClick={() =>
              handlePreset("Why did Acme's payment deployment fail last month, and has this happened before?")
            }
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs text-zinc-300 hover:text-white transition group text-left"
          >
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px] font-semibold">
              Step 1: First Query
            </span>
            <span className="truncate max-w-[280px]">Why did Acme payment deployment fail...</span>
          </button>

          {/* Query 2 */}
          <button
            type="button"
            onClick={() =>
              handlePreset("What should I know before changing Acme's payment configuration?")
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs transition group text-left ${
              hasSavedMemory
                ? 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-600/60 text-blue-200'
                : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300 hover:text-white'
            }`}
          >
            <span
              className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold ${
                hasSavedMemory
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40 animate-pulse-subtle'
                  : 'bg-blue-500/20 text-blue-300'
              }`}
            >
              Step 2: Second Query
            </span>
            <span className="truncate max-w-[280px]">What should I know before changing Acme config...</span>
          </button>
        </div>
      </div>
    </div>
  );
};
