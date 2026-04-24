import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getItemById } from '@/lib/db/items';
import { getFromR2 } from '@/lib/r2';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const itemId = req.nextUrl.searchParams.get('itemId');
  if (!itemId) {
    return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
  }

  const item = await getItemById(session.user.id, itemId);
  if (!item?.fileUrl) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const file = await getFromR2(item.fileUrl);
  if (!file) {
    return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
  }

  const buf = Buffer.from(file.bytes);
  return new NextResponse(buf, {
    headers: {
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${item.fileName ?? 'download'}"`,
      'Content-Length': String(buf.length),
    },
  });
}
