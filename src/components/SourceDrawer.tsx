'use client';

import React from 'react';
import { KnowledgeItem } from '../types';
import {
  X,
  ExternalLink,
  MessageSquare,
  GitPullRequest,
  GitCommit,
  AlertCircle,
  FileText,
  User,
  Clock,
  Tag,
  Share2
} from 'lucide-react';

interface SourceDrawerProps {
  source: KnowledgeItem | null;
  onClose: () => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({ source, onClose }) => {
  if (!source) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              {getSourceIcon(source.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono uppercase font-semibold">
                  {source.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">{source.id}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{source.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata Details */}
        <div className="p-5 border-b border-slate-100 bg-[#f8fafc] grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <User className="w-3.5 h-3.5" />
            <span className="font-mono text-slate-700 truncate">{source.author}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono text-slate-700">
              {new Date(source.timestamp).toLocaleString()}
            </span>
          </div>

          {source.service && (
            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-mono text-[11px]">Service:</span>
              <span className="font-mono text-slate-800 font-medium">{source.service}</span>
            </div>
          )}

          {source.customer && (
            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-mono text-[11px]">Customer:</span>
              <span className="font-mono text-slate-800 font-medium">{source.customer}</span>
            </div>
          )}

          {source.incidentId && (
            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-mono text-[11px]">Incident:</span>
              <span className="font-mono text-rose-700 font-semibold">{source.incidentId}</span>
            </div>
          )}

          {source.url && (
            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-mono text-[11px]">URL:</span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-mono text-[11px] truncate"
              >
                <span>External Link</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Raw Artifact Payload
            </h4>
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {source.content}
            </div>
          </div>

          {/* Relations */}
          {source.relations && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-purple-600" />
                Linked Graph Relations
              </h4>
              <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 font-mono">
                {Object.entries(source.relations).map(([rel, targets]) => (
                  <div key={rel} className="flex items-center gap-2">
                    <span className="text-purple-700 font-semibold uppercase text-[10px] w-24">
                      {rel}:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {targets?.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 bg-slate-200/80 border border-slate-300 text-slate-800 rounded text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {source.tags && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Tag className="w-3 h-3 text-slate-400 mr-1" />
              {source.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-full font-mono text-[10px]"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
