import Link from 'next/link';
import { Lock } from 'lucide-react';

interface Props {
  feature: string;
}

export default function ProGate({ feature }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Lock className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{feature} is a Pro feature</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Upgrade to DevStash Pro to upload and manage {feature.toLowerCase()}, plus get unlimited items, collections, and AI features.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/settings#subscription"
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Upgrade to Pro
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
