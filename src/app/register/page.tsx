'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import AuthFormInput from '@/components/auth/AuthFormInput';
import EmailSentConfirmation from '@/components/auth/EmailSentConfirmation';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Registration failed');
        setLoading(false);
        return;
      }
      if (data.verified) {
        toast.success('Account created! You can now sign in.');
        router.push('/sign-in');
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
        beforeEmail="We sent a verification link to "
        afterEmail=". Click the link to activate your account."
        expiry="The link expires in 24 hours."
        footerLinkHref="/sign-in"
        footerLinkLabel="Sign in"
        footerLinkPrefix="Already verified?"
      />
    );
  }

  return (
    <AuthFormLayout title="DevStash" subtitle="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="name"
          name="name"
          label="Name"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Smith"
        />
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
          autoComplete="new-password"
          placeholder="••••••••"
        />
        <AuthFormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthFormLayout>
  );
}
