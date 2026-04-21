import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { EMAIL_VERIFICATION_ENABLED } from '@/lib/flags';
import { checkRateLimit, getIp, registerLimiter, tooManyRequests } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, reset } = await checkRateLimit(registerLimiter, `register:${ip}`);
  if (!allowed) return tooManyRequests(reset);

  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 });
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ success: false, error: 'Password must be between 8 and 128 characters' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    if (EMAIL_VERIFICATION_ENABLED) {
      const user = await prisma.user.create({
        data: { name, email, password: hashed },
        select: { id: true, name: true, email: true },
      });

      const token = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.verificationToken.create({
        data: { identifier: email, token, expires },
      });

      await sendVerificationEmail(email, token);

      return NextResponse.json({ success: true, data: user }, { status: 201 });
    } else {
      const user = await prisma.user.create({
        data: { name, email, password: hashed, emailVerified: new Date() },
        select: { id: true, name: true, email: true },
      });

      return NextResponse.json({ success: true, data: user, verified: true }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
