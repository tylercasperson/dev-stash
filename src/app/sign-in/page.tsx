'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signInWithCredentials, signInWithGitHub } from '@/actions/auth';
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import AuthFormInput from '@/components/auth/AuthFormInput';
import Navbar from '@/components/homepage/Navbar';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified') === 'true';
  const tokenError = searchParams.get('error');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signInWithCredentials(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const bannerMessage = verified
    ? 'Email verified! You can now sign in.'
    : tokenError === 'token_expired'
      ? 'Your verification link has expired. Please register again.'
      : tokenError === 'invalid_token'
        ? 'Invalid verification link. Please try again.'
        : null;

  return (
    <AuthFormLayout title="DevStash" subtitle="Sign in to your account" className="pt-16">
      {bannerMessage && (
        <p className={`rounded-md px-3 py-2 text-sm ${verified ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
          {bannerMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthFormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          labelRight={
            <Link href="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          }
        />

        {error === 'EMAIL_NOT_VERIFIED' ? (
          <p className="rounded-md bg-yellow-500/10 px-3 py-2 text-sm text-yellow-500">
            Please verify your email before signing in. Check your inbox for the verification link.
          </p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form action={signInWithGitHub}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <GitHubIcon />
          Sign in with GitHub
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        No account?{' '}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </AuthFormLayout>
  );
}

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <Suspense>
        <SignInForm />
      </Suspense>
    </>
  );
}
