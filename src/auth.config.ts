import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

export default {
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Real validation is in auth.ts (bcrypt not available in edge runtime)
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;
