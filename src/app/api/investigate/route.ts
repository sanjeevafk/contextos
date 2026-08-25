import { NextRequest, NextResponse } from 'next/server';
import { agentEngine } from '@/lib/agentEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const result = await agentEngine.investigate(query);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error during investigation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete investigation' },
      { status: 500 }
    );
  }
}
