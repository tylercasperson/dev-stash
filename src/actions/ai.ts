'use server';

import { getOpenAIClient, AI_MODEL } from '@/lib/openai';
import { aiLimiter, checkRateLimit, rateLimitMessage } from '@/lib/rate-limit';
import { handleAIError } from '@/lib/ai-error';
import { requireSession } from '@/lib/action-utils';
import type { ActionResult } from '@/types/actions';

export async function generateAutoTags(
  title: string,
  content: string | null,
): Promise<ActionResult<string[]>> {
  try {
    const s = await requireSession();
    if (!s.success) return s;

    if (!s.data.isPro) {
      return { success: false, error: 'AI auto-tagging requires DevStash Pro.' };
    }

    const { allowed, reset } = await checkRateLimit(aiLimiter, `ai:${s.data.id}`);
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
    return handleAIError(err);
  }
}

interface ExplainCodeInput {
  code: string;
  language?: string | null;
}

export async function explainCode(input: ExplainCodeInput): Promise<ActionResult<string>> {
  try {
    const s = await requireSession();
    if (!s.success) return s;

    if (!s.data.isPro) {
      return { success: false, error: 'AI code explanation requires DevStash Pro.' };
    }

    const { allowed, reset } = await checkRateLimit(aiLimiter, `ai:${s.data.id}`);
    if (!allowed) {
      return { success: false, error: rateLimitMessage(reset) };
    }

    const lang = input.language && input.language !== 'plaintext' ? input.language : 'code';
    const prompt = `Language: ${lang}\nCode:\n${input.code.slice(0, 3000)}`;

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: AI_MODEL,
      instructions:
        'You are a developer tool assistant. Explain the given code clearly and concisely in 200–300 words. Cover what it does, key concepts, and any notable patterns or gotchas. Use markdown formatting with headers and bullet points where helpful.',
      input: prompt,
      text: { format: { type: 'text' } },
    });

    const explanation = response.output_text.trim();
    if (!explanation) {
      return { success: false, error: 'AI returned an empty explanation. Please try again.' };
    }

    return { success: true, data: explanation };
  } catch (err) {
    return handleAIError(err);
  }
}

interface DescriptionInput {
  title: string;
  typeName: string;
  content?: string | null;
  url?: string | null;
  fileName?: string | null;
}

export async function generateDescription(
  input: DescriptionInput,
): Promise<ActionResult<string>> {
  try {
    const s = await requireSession();
    if (!s.success) return s;

    if (!s.data.isPro) {
      return { success: false, error: 'AI descriptions require DevStash Pro.' };
    }

    const { allowed, reset } = await checkRateLimit(aiLimiter, `ai:${s.data.id}`);
    if (!allowed) {
      return { success: false, error: rateLimitMessage(reset) };
    }

    const parts: string[] = [`Title: ${input.title}`, `Type: ${input.typeName}`];
    if (input.content) parts.push(`Content: ${input.content.slice(0, 1000)}`);
    if (input.url) parts.push(`URL: ${input.url}`);
    if (input.fileName) parts.push(`File: ${input.fileName}`);

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: AI_MODEL,
      instructions:
        'You are a developer tool assistant. Write a 1-2 sentence plain-text description for the given developer resource. Be concise and specific. No markdown, no bullet points, no lists.',
      input: parts.join('\n'),
      text: { format: { type: 'text' } },
    });

    const description = response.output_text.trim();
    if (!description) {
      return { success: false, error: 'AI returned an empty description. Please try again.' };
    }

    return { success: true, data: description };
  } catch (err) {
    return handleAIError(err);
  }
}

export async function optimizePrompt(prompt: string): Promise<ActionResult<string>> {
  try {
    const s = await requireSession();
    if (!s.success) return s;

    if (!s.data.isPro) {
      return { success: false, error: 'AI prompt optimization requires DevStash Pro.' };
    }

    const { allowed, reset } = await checkRateLimit(aiLimiter, `ai:${s.data.id}`);
    if (!allowed) {
      return { success: false, error: rateLimitMessage(reset) };
    }

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: AI_MODEL,
      instructions:
        'You are an expert prompt engineer. Analyze the given prompt and refine it for improved clarity, specificity, and effectiveness. Preserve the original intent. Return only the refined prompt — no explanations, no commentary, no surrounding text.',
      input: prompt.slice(0, 4000),
      text: { format: { type: 'text' } },
    });

    const optimized = response.output_text.trim();
    if (!optimized) {
      return { success: false, error: 'AI returned an empty result. Please try again.' };
    }

    return { success: true, data: optimized };
  } catch (err) {
    return handleAIError(err);
  }
}
