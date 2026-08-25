'use client';

import React from 'react';
import { EvidenceGraph, GraphNode } from '../types';
import {
  GitPullRequest,
  AlertTriangle,
  Building2,
  MessageSquare,
  GitCommit,
  History,
  ArrowDown,
  ArrowRight,
  GitFork,
  ExternalLink
} from 'lucide-react';

interface EvidenceGraphViewProps {
  graph: EvidenceGraph;
  onSelectSource: (sourceId: string) => void;
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({ graph, onSelectSource }) => {
  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'github_pr':
        return <GitPullRequest className="w-4 h-4 text-[#188049]" />;
      case 'jira':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'customer':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'slack':
        return <MessageSquare className="w-4 h-4 text-pink-600" />;
      case 'github_commit':
        return <GitCommit className="w-4 h-4 text-cyan-600" />;
      case 'incident':
        return <History className="w-4 h-4 text-rose-600" />;
      default:
        return <GitFork className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusStyle = (status?: GraphNode['status']) => {
    switch (status) {
      case 'failure':
        return 'border-rose-200 bg-rose-50/50 hover:border-rose-300';
      case 'critical':
        return 'border-amber-200 bg-amber-50/50 hover:border-amber-300';
      case 'fix':
        return 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300';
      case 'info':
        return 'border-blue-200 bg-blue-50/50 hover:border-blue-300';
      default:
        return 'border-slate-200 bg-white hover:border-slate-300';
    }
  };

  const primaryChain = [
    { node: graph.nodes.find((n) => n.id === 'node-pr-9281'), edgeLabel: 'caused' },
    { node: graph.nodes.find((n) => n.id === 'node-inc-1842'), edgeLabel: 'affected' },
    { node: graph.nodes.find((n) => n.id === 'node-acme'), edgeLabel: 'discussed in' },
    { node: graph.nodes.find((n) => n.id === 'node-slack'), edgeLabel: 'resolved by' },
    { node: graph.nodes.find((n) => n.id === 'node-commit-abc'), edgeLabel: 'recurred from' },
    { node: graph.nodes.find((n) => n.id === 'node-inc-1631'), edgeLabel: null }
  ].filter((item) => item.node !== undefined);

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
            <GitFork className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Evidence Relationship Graph
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            {graph.nodes.length} Nodes · {graph.edges.length} Cross-Edges
          </span>
        </div>
        <span className="text-xs text-slate-500 font-normal hidden sm:inline">
          Interactive Causality Flow
        </span>
      </div>

      {/* Graph Flow Visualization */}
      <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-5 overflow-x-auto">
        <div className="min-w-[650px] flex flex-col md:flex-row items-center justify-between gap-2.5">
          {primaryChain.map((step) => {
            const node = step.node!;
            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <button
                  onClick={() => node.sourceId && onSelectSource(node.sourceId)}
                  className={`flex-1 max-w-[190px] w-full text-left p-3 rounded-xl border transition duration-150 shadow-2xs group ${getStatusStyle(
                    node.status
                  )}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      {getNodeIcon(node.type)}
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-[#188049] truncate">
                        {node.label}
                      </span>
                    </div>
                    {node.sourceId && (
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                  {node.subLabel && (
                    <p className="text-[11px] text-slate-600 leading-tight line-clamp-2">
                      {node.subLabel}
                    </p>
                  )}
                </button>

                {/* Edge Connector */}
                {step.edgeLabel && (
                  <div className="flex flex-col items-center justify-center px-1 my-1 md:my-0">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-purple-700 px-1.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap mb-0.5">
                      {step.edgeLabel}
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-400 hidden md:block" />
                    <ArrowDown className="w-4 h-4 text-purple-400 md:hidden" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Trigger / Cause
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Outage Incident
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Impacted Entity
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolution Hotfix
          </span>
        </div>
        <span>Click any node to inspect evidence payload</span>
      </div>
    </div>
  );
};
