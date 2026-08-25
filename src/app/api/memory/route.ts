import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/memoryStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const service = searchParams.get('service') || undefined;

    if (query) {
      const results = memoryStore.search(query, service);
      return NextResponse.json({ memories: results.map((r) => r.memory) });
    }

    const all = memoryStore.getAll();
    return NextResponse.json({ memories: all });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposedMemory, author } = body;

    if (!proposedMemory || !proposedMemory.title || !proposedMemory.rootCause) {
      return NextResponse.json({ error: 'Valid proposedMemory object is required' }, { status: 400 });
    }

    const memory = memoryStore.create(proposedMemory, author || 'ContextOS Operator');
    return NextResponse.json({ success: true, memory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    memoryStore.reset();
    return NextResponse.json({ success: true, message: 'Memories reset to baseline' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
