import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import type { Session } from 'next-auth';

type AuthedSession = NonNullable<Session> & { user: NonNullable<Session['user']> & { id: string } };

export async function requireApiSession(): Promise<
  { session: AuthedSession; userId: string } | NextResponse
> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { session: session as AuthedSession, userId: session.user.id };
}

export function apiError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function validatePasswordInput(
  password: string,
  confirmPassword: string,
): NextResponse | null {
  if (password !== confirmPassword) {
    return NextResponse.json(
      { success: false, error: 'Passwords do not match' },
      { status: 400 },
    );
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json(
      { success: false, error: 'Password must be between 8 and 128 characters' },
      { status: 400 },
    );
  }
  return null;
}
