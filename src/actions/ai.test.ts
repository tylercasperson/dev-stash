import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({ auth: vi.fn() }));
vi.mock('@/lib/openai', () => ({ getOpenAIClient: vi.fn(), AI_MODEL: 'gpt-5-nano' }));
vi.mock('@/lib/rate-limit', () => ({
  aiLimiter: null,
  checkRateLimit: vi.fn(),
  rateLimitMessage: vi.fn(),
}));

import { auth } from '@/auth';
import { getOpenAIClient } from '@/lib/openai';
import { checkRateLimit, rateLimitMessage } from '@/lib/rate-limit';
import { generateAutoTags, generateDescription, explainCode, optimizePrompt } from './ai';

const mockAuth = vi.mocked(auth);
const mockGetOpenAIClient = vi.mocked(getOpenAIClient);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockRateLimitMessage = vi.mocked(rateLimitMessage);

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'user-1', isPro: true, ...overrides },
    expires: '2099-01-01',
  };
}

function makeOpenAIClient(outputText: string) {
  return {
    responses: {
      create: vi.fn().mockResolvedValue({ output_text: outputText }),
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCheckRateLimit.mockResolvedValue({ allowed: true, reset: 0, remaining: 19 });
});

describe('generateAutoTags', () => {
  it('returns Unauthorized when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('returns Pro gating error for free users', async () => {
    mockAuth.mockResolvedValue(makeSession({ isPro: false }) as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: false, error: 'AI auto-tagging requires DevStash Pro.' });
  });

  it('returns rate limit error when limit exceeded', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    mockCheckRateLimit.mockResolvedValue({ allowed: false, reset: Date.now() + 60000, remaining: 0 });
    mockRateLimitMessage.mockReturnValue('Too many attempts. Please try again in 1 minute.');
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: false, error: 'Too many attempts. Please try again in 1 minute.' });
  });

  it('parses {"tags": [...]} format and normalizes lowercase', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient(JSON.stringify({ tags: ['React', 'TypeScript', 'Hooks'] }));
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: true, data: ['react', 'typescript', 'hooks'] });
  });

  it('parses array format ["tag1", "tag2"]', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient(JSON.stringify(['React', 'Hooks']));
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: true, data: ['react', 'hooks'] });
  });

  it('limits tags to 5 maximum', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient(JSON.stringify({ tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }));
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.length).toBe(5);
  });

  it('returns error for invalid JSON from AI', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('not valid json');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: false, error: 'AI returned invalid response. Please try again.' });
  });

  it('returns error for unexpected JSON structure', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient(JSON.stringify({ unexpected: 'structure' }));
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: false, error: 'AI returned unexpected format. Please try again.' });
  });

  it('returns error when OpenAI client throws', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = {
      responses: { create: vi.fn().mockRejectedValue(new Error('Network error')) },
    };
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: false, error: 'AI service error. Please try again.' });
  });

  it('handles null content gracefully', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient(JSON.stringify({ tags: ['general'] }));
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', null);
    expect(result).toEqual({ success: true, data: ['general'] });
  });

  it('filters out non-string tags from array', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient(JSON.stringify({ tags: ['react', 42, null, 'hooks'] }));
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateAutoTags('My snippet', 'const x = 1;');
    expect(result).toEqual({ success: true, data: ['react', 'hooks'] });
  });
});

describe('generateDescription', () => {
  it('returns Unauthorized when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const result = await generateDescription({ title: 'My item', typeName: 'snippet' });
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('returns Pro gating error for free users', async () => {
    mockAuth.mockResolvedValue(makeSession({ isPro: false }) as never);
    const result = await generateDescription({ title: 'My item', typeName: 'snippet' });
    expect(result).toEqual({ success: false, error: 'AI descriptions require DevStash Pro.' });
  });

  it('returns rate limit error when limit exceeded', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    mockCheckRateLimit.mockResolvedValue({ allowed: false, reset: Date.now() + 60000, remaining: 0 });
    mockRateLimitMessage.mockReturnValue('Too many attempts. Please try again in 1 minute.');
    const result = await generateDescription({ title: 'My item', typeName: 'snippet' });
    expect(result).toEqual({ success: false, error: 'Too many attempts. Please try again in 1 minute.' });
  });

  it('returns description from output_text', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('A reusable React hook for managing local state.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateDescription({ title: 'useState hook', typeName: 'snippet', content: 'const [state, setState] = useState()' });
    expect(result).toEqual({ success: true, data: 'A reusable React hook for managing local state.' });
  });

  it('trims whitespace from description', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('  Some description with extra spaces.  ');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateDescription({ title: 'My item', typeName: 'note' });
    expect(result).toEqual({ success: true, data: 'Some description with extra spaces.' });
  });

  it('returns error when AI returns empty string', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('   ');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateDescription({ title: 'My item', typeName: 'note' });
    expect(result).toEqual({ success: false, error: 'AI returned an empty description. Please try again.' });
  });

  it('includes url in input for link type', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('A useful link.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateDescription({ title: 'Docs', typeName: 'link', url: 'https://example.com' });
    expect(result.success).toBe(true);
    const createCall = client.responses.create.mock.calls[0][0];
    expect(createCall.input).toContain('URL: https://example.com');
  });

  it('includes fileName in input for file type', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('A configuration file.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateDescription({ title: 'Config', typeName: 'file', fileName: 'config.json' });
    expect(result.success).toBe(true);
    const createCall = client.responses.create.mock.calls[0][0];
    expect(createCall.input).toContain('File: config.json');
  });

  it('returns error when OpenAI client throws', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = { responses: { create: vi.fn().mockRejectedValue(new Error('Network error')) } };
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await generateDescription({ title: 'My item', typeName: 'snippet' });
    expect(result).toEqual({ success: false, error: 'AI service error. Please try again.' });
  });
});

describe('explainCode', () => {
  it('returns Unauthorized when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const result = await explainCode({ code: 'const x = 1;', language: 'typescript' });
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('returns Pro gating error for free users', async () => {
    mockAuth.mockResolvedValue(makeSession({ isPro: false }) as never);
    const result = await explainCode({ code: 'const x = 1;', language: 'typescript' });
    expect(result).toEqual({ success: false, error: 'AI code explanation requires DevStash Pro.' });
  });

  it('returns rate limit error when limit exceeded', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    mockCheckRateLimit.mockResolvedValue({ allowed: false, reset: Date.now() + 60000, remaining: 0 });
    mockRateLimitMessage.mockReturnValue('Too many attempts. Please try again in 1 minute.');
    const result = await explainCode({ code: 'const x = 1;', language: 'typescript' });
    expect(result).toEqual({ success: false, error: 'Too many attempts. Please try again in 1 minute.' });
  });

  it('returns explanation from output_text', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('This code declares a constant variable x with value 1.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await explainCode({ code: 'const x = 1;', language: 'typescript' });
    expect(result).toEqual({ success: true, data: 'This code declares a constant variable x with value 1.' });
  });

  it('trims whitespace from explanation', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('  Some explanation.  ');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await explainCode({ code: 'ls -la', language: 'bash' });
    expect(result).toEqual({ success: true, data: 'Some explanation.' });
  });

  it('returns error when AI returns empty string', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('   ');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await explainCode({ code: 'const x = 1;' });
    expect(result).toEqual({ success: false, error: 'AI returned an empty explanation. Please try again.' });
  });

  it('handles null/undefined language gracefully', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('An explanation.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await explainCode({ code: 'const x = 1;', language: null });
    expect(result.success).toBe(true);
    const createCall = client.responses.create.mock.calls[0][0];
    expect(createCall.input).toContain('Language: code');
  });

  it('includes language in prompt when provided', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('An explanation.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    await explainCode({ code: 'print("hello")', language: 'python' });
    const createCall = client.responses.create.mock.calls[0][0];
    expect(createCall.input).toContain('Language: python');
  });

  it('returns error when OpenAI client throws', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = { responses: { create: vi.fn().mockRejectedValue(new Error('Network error')) } };
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await explainCode({ code: 'const x = 1;' });
    expect(result).toEqual({ success: false, error: 'AI service error. Please try again.' });
  });
});

describe('optimizePrompt', () => {
  it('returns Unauthorized when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const result = await optimizePrompt('Write a poem about cats.');
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('returns Pro gating error for free users', async () => {
    mockAuth.mockResolvedValue(makeSession({ isPro: false }) as never);
    const result = await optimizePrompt('Write a poem about cats.');
    expect(result).toEqual({ success: false, error: 'AI prompt optimization requires DevStash Pro.' });
  });

  it('returns rate limit error when limit exceeded', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    mockCheckRateLimit.mockResolvedValue({ allowed: false, reset: 3600000, remaining: 0 });
    mockRateLimitMessage.mockReturnValue('Rate limit reached. Try again in 60 minutes.');
    const result = await optimizePrompt('Write a poem about cats.');
    expect(result).toEqual({ success: false, error: 'Rate limit reached. Try again in 60 minutes.' });
  });

  it('returns optimized prompt on success', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('Write a concise poem about domestic cats, focusing on their playful nature.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await optimizePrompt('Write a poem about cats.');
    expect(result).toEqual({
      success: true,
      data: 'Write a concise poem about domestic cats, focusing on their playful nature.',
    });
  });

  it('returns error when AI returns empty text', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('   ');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await optimizePrompt('Write a poem about cats.');
    expect(result).toEqual({ success: false, error: 'AI returned an empty result. Please try again.' });
  });

  it('truncates prompt input to 4000 characters', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = makeOpenAIClient('Refined prompt.');
    mockGetOpenAIClient.mockReturnValue(client as never);
    const longPrompt = 'a'.repeat(5000);
    await optimizePrompt(longPrompt);
    const createCall = client.responses.create.mock.calls[0][0];
    expect(createCall.input.length).toBe(4000);
  });

  it('returns error when OpenAI client throws', async () => {
    mockAuth.mockResolvedValue(makeSession() as never);
    const client = { responses: { create: vi.fn().mockRejectedValue(new Error('Network error')) } };
    mockGetOpenAIClient.mockReturnValue(client as never);
    const result = await optimizePrompt('Write a poem about cats.');
    expect(result).toEqual({ success: false, error: 'AI service error. Please try again.' });
  });
});
