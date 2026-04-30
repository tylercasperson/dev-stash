import type { ActionResult } from '@/types/actions';

export function handleAIError(err: unknown): ActionResult<never> {
  const message = err instanceof Error ? err.message : '';
  if (message.includes('insufficient_quota') || message.includes('billing'))
    return { success: false, error: 'AI service is temporarily unavailable. Please try again later.' };
  if (message.includes('rate_limit'))
    return { success: false, error: 'AI rate limit reached. Please try again in a moment.' };
  if (message.includes('invalid_api_key') || message.includes('authentication'))
    return { success: false, error: 'AI service configuration error. Please contact support.' };
  return { success: false, error: 'AI service error. Please try again.' };
}
