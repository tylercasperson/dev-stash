'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import AuthFormInput from '@/components/auth/AuthFormInput';
import EmailSentConfirmation from '@/components/auth/EmailSentConfirmation';

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setSubmittedEmail(email);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <EmailSentConfirmation
        email={submittedEmail}
        beforeEmail="If an account exists for "
        afterEmail=", we sent a password reset link. Check your inbox."
        expiry="The link expires in 1 hour."
        footerLinkHref="/sign-in"
        footerLinkLabel="Back to sign in"
      />
    );
  }

  return (
    <AuthFormLayout title="DevStash" subtitle="Reset your password">
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send reset link'}
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
