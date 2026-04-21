import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

type Duration = `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;

function makeLimiter(tokens: number, window: Duration): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: 'devstash',
  });
}

export async function checkRateLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<{ allowed: boolean; reset: number; remaining: number }> {
  if (!limiter) return { allowed: true, reset: 0, remaining: -1 };
  try {
    const { success, reset, remaining } = await limiter.limit(key);
    return { allowed: success, reset, remaining };
  } catch {
    // Fail open — allow request if Upstash is unavailable
    return { allowed: true, reset: 0, remaining: -1 };
  }
}

export function getIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
}

function retryInfo(reset: number): { secs: number; message: string } {
  const secs = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  const mins = Math.ceil(secs / 60);
  return { secs, message: `Too many attempts. Please try again in ${mins} minute${mins !== 1 ? 's' : ''}.` };
}

export function tooManyRequests(reset: number): NextResponse {
  const { secs, message } = retryInfo(reset);
  return NextResponse.json(
    { success: false, error: message },
    { status: 429, headers: { 'Retry-After': String(secs) } }
  );
}

export function rateLimitMessage(reset: number): string {
  return retryInfo(reset).message;
}

export const loginLimiter = makeLimiter(5, '15 m');
export const registerLimiter = makeLimiter(3, '1 h');
export const forgotPasswordLimiter = makeLimiter(3, '1 h');
export const resetPasswordLimiter = makeLimiter(5, '15 m');
