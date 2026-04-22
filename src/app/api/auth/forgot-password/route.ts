import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit, getIp, forgotPasswordLimiter, tooManyRequests } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, reset } = await checkRateLimit(forgotPasswordLimiter, `forgot-password:${ip}`);
  if (!allowed) return tooManyRequests(reset);

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid leaking whether an email exists
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // GitHub OAuth-only users have no password; send a generic success without emailing
    if (!user.password) {
      return NextResponse.json({ success: true });
    }

    // Remove any existing reset token for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: `reset:${email}` },
    });

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: { identifier: `reset:${email}`, token, expires },
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
