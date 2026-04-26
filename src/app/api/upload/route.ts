import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { auth } from '@/auth';
import { uploadToR2 } from '@/lib/r2';
import { validateFile } from '@/lib/files';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const validation = validateFile(file.type, file.size);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
  const key = `${session.user.id}/${randomUUID()}${ext ? `.${ext}` : ''}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadToR2(buffer, key, file.type);

  return NextResponse.json({ url, fileName: file.name, fileSize: file.size });
}
