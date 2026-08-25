import { KnowledgeItem } from '../types';

export const ENTERPRISE_KNOWLEDGE_BASE: KnowledgeItem[] = [
  // ─── SLACK MESSAGES ───
  {
    id: 'slack-inc-1842-1',
    type: 'slack',
    title: '#incident-war-room: Alert - Acme 504 Gateway Outage',
    author: 'PagerDuty Bot',
    timestamp: '2024-05-14T14:15:22Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1842',
    url: 'slack://channel/C0492810/p1715696122',
    tags: ['alert', 'p0', 'acme', '504-timeout', 'incident'],
    content: `🚨 [P0 ALERT] payment-orchestrator: 100% 504 Gateway Timeout spike detected on tenant cust_acme_prod.
Triggered immediately following production release v2.41.0 (deploy job #4481).
Checkout failure rate: 100%. Affected customer: Acme Corp.
War room channel created: #incident-war-room-acme-may14`,
    relations: {
      causes: ['INC-1842'],
      affects: ['Acme Corp', 'payment-orchestrator'],
      discussedIn: ['#incident-war-room']
    },
    metadata: {
      channel: '#incident-war-room',
      threadId: 't-1715696122',
      reactions: ['eyes:5', 'fire:8']
    }
  },
  {
    id: 'slack-inc-1842-2',
    type: 'slack',
    title: '#incident-war-room: SRE investigation on PR #9281',
    author: 'Sarah Chen (Staff SRE)',
    timestamp: '2024-05-14T14:22:04Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1842',
    prNumber: 9281,
    url: 'slack://channel/C0492810/p1715696524',
    tags: ['investigation', 'pr-9281', 'timeout', 'sre'],
    content: `Found the trigger in release v2.41.0. PR #9281 (Optimize payment-orchestrator webhook worker timeouts) merged today lowered the default webhook connection timeout from 5000ms down to 800ms globally across all tenant requests.`,
    relations: {
      causedBy: ['PR-9281'],
      causes: ['INC-1842'],
      relatedTo: ['PR-9281', 'INC-1842']
    },
    metadata: {
      channel: '#incident-war-room',
      threadId: 't-1715696122'
    }
  },
  {
    id: 'slack-inc-1842-3',
    type: 'slack',
    title: '#incident-war-room: Root cause confirmed - Acme Legacy Proxy SLA',
    author: 'Dave Miller (Payments Tech Lead)',
    timestamp: '2024-05-14T14:28:40Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1842',
    url: 'slack://channel/C0492810/p1715696920',
    tags: ['root-cause', 'acme', 'legacy-proxy', 'sla-mismatch'],
    content: `Wait! Acme Corp does not route through standard cloud Stripe/Adyen endpoints. Their contract routes via an on-premise Chase Paymentech banking proxy which has a known P99 response time of 1450ms.
When PR #9281 reduced the global timeout to 800ms, every single Acme checkout payload got terminated at 800ms, returning 504 to the frontend!`,
    relations: {
      causes: ['INC-1842'],
      affects: ['Acme Corp'],
      relatedTo: ['DOC-PAY-042', 'INC-1631']
    },
    metadata: {
      channel: '#incident-war-room',
      threadId: 't-1715696122'
    }
  },
  {
    id: 'slack-inc-1842-4',
    type: 'slack',
    title: '#incident-war-room: Hotfix commit abc123d deployed',
    author: 'Sarah Chen (Staff SRE)',
    timestamp: '2024-05-14T14:38:15Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1842',
    commitHash: 'abc123d',
    url: 'slack://channel/C0492810/p1715697495',
    tags: ['hotfix', 'commit-abc123d', 'mitigation', 'resolved'],
    content: `Hotfix commit abc123d is live in production! Restored Acme's tenant-specific webhook timeout override to 3000ms in config/tenant_overrides.yaml and added schema guards. Acme checkout error rate dropped back to 0.00%. Incident mitigated.`,
    relations: {
      resolves: ['INC-1842'],
      affects: ['Acme Corp'],
      causes: ['commit-abc123d']
    },
    metadata: {
      channel: '#incident-war-room',
      threadId: 't-1715696122'
    }
  },
  {
    id: 'slack-inc-1842-5',
    type: 'slack',
    title: '#incident-war-room: Recurrence flag - Previous INC-1631 link',
    author: 'Dave Miller (Payments Tech Lead)',
    timestamp: '2024-05-14T14:45:10Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1842',
    url: 'slack://channel/C0492810/p1715697910',
    tags: ['recurrence', 'inc-1631', 'post-mortem', 'institutional-memory'],
    content: `This is the SECOND time this has happened. Look at Jira INC-1631 from September 2023. During the Q3 latency initiative, another engineer reduced the global timeout and broke Acme in the exact same way.
We keep losing institutional context because tribal knowledge lives in old Slack channels and forgotten Jira tickets!`,
    relations: {
      precedes: ['INC-1631'],
      relatedTo: ['INC-1631', 'INC-1842']
    },
    metadata: {
      channel: '#incident-war-room',
      threadId: 't-1715696122'
    }
  },

  // ─── GITHUB PRS & COMMITS ───
  {
    id: 'github-pr-9281',
    type: 'github_pr',
    title: 'PR #9281: Optimize payment-orchestrator webhook worker timeouts to 800ms',
    author: 'alex-dev',
    timestamp: '2024-05-14T11:30:00Z',
    service: 'payment-orchestrator',
    prNumber: 9281,
    url: 'https://github.com/fresh-corp/payment-orchestrator/pull/9281',
    tags: ['github', 'pull-request', 'timeout-optimization', 'v2.41.0'],
    content: `## Summary of Changes
- Reduces default HTTP webhook worker timeout from 5000ms to 800ms.
- Objective: Prevent slow external gateways from tying up worker thread pools during traffic spikes.
- Impacted files: \`services/payment-orchestrator/config/timeouts.yaml\`, \`src/workers/webhook_dispatcher.py\`.

### Review Comments
@maya-eng: "Looks great for standard Stripe/Adyen gateways (P95 is ~350ms)."
@dave-lead: "Approved. Make sure tenant override matrix is checked." (Note: Override was missing in v2.41.0 branch)`,
    relations: {
      causes: ['INC-1842'],
      relatedTo: ['commit-abc123d']
    },
    metadata: {
      repo: 'fresh-corp/payment-orchestrator',
      status: 'merged',
      mergedBy: 'dave-lead',
      diffSnippet: `- default_webhook_timeout_ms: 5000\n+ default_webhook_timeout_ms: 800`
    }
  },
  {
    id: 'github-commit-abc123d',
    type: 'github_commit',
    title: 'commit abc123d: Hotfix - Restore Acme custom webhook timeout override to 3000ms (INC-1842)',
    author: 'sarah-sre',
    timestamp: '2024-05-14T14:35:00Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1842',
    commitHash: 'abc123d',
    url: 'https://github.com/fresh-corp/payment-orchestrator/commit/abc123d',
    tags: ['github', 'commit', 'hotfix', 'tenant-override', 'acme'],
    content: `commit abc123d8f990172e2938b81093129ef993a0b3
Author: Sarah Chen <sarah.chen@freshcorp.internal>
Date: Tue May 14 14:35:00 2024 +0000

    hotfix: restore Acme Corp custom webhook timeout to 3000ms (INC-1842)
    
    Acme Corp operates through a dedicated Chase Paymentech banking proxy
    with P99 latency of 1450ms. PR #9281's 800ms global timeout caused 100%
    failure rate.
    
    This commit injects explicit tenant override:
    tenant_id: cust_acme_prod -> timeout_ms: 3000

    Signed-off-by: Sarah Chen <sarah.chen@freshcorp.internal>`,
    relations: {
      resolves: ['INC-1842'],
      affects: ['Acme Corp'],
      causedBy: ['PR-9281']
    },
    metadata: {
      repo: 'fresh-corp/payment-orchestrator',
      branch: 'main',
      filesChanged: ['config/tenant_overrides.yaml', 'src/config/tenant_resolver.py']
    }
  },
  {
    id: 'github-commit-7f41a8e',
    type: 'github_commit',
    title: 'commit 7f41a8e: Tenant config override for Acme Chase proxy (INC-1631)',
    author: 'dave-lead',
    timestamp: '2023-09-18T16:20:00Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1631',
    commitHash: '7f41a8e',
    url: 'https://github.com/fresh-corp/payment-orchestrator/commit/7f41a8e',
    tags: ['github', 'historical-commit', 'inc-1631', 'tenant-override'],
    content: `commit 7f41a8ef11029487b32c918a992e104f3219aa2
Author: Dave Miller <dave.miller@freshcorp.internal>
Date: Mon Sep 18 16:20:00 2023 +0000

    fix: enforce 3000ms webhook timeout for Acme Corp banking proxy (INC-1631)
    
    Global timeout reduction during Q3 latency tuning broke Acme transactions.
    DO NOT REMOVE OR REDUCE THIS OVERRIDE BELOW 2500ms.`,
    relations: {
      resolves: ['INC-1631'],
      affects: ['Acme Corp']
    },
    metadata: {
      repo: 'fresh-corp/payment-orchestrator',
      branch: 'main'
    }
  },

  // ─── JIRA INCIDENTS ───
  {
    id: 'jira-inc-1842',
    type: 'jira',
    title: 'INC-1842: [P0] Acme Corp Payment Checkout Outage - 504 Webhook Failures',
    author: 'Sarah Chen (Staff SRE)',
    timestamp: '2024-05-14T14:18:00Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1842',
    url: 'https://freshcorp.atlassian.net/browse/INC-1842',
    tags: ['jira', 'p0', 'incident', 'acme', 'outage', 'resolved'],
    content: `**Issue Key:** INC-1842
**Severity:** P0 - Critical Outage
**Status:** Closed / Resolved
**Affected Component:** \`payment-orchestrator:webhook-dispatcher\`
**Customer:** Acme Corp (Enterprise Tier-1, Account #CUST-9821)
**Duration:** 26 minutes (14:12 UTC - 14:38 UTC)

**Executive Summary:**
At 14:12 UTC, deployment of release v2.41.0 introduced PR #9281, which dropped the global HTTP client webhook timeout from 5000ms to 800ms. Acme Corp relies on an on-premise Chase Paymentech proxy that responds in 1200ms - 1500ms. All Acme checkout webhook dispatches timed out at 800ms with HTTP 504 errors, causing a total checkout freeze.

**Resolution:**
Emergency hotfix commit \`abc123d\` deployed at 14:38 UTC, restoring tenant override \`cust_acme_prod: 3000ms\`.

**Historical Recurrence Link:**
Duplicate of \`INC-1631\` (resolved Sep 18, 2023).

**Action Items:**
1. Prevent global timeout changes from overriding custom tenant SLA tables.
2. Store institutional memory regarding Acme custom rail requirements in ContextOS.`,
    relations: {
      causedBy: ['PR-9281'],
      resolves: ['INC-1842'],
      affects: ['Acme Corp'],
      precedes: ['INC-1631'],
      discussedIn: ['#incident-war-room']
    },
    metadata: {
      priority: 'P0',
      resolutionTimeMinutes: 26,
      slaImpact: '99.4% monthly SLA hit'
    }
  },
  {
    id: 'jira-inc-1631',
    type: 'jira',
    title: 'INC-1631: [P1] Acme Payment Processing Timeout during Q3 latency tuning',
    author: 'Dave Miller (Payments Tech Lead)',
    timestamp: '2023-09-18T15:40:00Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    incidentId: 'INC-1631',
    url: 'https://freshcorp.atlassian.net/browse/INC-1631',
    tags: ['jira', 'p1', 'historical-incident', 'acme', 'timeout'],
    content: `**Issue Key:** INC-1631
**Severity:** P1 - Major Degradation
**Status:** Closed / Resolved
**Date:** Sep 18, 2023
**Affected Customer:** Acme Corp

**Root Cause:**
Global payment worker timeout was reduced to 1000ms. Acme's legacy banking partner requires 1450ms P99 latency window.

**Mandatory Safeguard / Post-Mortem Rule:**
"Acme Corp requires a dedicated minimum 2500ms webhook SLA timeout due to legacy core banking settlement proxy. Never lower Acme's timeout or global fallback without enterprise tenant verification."`,
    relations: {
      affects: ['Acme Corp'],
      resolves: ['INC-1631']
    },
    metadata: {
      priority: 'P1',
      date: '2023-09-18'
    }
  },

  // ─── INTERNAL DOCUMENTATION (CONFLUENCE / ARCHITECTURE) ───
  {
    id: 'doc-pay-042',
    type: 'docs',
    title: 'DOC-PAY-042: Enterprise Tenant Gateway Overrides & Webhook SLAs',
    author: 'Architecture Team',
    timestamp: '2024-01-10T10:00:00Z',
    service: 'payment-orchestrator',
    customer: 'Acme Corp',
    url: 'https://wiki.freshcorp.internal/display/PAY/DOC-PAY-042',
    tags: ['confluence', 'architecture', 'tenant-sla', 'webhook-timeout', 'acme'],
    content: `# DOC-PAY-042: Enterprise Tenant Gateway Overrides & Webhook SLAs

## Overview
Standard SaaS customers route payments through direct REST API connections to Stripe and Adyen (P99 latency < 400ms, standard timeout 800ms).

## Enterprise Customer Exception Matrix
| Tenant ID | Customer | Payment Gateway Proxy | Min SLA Timeout | Safe Config Threshold |
|---|---|---|---|---|
| \`cust_acme_prod\` | Acme Corp | Chase Paymentech On-Prem Proxy | 1450ms (P99) | **3000ms** |
| \`cust_globex_corp\` | Globex | First Data Custom Gateway | 950ms (P99) | 2000ms |
| \`default\` | All Standard Tenants | Stripe / Adyen Direct | 350ms (P95) | 800ms |

### Critical Rule for Payments Engineers
Any configuration change to \`payment-orchestrator\` timeouts MUST preserve tenant-level overrides. If tenant overrides are bypassed, Acme Corp will experience 100% 504 checkout failures.`,
    relations: {
      affects: ['Acme Corp', 'payment-orchestrator'],
      relatedTo: ['INC-1842', 'INC-1631']
    },
    metadata: {
      space: 'PAY',
      lastReviewed: '2024-04-01'
    }
  },
  {
    id: 'doc-runbook-pay',
    type: 'docs',
    title: 'RUNBOOK-PAY-003: Payment Orchestrator Release & Config Change Protocol',
    author: 'SRE Team',
    timestamp: '2024-02-15T09:30:00Z',
    service: 'payment-orchestrator',
    url: 'https://wiki.freshcorp.internal/display/RUN/RUNBOOK-PAY-003',
    tags: ['runbook', 'deployments', 'safeguards', 'payment-orchestrator'],
    content: `# RUNBOOK-PAY-003: Payment Orchestrator Release & Config Change Protocol

## Pre-Deployment Verification Checklist
1. Verify database migration idempotency.
2. Check tenant override compatibility:
   - Run \`scripts/verify_tenant_sla.py\` to ensure no legacy banking proxy timeouts are clipped.
3. Query ContextOS / Organizational Memory for historical customer incident guardrails.
4. Canary release to 5% internal traffic before promoting to Enterprise tier tenants.`,
    relations: {
      relatedTo: ['DOC-PAY-042']
    },
    metadata: {
      space: 'RUN',
      tier: 'Tier-0 Service'
    }
  }
];
