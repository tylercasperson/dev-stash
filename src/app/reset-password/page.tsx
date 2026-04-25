'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import AuthFormInput from '@/components/auth/AuthFormInput';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Invalid link</h1>
          <p className="text-sm text-muted-foreground">This password reset link is invalid or has already been used.</p>
          <Link href="/forgot-password" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        if (data.error === 'token_expired') {
          setError('This reset link has expired. Please request a new one.');
        } else if (data.error === 'invalid_token') {
          setError('This reset link is invalid or has already been used.');
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }

      toast.success('Password reset! You can now sign in.');
      router.push('/sign-in');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <AuthFormLayout title="DevStash" subtitle="Choose a new password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <AuthFormInput
            id="password"
            name="password"
            label="New password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
        </div>
        <AuthFormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
        />

        {error && (
          <div className="space-y-1">
            <p className="text-sm text-destructive">{error}</p>
            {(error.includes('expired') || error.includes('invalid')) && (
              <Link href="/forgot-password" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
                Request a new link
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthFormLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
