import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'DevStash <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your DevStash password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin-bottom:8px">Reset your password</h2>
        <p style="color:#555">We received a request to reset your DevStash password. Click the button below to choose a new one.</p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#1a1a1a;color:#fff;border-radius:6px;text-decoration:none;font-weight:500">
          Reset Password
        </a>
        <p style="margin-top:24px;font-size:13px;color:#888">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'DevStash <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your DevStash email',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin-bottom:8px">Verify your email</h2>
        <p style="color:#555">Thanks for signing up for DevStash. Click the button below to verify your email address.</p>
        <a href="${verifyUrl}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#1a1a1a;color:#fff;border-radius:6px;text-decoration:none;font-weight:500">
          Verify Email
        </a>
        <p style="margin-top:24px;font-size:13px;color:#888">This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>
      </div>
    `,
  });
}
