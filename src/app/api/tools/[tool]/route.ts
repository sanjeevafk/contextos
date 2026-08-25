import { NextRequest, NextResponse } from 'next/server';
import { agentEngine } from '@/lib/agentEngine';

const TOOL_DEFINITIONS = [
  {
    name: 'search_knowledge',
    description: 'Hybrid search across Slack, GitHub, Jira, and Confluence docs with BM25 + semantic similarity',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or query string' },
        sourceTypes: { type: 'array', items: { type: 'string' }, description: 'Filters like ["jira", "slack", "github_pr"]' },
        limit: { type: 'number', description: 'Max items to return' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_source',
    description: 'Fetch full metadata and raw content of an enterprise artifact by ID',
    parameters: {
      type: 'object',
      properties: {
        sourceId: { type: 'string', description: 'Unique identifier of the source (e.g. jira-inc-1842)' }
      },
      required: ['sourceId']
    }
  },
  {
    name: 'find_related',
    description: 'Traverse graph cross-references from a given entity or incident ID',
    parameters: {
      type: 'object',
      properties: {
        entityId: { type: 'string', description: 'Source ID to expand graph relations from' }
      },
      required: ['entityId']
    }
  },
  {
    name: 'investigate',
    description: 'Autonomous multi-step investigation orchestrator across enterprise sources with memory synthesis',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The natural language investigation prompt' }
      },
      required: ['query']
    }
  },
  {
    name: 'create_memory',
    description: 'Persist a verified institutional memory record into the organizational memory graph',
    parameters: {
      type: 'object',
      properties: {
        proposedMemory: { type: 'object', description: 'Structured memory object with root cause, safeguards, citations' }
      },
      required: ['proposedMemory']
    }
  },
  {
    name: 'search_memory',
    description: 'Query existing persistent organizational memories to prevent repeated outages',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query for institutional knowledge' }
      },
      required: ['query']
    }
  }
];

export async function GET(
  req: NextRequest,
  { params }: { params: { tool: string } }
) {
  const toolName = params.tool;

  if (toolName === 'list' || toolName === 'schemas') {
    return NextResponse.json({
      mcpVersion: '1.0',
      namespace: 'contextos',
      tools: TOOL_DEFINITIONS
    });
  }

  const def = TOOL_DEFINITIONS.find((t) => t.name === toolName);
  if (!def) {
    return NextResponse.json({ error: `Tool ${toolName} not found` }, { status: 404 });
  }

  return NextResponse.json({ tool: def });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { tool: string } }
) {
  const toolName = params.tool;

  try {
    const body = await req.json();
    const args = body.arguments || body;

    switch (toolName) {
      case 'search_knowledge': {
        const results = await agentEngine.search_knowledge(args.query, args.sourceTypes, args.limit);
        return NextResponse.json({ success: true, result: results });
      }
      case 'get_source': {
        const result = await agentEngine.get_source(args.sourceId);
        return NextResponse.json({ success: true, result });
      }
      case 'find_related': {
        const result = await agentEngine.find_related(args.entityId);
        return NextResponse.json({ success: true, result });
      }
      case 'investigate': {
        const result = await agentEngine.investigate(args.query);
        return NextResponse.json({ success: true, result });
      }
      case 'create_memory': {
        const result = await agentEngine.create_memory(args.proposedMemory, args.author);
        return NextResponse.json({ success: true, result });
      }
      case 'search_memory': {
        const result = await agentEngine.search_memory(args.query);
        return NextResponse.json({ success: true, result });
      }
      default:
        return NextResponse.json({ error: `Tool ${toolName} is not implemented` }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
