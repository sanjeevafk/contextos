# ContextOS: Agent-Native Enterprise Memory Layer

> **The Great Agent Hackathon by Freshworks**  
> **Track 2:** Platform Agent Skills & Knowledge  
> **Inspiration:** Architecturally inspired by the *"Single Retrieval Layer"* paradigm in Cerebras' internal knowledge base, extended into a **bidirectional, agent-native write-back memory layer**.

---

## 🎯 Architectural Lineage & Problem Thesis

### 1. The Cerebras Blueprint: "The Single Retrieval Layer"
As outlined in Cerebras' architecture (*"How We Built Our Knowledge Base"*), forcing enterprise teams to migrate knowledge into a centralized wiki consistently fails in practice. Engineers and operators naturally create knowledge across distributed operational tools:
- **Slack**: Ephemeral triage threads and war-room root causes.
- **GitHub**: Pull requests, commit logs, and architectural trade-offs.
- **Jira**: Incident timelines, P0 post-mortems, and customer SLA impacts.
- **Confluence / Docs**: System architecture and customer exception matrices.

Cerebras addressed this by building a unified, permission-aware retrieval layer directly over existing tools rather than forcing data migration.

### 2. The Next Evolution: From Passive Retrieval to Agentic Memory
While Cerebras built a high-performance **read-only retrieval engine**, enterprise operations suffer from an amnesiac loop: an AI agent investigates an outage, uncovers the root cause, answers the question, and **forgets everything as soon as the session closes.** Months later, another engineer makes the identical config change, triggering the exact same customer outage.

**ContextOS closes this loop by adding persistent, agent-curated organizational memory:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           THE CONTEXTOS LOOP                            │
│                                                                         │
│  RETRIEVE ──▶ INVESTIGATE ──▶ REASON ──▶ CREATE MEMORY ──▶ REUSE MEMORY │
│   (Cerebras    (Multi-Hop     (Causality   (Persistent    (Proactive    │
│    Pattern)     Graph)         Engine)      Write-Back)    Guardrail)   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Why ContextOS is Agentic (Not a Conventional RAG Chatbot)

| Dimension | Conventional RAG | Cerebras Single Retrieval Layer | ContextOS Agentic Memory Layer |
|---|---|---|---|
| **Data Topology** | Single vector store | Multi-source connectors (Slack, GitHub, Jira, Docs) | Unified multi-source connectors + dynamic causality graph |
| **Search Strategy** | Keyword or basic embedding | Hybrid search (Vector + BM25 + IDF + Recency) | Hybrid retrieval + entity boosting + graph traversal |
| **Agent Action Space** | Single prompt-response | Read-only tool calls | **Bidirectional tool skills** (`search_knowledge`, `get_source`, `find_related`, `investigate`, `create_memory`, `search_memory`) |
| **Lifecycle State** | Ephemeral, read-only | Ephemeral query sessions | **Persistent organizational memory**: Turns transient findings into versioned guardrails |
| **Preventative Action** | None (reactive only) | Informational answers | **Pre-emptive change interception**: Queries memory first before dangerous configuration modifications |
| **Protocol** | Proprietary wrappers | Internal API endpoints | **Model Context Protocol (MCP)** JSON-RPC 2.0 schemas |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ContextOS Web Workspace                       │
│     [ Investigation Lab ]  [ Memory Hub ]  [ Sources Explorer ] [ MCP ] │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ContextOS Agent Engine                          │
│                                                                         │
│  1. Intent & Entity Parser    ──▶  Customer, Service, Temporal scope   │
│  2. Hybrid Retrieval Engine   ──▶  BM25 Lexical + Dense Semantic N-Gram│
│  3. Graph Relationship Builder──▶  Causality & Cross-Source Edges      │
│  4. Reasoning & Synthesis     ──▶  Multi-Source Root Cause & Recurrence│
│  5. Institutional Extractor   ──▶  Structured Safeguard Formulations   │
└──────────────────┬──────────────────────────────────┬───────────────────┘
                   │                                  │
                   ▼                                  ▼
┌──────────────────────────────────────┐ ┌────────────────────────────────┐
│      Enterprise Sources Corpus       │ │   Persistent Company Memory    │
│  • Slack War-Room Threads            │ │  • File-backed JSON / pgvector │
│  • GitHub PRs & Commit Diffs         │ │  • Versioned Safeguards Matrix │
│  • Jira P0 / P1 Incident Tickets     │ │  • Reuse & Invocation Tracking │
│  • Confluence Architecture Specs     │ │  • Tenant Override Guardrails  │
└──────────────────────────────────────┘ └────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Dynamic API Routes)
- **Language**: TypeScript (End-to-End type safety)
- **Styling**: Tailwind CSS (Restrained enterprise dark theme, high information density)
- **Icons**: Lucide React
- **Retrieval Engine**: Hybrid Retrieval Engine (BM25 keyword scoring + dense semantic vector simulation + tenant/service metadata boosting)
- **Agent Orchestration**: Native modular agent skills exposing REST & MCP endpoints
- **Persistence**: File-backed atomic memory store (`data/memories.json`)
- **Protocol**: Model Context Protocol (MCP) JSON-RPC 2.0 compatible tool schemas

---

## 🚀 Live Demo Walkthrough

### 1. Step 1 (First Query: Scattered Root Cause Investigation)
1. Navigate to the **Investigation Lab** at [http://localhost:3000](http://localhost:3000).
2. Click the preset query:
   ```
   "Why did Acme's payment deployment fail last month, and has this happened before?"
   ```
3. Observe the live **Agent Execution Timeline**:
   - `intent_parser`: Extracts entity `Acme Corp`, domain `payment-orchestrator`, and historical recurrence flag.
   - `search_knowledge (Jira)`: Finds P0 incident `INC-1842` (May 14, 2024) and prior `INC-1631`.
   - `search_knowledge (GitHub)`: Discovers `PR #9281` (reduced timeout to 800ms) and hotfix commit `abc123d`.
   - `search_knowledge (Slack)`: Parses `#incident-war-room` discussion highlighting Acme's Chase Paymentech 1450ms P99 SLA.
   - `search_knowledge (Docs)`: Pulls `DOC-PAY-042` and `RUNBOOK-PAY-003`.
   - `graph_builder`: Connects the 6-node causality graph.
   - `reasoning_engine`: Correlates multi-hop evidence and calculates 98.8% verification score.
4. Review the **Executive Answer & Evidence Graph**:
   - Root cause: PR #9281 reduced timeout to 800ms, clipping Acme's 1450ms on-premise proxy.
   - Recurrence: Highlights duplicate incident `INC-1631` from September 2023!
5. Inspect any source by clicking nodes or citation cards to view the raw payload in the **Slide-Over Drawer**.

### 2. Step 2 (Creating Institutional Memory)
1. Below the evidence graph, observe the **"Candidate Organizational Memory"** card detected by the agent.
2. Click **"Save to Company Memory"**.
3. ContextOS persists the record with unique ID `MEM-PAYMENT-002`, saving the root cause, resolution, and mandatory safeguards.

### 3. Step 3 (Second Query: Proactive Memory Retrieval)
1. Click **"Run Step 2 Query"** or ask:
   ```
   "What should I know before changing Acme's payment configuration?"
   ```
2. ContextOS executes the **Memory-First Retrieval Loop**:
   - Queries `search_memory` first.
   - Discovers `MEM-PAYMENT-002`.
   - Proactively delivers the exact safeguards: *"You MUST maintain a minimum webhook timeout SLA of 3000ms (minimum floor: 2500ms)..."*
   - Prevents the outage before code is even merged!

---

## 🔌 Exposed MCP Tools & Skills

ContextOS exposes its agent capabilities as standard Model Context Protocol (MCP) tools at `/api/tools/[tool]`:

| Tool Name | Parameters | Description |
|---|---|---|
| `search_knowledge` | `query`, `sourceTypes`, `limit` | Hybrid search across Slack, GitHub, Jira, and Confluence docs |
| `get_source` | `sourceId` | Fetch full metadata and raw content of an enterprise artifact |
| `find_related` | `entityId` | Traverse graph cross-references from a given entity or incident ID |
| `investigate` | `query` | Autonomous multi-step investigation orchestrator across enterprise sources |
| `create_memory` | `proposedMemory`, `author` | Persist a verified institutional memory record into the organizational memory graph |
| `search_memory` | `query` | Query existing persistent organizational memories to prevent repeated outages |

Inspect live schemas at `/api/tools/schemas` or use the interactive **MCP Tools** console in the application.

---

## 💻 Local Setup & Running

```bash
cd /home/sanjeev/contextos
npm install
npm run build
npm run start
```

---

## ⚖️ Limitations & Stage-2 Roadmap

1. **Bi-Directional Freshworks Ecosystem Connectors**: Direct Freshservice and Freshdesk app integrations to automatically turn resolved support tickets into ContextOS memory cards.
2. **Automated CI/CD Guardrails**: GitHub Actions bot that intercepts PRs modifying service configs and automatically queries ContextOS for institutional guardrail violations before merging.
3. **Enterprise RBAC & Departmental Memory Partitions**: Tenant-level isolation for Finance, SRE, Product, and Legal memory pools with fine-grained access control.
4. **Active Slack Bot Agent**: Slack bot that listens in incident war-rooms and prompts SREs with: *"Incident resolved. Would you like ContextOS to turn this post-mortem into a Company Memory?"*
