import Link from 'next/link';

interface EmailSentConfirmationProps {
  email: string;
  beforeEmail: string;
  afterEmail?: string;
  expiry: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  footerLinkPrefix?: string;
}

export default function EmailSentConfirmation({
  email,
  beforeEmail,
  afterEmail,
  expiry,
  footerLinkHref,
  footerLinkLabel,
  footerLinkPrefix,
}: EmailSentConfirmationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          {beforeEmail}
          <span className="font-medium text-foreground">{email}</span>
          {afterEmail}
        </p>
        <p className="text-xs text-muted-foreground">{expiry}</p>
        <p className="text-sm text-muted-foreground">
          {footerLinkPrefix && <>{footerLinkPrefix}{' '}</>}
          <Link href={footerLinkHref} className="font-medium text-foreground underline-offset-4 hover:underline">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
