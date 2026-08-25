'use client';

import React from 'react';
import { InvestigationResult, SourceReference } from '../types';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  GitCommit,
  GitPullRequest,
  History,
  MessageSquare,
  ShieldCheck,
  Zap,
  Building2,
  FileText,
  Sparkles
} from 'lucide-react';

interface AnswerCardProps {
  result: InvestigationResult;
  onSelectSource: (sourceId: string) => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ result, onSelectSource }) => {
  const getSourceIcon = (type: SourceReference['sourceType']) => {
    switch (type) {
      case 'slack':
        return <MessageSquare className="w-3.5 h-3.5 text-pink-600" />;
      case 'github_pr':
        return <GitPullRequest className="w-3.5 h-3.5 text-[#188049]" />;
      case 'github_commit':
        return <GitCommit className="w-3.5 h-3.5 text-blue-600" />;
      case 'jira':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'docs':
        return <FileText className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getSourceBadge = (type: SourceReference['sourceType']) => {
    switch (type) {
      case 'slack':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'github_pr':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'github_commit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'jira':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'docs':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-5">
      {/* Top Banner / Verification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#188049]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Executive Investigation Synthesis
            </h2>
            <p className="text-xs text-slate-500">
              Multi-Source Cross-Correlated Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[#188049] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#188049]" />
            <span>Verification: {result.confidenceScore}%</span>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden md:block">
            Cross-Referenced: <strong className="text-slate-800">{result.citations.length}</strong> sources
          </div>
        </div>
      </div>

      {/* Summary Answer */}
      <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 leading-relaxed">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
          Summary Answer
        </h3>
        <p className="text-sm text-slate-900 font-normal leading-relaxed">
          {result.executiveAnswer}
        </p>
      </div>

      {/* Structured Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Root Cause */}
        <div className="bg-[#fcfdfd] border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mb-1.5 uppercase font-mono">
            <Zap className="w-3.5 h-3.5 text-rose-600" />
            Root Cause Breakdown
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{result.rootCause}</p>
        </div>

        {/* Impact */}
        <div className="bg-[#fcfdfd] border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1.5 uppercase font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Impact & Customer Blast Radius
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{result.impact}</p>
        </div>

        {/* Resolution */}
        <div className="bg-[#fcfdfd] border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1.5 uppercase font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#188049]" />
            Resolution & Mitigation Path
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{result.resolution}</p>
        </div>

        {/* Historical Recurrence */}
        <div className="bg-[#fcfdfd] border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800 mb-1.5 uppercase font-mono">
            <History className="w-3.5 h-3.5 text-blue-600" />
            Historical Recurrence Check
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {result.hasHappenedBefore.details}
          </p>
        </div>
      </div>

      {/* Citations */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Source Citations ({result.citations.length})
          </h4>
          <span className="text-[11px] text-slate-400">Click to inspect payload</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {result.citations.map((citation, idx) => (
            <button
              key={citation.id || idx}
              onClick={() => onSelectSource(citation.id)}
              className="text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 transition shadow-2xs group"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-medium flex items-center gap-1 ${getSourceBadge(
                    citation.sourceType
                  )}`}
                >
                  {getSourceIcon(citation.sourceType)}
                  {citation.sourceType}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
              </div>
              <p className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-[#188049]">
                {citation.title}
              </p>
              {citation.snippet && (
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {citation.snippet}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
