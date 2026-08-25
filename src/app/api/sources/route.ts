import { NextRequest, NextResponse } from 'next/server';
import { hybridEngine } from '@/lib/hybridRetrieval';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const q = searchParams.get('q');

    if (id) {
      const item = hybridEngine.getById(id);
      if (!item) return NextResponse.json({ error: 'Source not found' }, { status: 404 });
      return NextResponse.json({ source: item });
    }

    if (q) {
      const searchRes = hybridEngine.search({
        query: q,
        sourceTypes: type ? [type] : undefined,
        limit: 20
      });
      return NextResponse.json({ sources: searchRes });
    }

    let all = hybridEngine.getAll();
    if (type) {
      all = all.filter((item) => item.type === type);
    }

    return NextResponse.json({ sources: all });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
