import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getIp, resetPasswordLimiter, tooManyRequests } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, reset } = await checkRateLimit(resetPasswordLimiter, `reset-password:${ip}`);
  if (!allowed) return tooManyRequests(reset);

  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 });
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ success: false, error: 'Password must be between 8 and 128 characters' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({ where: { token } });

    if (!record || !record.identifier.startsWith('reset:')) {
      return NextResponse.json({ success: false, error: 'invalid_token' }, { status: 400 });
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ success: false, error: 'token_expired' }, { status: 400 });
    }

    const email = record.identifier.replace('reset:', '');

    const user = await prisma.user.findUnique({ where: { email }, select: { password: true } });

    if (user?.password) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        return NextResponse.json({ success: false, error: 'New password must be different from your current password' }, { status: 400 });
      }
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashed, passwordChangedAt: new Date() },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
