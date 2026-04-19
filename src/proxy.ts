import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export const proxy = auth(function proxy(req) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    return Response.redirect(new URL('/api/auth/signin', nextUrl));
  }
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
