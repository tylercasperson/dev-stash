import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { getItemById } from '@/lib/db/items';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const item = await getItemById(userId, id);
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}
