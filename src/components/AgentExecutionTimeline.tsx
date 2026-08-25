'use client';

import React, { useState } from 'react';
import { AgentStep } from '../types';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  FileSearch,
  GitFork,
  Sparkles,
  Brain,
  Database
} from 'lucide-react';

interface AgentExecutionTimelineProps {
  steps: AgentStep[];
  isLoading?: boolean;
}

export const AgentExecutionTimeline: React.FC<AgentExecutionTimelineProps> = ({ steps, isLoading }) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const getToolIcon = (tool: AgentStep['tool']) => {
    switch (tool) {
      case 'intent_parser':
        return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
      case 'search_knowledge':
        return <FileSearch className="w-3.5 h-3.5 text-[#188049]" />;
      case 'get_source':
        return <FileSearch className="w-3.5 h-3.5 text-blue-600" />;
      case 'find_related':
      case 'graph_builder':
        return <GitFork className="w-3.5 h-3.5 text-purple-600" />;
      case 'reasoning_engine':
        return <Brain className="w-3.5 h-3.5 text-rose-600" />;
      case 'memory_extractor':
      case 'search_memory':
        return <Database className="w-3.5 h-3.5 text-cyan-600" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getToolBadgeColor = (tool: AgentStep['tool']) => {
    switch (tool) {
      case 'intent_parser':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'search_knowledge':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'graph_builder':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'reasoning_engine':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'memory_extractor':
      case 'search_memory':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-[#188049]" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Agent Execution Timeline</h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            {steps.length} steps executed
          </span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-1.5 text-xs text-[#188049] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#188049] animate-ping" />
            Active Investigation
          </div>
        )}
      </div>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isExpanded = expandedStepId === step.id;
          return (
            <div key={step.id || idx} className="relative pl-8 group">
              {/* Marker */}
              <div className="absolute left-2 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#188049] flex items-center justify-center z-10 shadow-2xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#188049]" />
              </div>

              <div className="bg-[#fcfdfd] border border-slate-200/80 rounded-xl p-3.5 hover:border-slate-300 transition shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      #{step.stepNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-900">{step.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-mono font-medium flex items-center gap-1 ${getToolBadgeColor(
                        step.tool
                      )}`}
                    >
                      {getToolIcon(step.tool)}
                      {step.tool}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    {step.sourcesFound !== undefined && (
                      <span>
                        found <strong className="text-slate-700">{step.sourcesFound}</strong> sources
                      </span>
                    )}
                    {step.durationMs && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.durationMs}ms
                      </span>
                    )}
                    {step.details && (
                      <button
                        onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                        className="text-slate-400 hover:text-slate-700 transition"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.description}</p>

                {/* Collapsible raw details */}
                {isExpanded && step.details && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-mono bg-slate-900 text-slate-200 p-2.5 rounded-lg overflow-x-auto">
                    <pre>{JSON.stringify(step.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
