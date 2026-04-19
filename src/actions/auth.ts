'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function signInWithCredentials(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password' };
    }
    throw error;
  }
}

export async function signInWithGitHub() {
  await signIn('github', { redirectTo: '/dashboard' });
}

export async function signOutUser() {
  await signOut({ redirectTo: '/sign-in' });
}
