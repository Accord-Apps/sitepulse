import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid website URL.' },
        { status: 400 }
      );
    }

    const audit = await runAudit(url);
    return NextResponse.json(audit);
  } catch (error: unknown) {
    console.error('Audit failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to audit the website.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'Query parameter "url" is required.' },
      { status: 400 }
    );
  }

  try {
    const audit = await runAudit(url);
    return NextResponse.json(audit);
  } catch (error: unknown) {
    console.error('Audit failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to audit the website.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
