'use server';

import { auth } from '@/auth';
import { getOpenAIClient, AI_MODEL } from '@/lib/openai';
import { aiLimiter, checkRateLimit, rateLimitMessage } from '@/lib/rate-limit';

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function generateAutoTags(
  title: string,
  content: string | null,
): Promise<ActionResult<string[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!session.user.isPro) {
      return { success: false, error: 'AI auto-tagging requires DevStash Pro.' };
    }

    const { allowed, reset } = await checkRateLimit(aiLimiter, `ai:${session.user.id}`);
    if (!allowed) {
      return { success: false, error: rateLimitMessage(reset) };
    }

    const truncated = (content ?? '').slice(0, 2000);
    const input = `Title: ${title}\nContent: ${truncated}`;

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: AI_MODEL,
      instructions:
        'You are a developer tool assistant. Analyze the given item title and content, then return 3-5 concise, relevant tags. Return JSON in the format {"tags": ["tag1","tag2",...]}. Tags should be lowercase, use hyphens instead of spaces, and be relevant to the content.',
      input,
      text: {
        format: { type: 'json_object' },
      },
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(response.output_text);
    } catch {
      return { success: false, error: 'AI returned invalid response. Please try again.' };
    }

    let tags: unknown[];
    if (Array.isArray(parsed)) {
      tags = parsed;
    } else if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'tags' in parsed &&
      Array.isArray((parsed as Record<string, unknown>).tags)
    ) {
      tags = (parsed as Record<string, unknown[]>).tags;
    } else {
      return { success: false, error: 'AI returned unexpected format. Please try again.' };
    }

    const normalized = tags
      .filter((t): t is string => typeof t === 'string')
      .map((t) => t.toLowerCase().trim())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    return { success: true, data: normalized };
  } catch (err) {
    const message = err instanceof Error ? err.message : '';

    if (message.includes('insufficient_quota') || message.includes('billing')) {
      return { success: false, error: 'AI service is temporarily unavailable. Please try again later.' };
    }
    if (message.includes('rate_limit')) {
      return { success: false, error: 'AI rate limit reached. Please try again in a moment.' };
    }
    if (message.includes('invalid_api_key') || message.includes('authentication')) {
      return { success: false, error: 'AI service configuration error. Please contact support.' };
    }

    return { success: false, error: 'AI service error. Please try again.' };
  }
}
