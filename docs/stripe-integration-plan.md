# Stripe Integration Plan — DevStash Pro

**Pricing:** $8/mo monthly · $72/yr annual  
**Free tier limits:** 50 items · 3 collections · no file/image uploads · no AI features

---

## Current State

| Area | State |
|------|-------|
| User schema | `isPro`, `stripeCustomerId`, `stripeSubscriptionId` already on `User` model |
| Env vars | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY` already in `.env` (empty values) |
| Feature gating | `isPro` used only for sidebar PRO badge — no enforcement anywhere |
| JWT session | `isPro` not in session; needs to be always-synced from DB |

---

## Implementation Order

1. Stripe library + singleton client
2. NextAuth JWT/session — add `isPro` always-synced
3. Stripe checkout API route
4. Stripe customer portal API route
5. Stripe webhook handler
6. `SubscriptionSection` settings UI
7. Free tier limit enforcement in server actions
8. Pro-only gate for file/image upload route

---

## 1. Stripe Dashboard Setup

1. Create two products in Stripe Dashboard → Products:
   - **DevStash Pro Monthly** — $8.00/month recurring → copy Price ID → `STRIPE_PRICE_ID_MONTHLY`
   - **DevStash Pro Annual** — $72.00/year recurring → copy Price ID → `STRIPE_PRICE_ID_YEARLY`
2. Webhooks → Add endpoint:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`
3. For local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

---

## 2. Files to Create

### `src/lib/stripe.ts`

```ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
});
```

---

### `src/lib/subscription.ts`

Free tier limit helpers used by server actions.

```ts
import { prisma } from '@/lib/prisma';

export const FREE_ITEM_LIMIT = 50;
export const FREE_COLLECTION_LIMIT = 3;

export async function getUserItemCount(userId: string): Promise<number> {
  return prisma.item.count({ where: { userId } });
}

export async function getUserCollectionCount(userId: string): Promise<number> {
  return prisma.collection.count({ where: { userId } });
}
```

---

### `src/app/api/stripe/checkout/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const VALID_INTERVALS = ['monthly', 'yearly'] as const;
type Interval = (typeof VALID_INTERVALS)[number];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const interval: Interval = VALID_INTERVALS.includes(body.interval)
    ? body.interval
    : 'monthly';

  const priceId =
    interval === 'yearly'
      ? process.env.STRIPE_PRICE_ID_YEARLY
      : process.env.STRIPE_PRICE_ID_MONTHLY;

  if (!priceId) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, stripeCustomerId: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: user.stripeCustomerId ?? undefined,
    customer_email: user.stripeCustomerId ? undefined : user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/settings?success=true`,
    cancel_url: `${baseUrl}/settings?canceled=true`,
    metadata: { userId: session.user.id },
    subscription_data: { metadata: { userId: session.user.id } },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
```

---

### `src/app/api/stripe/portal/route.ts`

```ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/settings`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

---

### `src/app/api/stripe/webhook/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const userId = checkoutSession.metadata?.userId;
      const customerId = checkoutSession.customer as string;
      const subscriptionId = checkoutSession.subscription as string;

      if (!userId) break;

      await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: true,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
        },
      });
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const isActive =
        subscription.status === 'active' || subscription.status === 'trialing';

      await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: isActive,
          stripeSubscriptionId: subscription.id,
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: false,
          stripeSubscriptionId: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

### `src/components/settings/SubscriptionSection.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  isPro: boolean;
  hasStripeCustomer: boolean;
}

export default function SubscriptionSection({ isPro, hasStripeCustomer }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(interval: 'monthly' | 'yearly') {
    setLoading(interval);
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interval }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  async function handlePortal() {
    setLoading('portal');
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  if (isPro) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">DevStash Pro</p>
          <p className="text-sm text-muted-foreground">Your subscription is active.</p>
        </div>
        {hasStripeCustomer && (
          <button
            onClick={handlePortal}
            disabled={loading === 'portal'}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50"
          >
            {loading === 'portal' ? 'Loading…' : 'Manage billing'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border p-4 space-y-1">
        <p className="text-sm font-medium text-foreground">Free plan</p>
        <p className="text-sm text-muted-foreground">50 items · 3 collections · no file uploads</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleCheckout('monthly')}
          disabled={!!loading}
          className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading === 'monthly' ? 'Loading…' : 'Upgrade — $8/mo'}
        </button>
        <button
          onClick={() => handleCheckout('yearly')}
          disabled={!!loading}
          className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50"
        >
          {loading === 'yearly' ? 'Loading…' : 'Upgrade — $72/yr (save 25%)'}
        </button>
      </div>
    </div>
  );
}
```

---

## 3. Files to Modify

### `src/types/next-auth.d.ts`

Add `isPro` to the Session user and JWT token:

```ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isPro: boolean;          // ADD
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    passwordChangedAt?: number | null;
    isPro?: boolean;           // ADD
  }
}
```

---

### `src/auth.ts`

Replace the `jwt` callback to always sync `isPro` from the database. This ensures webhook-driven `isPro` updates are picked up on the next request without requiring `trigger === "update"` (which is unreliable for server-side webhook changes).

```ts
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordChangedAt: true, isPro: true },
    });
    token.passwordChangedAt = dbUser?.passwordChangedAt?.getTime() ?? null;
    token.isPro = dbUser?.isPro ?? false;
  } else if (token.id) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { passwordChangedAt: true, isPro: true },
      });
      const dbTimestamp = dbUser?.passwordChangedAt?.getTime() ?? null;
      if (dbTimestamp !== token.passwordChangedAt) {
        return null;
      }
      // Always sync isPro so webhook updates propagate on next request
      token.isPro = dbUser?.isPro ?? false;
    } catch {
      // DB unavailable — allow existing session to continue
    }
  }
  return token;
},
```

Also update the `session` callback:

```ts
session({ session, token }) {
  if (token.id) session.user.id = token.id as string;
  session.user.isPro = token.isPro ?? false;  // ADD
  return session;
},
```

---

### `src/app/settings/page.tsx`

Add a Subscription section above the Editor preferences section. Pass `isPro` and `hasStripeCustomer` from the fetched user data.

```tsx
import SubscriptionSection from '@/components/settings/SubscriptionSection';

// In getProfileData or a new query, fetch:
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { hasPassword: true, isPro: true, stripeCustomerId: true },
});

// Then in JSX, add before Editor preferences section:
<section className="rounded-lg border border-border bg-card p-6 space-y-4">
  <div>
    <h2 className="text-sm font-semibold text-foreground">Subscription</h2>
    <p className="mt-1 text-sm text-muted-foreground">Manage your DevStash Pro subscription.</p>
  </div>
  <SubscriptionSection
    isPro={user.isPro}
    hasStripeCustomer={!!user.stripeCustomerId}
  />
</section>
```

**Note:** `getProfileData` in `src/lib/db/profile.ts` needs `isPro` and `stripeCustomerId` added to its select query.

---

### `src/lib/db/profile.ts`

Add `isPro` and `stripeCustomerId` to the user select:

```ts
// In getProfileData, add to select:
select: {
  // ... existing fields ...
  isPro: true,
  stripeCustomerId: true,
}
```

And update the return type and value accordingly.

---

### `src/actions/items.ts`

Add free tier check in `createItem` before calling `dbCreateItem`:

```ts
import { FREE_ITEM_LIMIT, getUserItemCount } from '@/lib/subscription';

// In createItem, after session check and parse, before dbCreateItem:
if (!session.user.isPro) {
  // File/image types require Pro
  if (parsed.data.typeName === 'file' || parsed.data.typeName === 'image') {
    return { success: false, error: 'File and image uploads require DevStash Pro.' };
  }

  // Item count limit
  const count = await getUserItemCount(session.user.id);
  if (count >= FREE_ITEM_LIMIT) {
    return { success: false, error: `Free plan is limited to ${FREE_ITEM_LIMIT} items. Upgrade to Pro for unlimited items.` };
  }
}
```

**Note:** `session.user.isPro` requires the JWT/session changes above. Until those land, use a DB lookup as fallback.

---

### `src/actions/collections.ts`

Add free tier check in `createCollection`:

```ts
import { FREE_COLLECTION_LIMIT, getUserCollectionCount } from '@/lib/subscription';

// In createCollection, after session check and parse:
if (!session.user.isPro) {
  const count = await getUserCollectionCount(session.user.id);
  if (count >= FREE_COLLECTION_LIMIT) {
    return { success: false, error: `Free plan is limited to ${FREE_COLLECTION_LIMIT} collections. Upgrade to Pro for unlimited collections.` };
  }
}
```

---

### `src/app/api/upload/route.ts`

Add Pro check at the top of the POST handler:

```ts
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// File upload is Pro-only
if (!session.user.isPro) {
  return NextResponse.json({ error: 'File uploads require DevStash Pro.' }, { status: 403 });
}
```

---

## 4. Package Installation

```bash
npm install stripe
```

No Stripe.js/Elements needed — we redirect to Stripe-hosted Checkout.

---

## 5. Stripe Dashboard Setup Steps

1. **Products:** Create two recurring prices (monthly $8, yearly $72) and copy their Price IDs into `.env`.
2. **Webhook endpoint:** Add `https://yourdomain.com/api/stripe/webhook` listening to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. **Copy webhook signing secret** into `.env` as `STRIPE_WEBHOOK_SECRET`.
4. **Customer Portal:** Stripe Dashboard → Settings → Customer Portal → Enable and configure (allow cancel, allow plan change).
5. **Local testing:** Install Stripe CLI, run `stripe listen --forward-to localhost:3000/api/stripe/webhook`, copy the local signing secret for dev.

---

## 6. Testing Checklist

### Checkout Flow
- [ ] Free user clicks "Upgrade — $8/mo" → redirected to Stripe Checkout
- [ ] Free user clicks "Upgrade — $72/yr" → redirected to Stripe Checkout with yearly price
- [ ] Complete Stripe test checkout (card `4242 4242 4242 4242`) → redirected to `/settings?success=true`
- [ ] After checkout, settings page shows "DevStash Pro · Active"
- [ ] `isPro` is `true` in database after webhook fires

### Session Sync
- [ ] After webhook sets `isPro = true`, reload page → session shows Pro without signing out
- [ ] Pro user can create file/image items
- [ ] Pro user sees no item/collection limit errors

### Free Tier Enforcement
- [ ] Free user creating 51st item gets error toast "Free plan is limited to 50 items…"
- [ ] Free user creating 4th collection gets error toast "Free plan is limited to 3 collections…"
- [ ] Free user uploading file/image gets 403 from `/api/upload`
- [ ] Free user selecting file/image type in Create Item dialog shows upgrade prompt (UI gate — add to dialog)

### Cancellation
- [ ] Pro user clicks "Manage billing" → redirected to Stripe Customer Portal
- [ ] Cancel subscription in portal → `customer.subscription.deleted` webhook fires → `isPro = false` in DB
- [ ] After cancellation, user sees Free plan UI on reload

### Webhook Security
- [ ] Request with no `stripe-signature` header → 400
- [ ] Request with wrong signature → 400
- [ ] Duplicate webhook events handled idempotently (Prisma upsert is safe)

---

## 7. Notes

### Why always-sync `isPro` in JWT

The `trigger === "update"` approach in NextAuth v5 requires the client to call `update()` from `useSession()`. Since `isPro` is updated by a server-side Stripe webhook (not a client action), the client never knows to call `update()`. The always-sync approach adds one DB query per session validation but guarantees the session reflects the DB state — a simple page reload after checkout is sufficient.

### Webhook metadata

The checkout session and subscription both carry `userId` in their `metadata`. This is the safest way to map Stripe events back to users — more reliable than looking up by email or customer ID, and survives email changes.

### Customer Portal

Requires Stripe Customer Portal to be enabled in the Stripe Dashboard (Settings → Customer Portal). Without it, the `/api/stripe/portal` call will error.

### UI gates (future)

Beyond server-side enforcement, the Create Item dialog should visually disable file/image type buttons for free users and show an upgrade CTA. This is a UX improvement on top of the hard server-side enforcement already described here.
