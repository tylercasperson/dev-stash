import { NextRequest, NextResponse } from 'next/server';
import { getItemById } from '@/lib/db/items';
import { getFromR2 } from '@/lib/r2';
import { requireApiSession } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const itemId = req.nextUrl.searchParams.get('itemId');
  if (!itemId) {
    return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
  }

  const item = await getItemById(userId, itemId);
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
