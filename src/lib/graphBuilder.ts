import { EvidenceGraph, GraphNode, GraphEdge, SourceReference } from '../types';
import { ENTERPRISE_KNOWLEDGE_BASE } from '../data/enterpriseData';

export function buildEvidenceGraph(retrievedSources: SourceReference[]): EvidenceGraph {
  const nodes: GraphNode[] = [
    {
      id: 'node-pr-9281',
      label: 'PR #9281',
      subLabel: 'Lowered timeout to 800ms',
      type: 'github_pr',
      status: 'failure',
      sourceId: 'github-pr-9281',
      icon: 'GitPullRequest'
    },
    {
      id: 'node-inc-1842',
      label: 'Incident INC-1842',
      subLabel: 'P0 504 Outage (May 14)',
      type: 'jira',
      status: 'critical',
      sourceId: 'jira-inc-1842',
      icon: 'AlertTriangle'
    },
    {
      id: 'node-acme',
      label: 'Acme Corp',
      subLabel: 'On-prem Chase proxy (1450ms P99)',
      type: 'customer',
      status: 'info',
      sourceId: 'doc-pay-042',
      icon: 'Building2'
    },
    {
      id: 'node-slack',
      label: '#incident-war-room',
      subLabel: 'Real-time root cause triage',
      type: 'slack',
      status: 'info',
      sourceId: 'slack-inc-1842-1',
      icon: 'MessageSquare'
    },
    {
      id: 'node-commit-abc',
      label: 'Commit abc123d',
      subLabel: 'Hotfix: 3000ms tenant override',
      type: 'github_commit',
      status: 'fix',
      sourceId: 'github-commit-abc123d',
      icon: 'GitCommit'
    },
    {
      id: 'node-inc-1631',
      label: 'Incident INC-1631',
      subLabel: 'Sep 2023 Recurrence (Duplicate Cause)',
      type: 'incident',
      status: 'critical',
      sourceId: 'jira-inc-1631',
      icon: 'History'
    }
  ];

  const edges: GraphEdge[] = [
    {
      id: 'edge-pr-to-inc',
      source: 'node-pr-9281',
      target: 'node-inc-1842',
      label: 'caused',
      type: 'caused'
    },
    {
      id: 'edge-inc-to-acme',
      source: 'node-inc-1842',
      target: 'node-acme',
      label: 'affected',
      type: 'affected'
    },
    {
      id: 'edge-acme-to-slack',
      source: 'node-acme',
      target: 'node-slack',
      label: 'discussed in',
      type: 'discussed_in'
    },
    {
      id: 'edge-slack-to-commit',
      source: 'node-slack',
      target: 'node-commit-abc',
      label: 'resolved by',
      type: 'resolved_by'
    },
    {
      id: 'edge-inc-to-hist',
      source: 'node-inc-1842',
      target: 'node-inc-1631',
      label: 'recurred from',
      type: 'recurred_from'
    }
  ];

  return { nodes, edges };
}
