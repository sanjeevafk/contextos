export type SourceType = 'slack' | 'github_pr' | 'github_commit' | 'jira' | 'docs' | 'incident';

export interface SourceReference {
  id: string;
  sourceType: SourceType;
  title: string;
  url?: string;
  author?: string;
  timestamp?: string;
  snippet?: string;
  score?: number;
}

export interface KnowledgeItem {
  id: string;
  type: SourceType;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  service?: string;
  customer?: string;
  incidentId?: string;
  prNumber?: number;
  commitHash?: string;
  url?: string;
  tags: string[];
  relations?: {
    causes?: string[];
    causedBy?: string[];
    affects?: string[];
    resolves?: string[];
    discussedIn?: string[];
    relatedTo?: string[];
    precedes?: string[];
  };
  metadata?: Record<string, any>;
}

export interface GraphNode {
  id: string;
  label: string;
  subLabel?: string;
  type: SourceType | 'customer' | 'service' | 'root_cause' | 'memory';
  status?: 'failure' | 'fix' | 'info' | 'critical' | 'memory';
  sourceId?: string;
  icon?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'caused' | 'affected' | 'discussed_in' | 'resolved_by' | 'recurred_from' | 'referenced_in' | 'protects';
}

export interface EvidenceGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AgentStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  tool: 'intent_parser' | 'search_knowledge' | 'get_source' | 'find_related' | 'graph_builder' | 'reasoning_engine' | 'memory_extractor' | 'search_memory';
  status: 'pending' | 'running' | 'completed' | 'skipped';
  durationMs?: number;
  sourcesFound?: number;
  details?: Record<string, any>;
}

export interface ProposedMemory {
  title: string;
  rootCause: string;
  affectedService: string;
  affectedCustomer: string;
  relatedIncidents: string[];
  resolution: string;
  safeguards: string[];
  sourceReferences: SourceReference[];
  tags: string[];
}

export interface CompanyMemory extends ProposedMemory {
  id: string;
  createdAt: string;
  updatedAt?: string;
  version: number;
  createdBy: string;
  status: 'active' | 'archived';
  reuseCount: number;
}

export interface InvestigationResult {
  query: string;
  isMemoryHit: boolean;
  retrievedMemory?: CompanyMemory;
  executiveAnswer: string;
  rootCause: string;
  impact: string;
  resolution: string;
  hasHappenedBefore: {
    occurred: boolean;
    details: string;
    historicalIncidents: string[];
  };
  confidenceScore: number; // e.g. 98%
  confidenceBreakdown: {
    sourcesCrossReferenced: number;
    timelineCorrelationScore: number;
    graphCoherenceScore: number;
  };
  citations: SourceReference[];
  evidenceGraph: EvidenceGraph;
  proposedMemory?: ProposedMemory;
  persistedMemoryId?: string;
  steps: AgentStep[];
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}
