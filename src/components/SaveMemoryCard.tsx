'use client';

import React, { useState } from 'react';
import { ProposedMemory, CompanyMemory } from '../types';
import {
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  BookmarkPlus,
  FileCheck
} from 'lucide-react';

interface SaveMemoryCardProps {
  proposedMemory: ProposedMemory;
  onMemorySaved: (memory: CompanyMemory) => void;
  onTriggerSecondQuery: () => void;
}

export const SaveMemoryCard: React.FC<SaveMemoryCardProps> = ({
  proposedMemory,
  onMemorySaved,
  onTriggerSecondQuery,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedMemory, setSavedMemory] = useState<CompanyMemory | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposedMemory, author: 'ContextOS Institutional Extractor' }),
      });

      const data = await res.json();
      if (data.success && data.memory) {
        setSavedMemory(data.memory);
        onMemorySaved(data.memory);
      }
    } catch (e) {
      console.error('Failed to save memory:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white border-2 border-emerald-200 hover:border-emerald-300 rounded-2xl p-5 shadow-xs transition">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#188049]" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-[#188049] font-bold uppercase tracking-wider">
              Institutional Knowledge Detected
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Candidate Organizational Memory
            </h3>
          </div>
        </div>

        {!savedMemory ? (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[#188049] hover:bg-[#156d3e] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Persisting Memory...
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                Save to Company Memory
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[#188049] text-xs font-mono font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#188049]" />
            <span>Persisted as <strong>{savedMemory.id}</strong> (v{savedMemory.version})</span>
          </div>
        )}
      </div>

      {/* Memory Content Preview */}
      <div className="mt-4 space-y-3.5">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{proposedMemory.title}</h4>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Affected Service:</span>
              <span className="text-slate-800 font-mono font-medium">{proposedMemory.affectedService}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Affected Customer:</span>
              <span className="text-slate-800 font-mono font-medium">{proposedMemory.affectedCustomer}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Related Incidents:</span>
              <div className="flex gap-1">
                {proposedMemory.relatedIncidents.map((inc) => (
                  <span
                    key={inc}
                    className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 rounded text-rose-700 font-mono text-[10px]"
                  >
                    {inc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[11px] font-mono text-slate-500 uppercase">Resolution Guideline:</span>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{proposedMemory.resolution}</p>
          </div>
        </div>

        {/* Safeguards */}
        <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase font-mono mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Institutional Safeguards & Change Gates ({proposedMemory.safeguards.length})
          </div>
          <ul className="space-y-1.5">
            {proposedMemory.safeguards.map((guard, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span>{guard}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Post-Save CTA */}
      {savedMemory && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 font-mono">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Memory Ready For Retrieval
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Demonstrate the core loop: query ContextOS about changing Acme config to retrieve this memory.
            </p>
          </div>

          <button
            onClick={onTriggerSecondQuery}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition whitespace-nowrap cursor-pointer"
          >
            <span>Run Step 2 Query</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
