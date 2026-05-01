import { auth } from '@/auth';
import type { ZodError } from 'zod';
import type { ActionResult } from '@/types/actions';

export async function requireSession(): Promise<ActionResult<{ id: string; isPro: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };
  return { success: true, data: { id: session.user.id, isPro: session.user.isPro ?? false } };
}

export function zodError(err: ZodError): ActionResult<never> {
  return { success: false, error: err.issues.map((e) => e.message).join(', ') };
}
