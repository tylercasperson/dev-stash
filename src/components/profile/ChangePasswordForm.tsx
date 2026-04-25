'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import AuthFormInput from '@/components/auth/AuthFormInput';

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.get('currentPassword'),
          newPassword: formData.get('newPassword'),
          confirmPassword: formData.get('confirmPassword'),
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      toast.success('Password updated successfully.');
      form.reset();
      setOpen(false);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        Change password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthFormInput
        id="currentPassword"
        name="currentPassword"
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />
      <div className="space-y-2">
        <AuthFormInput
          id="newPassword"
          name="newPassword"
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

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save password'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(''); }}
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
