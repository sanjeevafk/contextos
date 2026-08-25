'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { HomeDashboard } from '@/components/HomeDashboard';
import { AgentExecutionTimeline } from '@/components/AgentExecutionTimeline';
import { AnswerCard } from '@/components/AnswerCard';
import { EvidenceGraphView } from '@/components/EvidenceGraphView';
import { SaveMemoryCard } from '@/components/SaveMemoryCard';
import { MemoryHub } from '@/components/MemoryHub';
import { SourcesExplorer } from '@/components/SourcesExplorer';
import { ToolsInspector } from '@/components/ToolsInspector';
import { SourceDrawer } from '@/components/SourceDrawer';
import { CompanyMemory, InvestigationResult, KnowledgeItem } from '@/types';
import {
  Search,
  Database,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ChevronLeft
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [investigationResult, setInvestigationResult] = useState<InvestigationResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState<CompanyMemory[]>([]);
  const [sources, setSources] = useState<KnowledgeItem[]>([]);
  const [selectedSource, setSelectedSource] = useState<KnowledgeItem | null>(null);
  const [hasSavedMemory, setHasSavedMemory] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fetchData = async () => {
    try {
      const [memRes, srcRes] = await Promise.all([
        fetch('/api/memory'),
        fetch('/api/sources')
      ]);
      const memData = await memRes.json();
      const srcData = await srcRes.json();

      if (memData.memories) setMemories(memData.memories);
      if (srcData.sources) setSources(srcData.sources);
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvestigate = async (query: string) => {
    try {
      setIsLoading(true);
      setCurrentQuery(query);
      setActiveTab('investigate');

      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data: InvestigationResult = await res.json();
      setInvestigationResult(data);

      if (data.isMemoryHit) {
        fetchData();
      }
    } catch (e) {
      console.error('Investigation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemorySaved = (newMemory: CompanyMemory) => {
    setHasSavedMemory(true);
    setMemories((prev) => [newMemory, ...prev.filter((m) => m.id !== newMemory.id)]);
  };

  const handleTriggerSecondQuery = () => {
    const q2 = "What should I know before changing Acme's payment configuration?";
    handleInvestigate(q2);
  };

  const handleSelectSource = (sourceId: string) => {
    const found = sources.find((s) => s.id === sourceId);
    if (found) {
      setSelectedSource(found);
    } else {
      fetch(`/api/sources?id=${encodeURIComponent(sourceId)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.source) setSelectedSource(d.source);
        });
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await fetch('/api/memory', { method: 'DELETE' });
      setInvestigationResult(null);
      setHasSavedMemory(false);
      await fetchData();
    } catch (e) {
      console.error('Reset error:', e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-[#0f172a] flex font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        memoryCount={memories.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Tab 1: Home (Exact Match of Screenshot) */}
        {activeTab === 'home' && (
          <HomeDashboard
            onAsk={handleInvestigate}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            memories={memories}
            sources={sources}
          />
        )}

        {/* Tab 2: Active Investigation / Investigation Lab */}
        {activeTab === 'investigate' && (
          <div className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
            {/* Top Bar with Back to Home & Track info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <button
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  title="Reset dataset and memories"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition font-mono shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin text-[#188049]' : ''}`} />
                  <span>Reset Demo</span>
                </button>
                <span className="text-xs text-slate-500 hidden sm:inline">Track 2 · The Great Agent Hackathon</span>
                <a
                  href="https://github.com/sanjeevafk/contextos"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Source Code on GitHub"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-2xs font-medium"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Active Investigation Search Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (currentQuery.trim()) handleInvestigate(currentQuery.trim());
                }}
                className="flex items-center gap-3"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  placeholder="Ask a question about incidents, PRs, docs, or Slack..."
                  className="flex-1 text-sm text-slate-900 focus:outline-none bg-transparent placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !currentQuery.trim()}
                  className="px-5 py-2 bg-[#188049] hover:bg-[#156d3e] text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
                >
                  {isLoading ? 'Investigating...' : 'Ask'}
                </button>
              </form>

              {/* Suggested Demo Queries Bar */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Demo Queries:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleInvestigate(
                      "Why did Acme's payment deployment fail last month, and has this happened before?"
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-700 hover:bg-slate-100 transition text-[11px] font-medium cursor-pointer"
                >
                  <span className="text-[#188049] font-bold mr-1">Step 1:</span>
                  Why did Acme payment deployment fail...
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleInvestigate(
                      "What should I know before changing Acme's payment configuration?"
                    )
                  }
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                    hasSavedMemory
                      ? 'border-blue-300 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-[#f8fafc] text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-blue-600 font-bold mr-1">Step 2:</span>
                  What should I know before changing Acme config...
                </button>
              </div>
            </div>

            {/* Results Display */}
            {investigationResult && (
              <div className="space-y-6">
                {/* Second Query Memory Hit Alert */}
                {investigationResult.isMemoryHit && (
                  <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                        <Database className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-blue-900 uppercase">
                          Company Memory Hit: {investigationResult.retrievedMemory?.id}
                        </div>
                        <p className="text-xs text-slate-600">
                          Directly answered using newly created institutional memory record (Prevented repeat outage).
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('memories')}
                      className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium underline cursor-pointer"
                    >
                      <span>View in Memory Hub</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Answer Card */}
                <AnswerCard
                  result={investigationResult}
                  onSelectSource={handleSelectSource}
                />

                {/* Evidence Relationship Graph */}
                {investigationResult.evidenceGraph && (
                  <EvidenceGraphView
                    graph={investigationResult.evidenceGraph}
                    onSelectSource={handleSelectSource}
                  />
                )}

                {/* Candidate Memory Card */}
                {investigationResult.proposedMemory && !investigationResult.isMemoryHit && (
                  <SaveMemoryCard
                    proposedMemory={investigationResult.proposedMemory}
                    onMemorySaved={handleMemorySaved}
                    onTriggerSecondQuery={handleTriggerSecondQuery}
                  />
                )}

                {/* Agent Execution Timeline */}
                {investigationResult.steps && investigationResult.steps.length > 0 && (
                  <AgentExecutionTimeline
                    steps={investigationResult.steps}
                    isLoading={isLoading}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Company Memory */}
        {activeTab === 'memories' && (
          <div className="flex-1 max-w-5xl w-full mx-auto p-6">
            <MemoryHub
              memories={memories}
              onSelectMemoryForQuery={(mem) => {
                const query = `What should I know before changing ${mem.affectedCustomer}'s ${mem.affectedService} configuration?`;
                handleInvestigate(query);
              }}
              onSelectSource={handleSelectSource}
            />
          </div>
        )}

        {/* Tab 4: Connected Sources */}
        {activeTab === 'sources' && (
          <div className="flex-1 max-w-5xl w-full mx-auto p-6">
            <SourcesExplorer
              sources={sources}
              onSelectSource={handleSelectSource}
            />
          </div>
        )}

        {/* Tab 5: Settings / MCP Tools */}
        {activeTab === 'settings' && (
          <div className="flex-1 max-w-5xl w-full mx-auto p-6">
            <ToolsInspector />
          </div>
        )}
      </div>

      {/* Slide-over Source Drawer */}
      <SourceDrawer
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
      />
    </div>
  );
}
