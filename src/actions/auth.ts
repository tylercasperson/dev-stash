'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { EMAIL_VERIFICATION_ENABLED } from '@/lib/flags';
import { checkRateLimit, loginLimiter, rateLimitMessage } from '@/lib/rate-limit';

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const { allowed, reset } = await checkRateLimit(loginLimiter, `login:${ip}:${email}`);
  if (!allowed) return { error: rateLimitMessage(reset) };

  if (EMAIL_VERIFICATION_ENABLED) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true, emailVerified: true },
    });

    if (user?.password && !user.emailVerified) {
      return { error: 'EMAIL_NOT_VERIFIED' };
    }
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password' };
    }
    throw error;
  }
}

export async function signInWithGitHub() {
  await signIn('github', { redirectTo: '/dashboard' });
}

export async function signOutUser() {
  await signOut({ redirectTo: '/sign-in' });
}
