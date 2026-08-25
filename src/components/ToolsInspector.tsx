'use client';

import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, Code2, Copy } from 'lucide-react';

const MCP_TOOLS = [
  {
    name: 'search_knowledge',
    description: 'Hybrid search across Slack, GitHub, Jira, and Confluence docs with BM25 + semantic similarity',
    samplePayload: {
      query: "Acme payment deployment timeout failure",
      sourceTypes: ["jira", "slack", "github_pr"],
      limit: 3
    }
  },
  {
    name: 'get_source',
    description: 'Fetch full metadata and raw content of an enterprise artifact by ID',
    samplePayload: {
      sourceId: "jira-inc-1842"
    }
  },
  {
    name: 'find_related',
    description: 'Traverse graph cross-references from a given entity or incident ID',
    samplePayload: {
      entityId: "jira-inc-1842"
    }
  },
  {
    name: 'investigate',
    description: 'Autonomous multi-step investigation orchestrator across enterprise sources with memory synthesis',
    samplePayload: {
      query: "Why did Acme's payment deployment fail last month, and has this happened before?"
    }
  },
  {
    name: 'search_memory',
    description: 'Query existing persistent organizational memories to prevent repeated outages',
    samplePayload: {
      query: "Acme payment configuration webhook timeout safeguards"
    }
  },
  {
    name: 'create_memory',
    description: 'Persist a verified institutional memory record into the organizational memory graph',
    samplePayload: {
      proposedMemory: {
        title: "Acme Webhook SLA Safeguard",
        rootCause: "On-prem Chase proxy 1450ms P99 requires 3000ms timeout",
        affectedService: "payment-orchestrator",
        affectedCustomer: "Acme Corp",
        relatedIncidents: ["INC-1842", "INC-1631"],
        resolution: "Set cust_acme_prod to 3000ms",
        safeguards: ["Never reduce global timeout < 2500ms"],
        tags: ["acme", "sla", "timeout"]
      }
    }
  }
];

export const ToolsInspector: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState(MCP_TOOLS[0]);
  const [payloadStr, setPayloadStr] = useState(JSON.stringify(MCP_TOOLS[0].samplePayload, null, 2));
  const [isRunning, setIsRunning] = useState(false);
  const [toolResult, setToolResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectTool = (tool: typeof MCP_TOOLS[0]) => {
    setSelectedTool(tool);
    setPayloadStr(JSON.stringify(tool.samplePayload, null, 2));
    setToolResult(null);
  };

  const handleExecute = async () => {
    try {
      setIsRunning(true);
      const parsed = JSON.parse(payloadStr);

      const res = await fetch(`/api/tools/${selectedTool.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      const data = await res.json();
      setToolResult(data);
    } catch (e: any) {
      setToolResult({ error: e.message });
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(payloadStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full space-y-5">
      {/* Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              MCP Tool & Skill Interface
            </h2>
            <p className="text-xs text-slate-500">
              Exposed agent skill tools adhering to Model Context Protocol (MCP) tool schemas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/tools/schemas"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-amber-800 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>View MCP JSON Schema</span>
          </a>
        </div>
      </div>

      {/* Main Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tool Selector */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
          <h3 className="text-xs font-mono font-semibold uppercase text-slate-500 mb-2">
            Available Agent Skills ({MCP_TOOLS.length})
          </h3>
          <div className="space-y-1.5">
            {MCP_TOOLS.map((tool) => (
              <button
                key={tool.name}
                onClick={() => handleSelectTool(tool)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition flex flex-col gap-1 cursor-pointer ${
                  selectedTool.name === tool.name
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-[#f8fafc] border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{tool.name}</span>
                  <span className="text-[10px] text-slate-400">skill</span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans line-clamp-1">
                  {tool.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Payload & Output Console */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-700">
                POST /api/tools/{selectedTool.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleExecute}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#188049] hover:bg-[#156d3e] text-white font-medium rounded-xl text-xs font-mono shadow-xs transition cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      Execute Tool
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={payloadStr}
              onChange={(e) => setPayloadStr(e.target.value)}
              rows={7}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-900 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold uppercase text-slate-500">
                JSON-RPC Execution Result
              </span>
              {toolResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[#188049] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  200 OK
                </span>
              )}
            </div>

            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-800 max-h-72 overflow-y-auto leading-relaxed">
              {toolResult ? (
                <pre>{JSON.stringify(toolResult, null, 2)}</pre>
              ) : (
                <span className="text-slate-400">Click &quot;Execute Tool&quot; to test tool invocation...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
