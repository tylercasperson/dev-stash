# Stripe Phase 2 — Webhooks, Feature Gating & UI

## Overview

Build the full Stripe billing flow: checkout, customer portal, webhook handler, subscription UI on the settings page, and free tier enforcement in server actions and the upload route. Requires Stripe Dashboard setup and the Stripe CLI for local webhook testing.

**Prerequisite:** Phase 1 must be complete (`isPro` in session, `stripe` package installed, `src/lib/subscription.ts` exists).

## Stripe Dashboard Setup (do before coding)

1. **Create product:** DevStash Pro — two prices: `$8.00/month` and `$72.00/year`
   - Copy each Price ID into `.env` as `STRIPE_PRICE_ID_MONTHLY` / `STRIPE_PRICE_ID_YEARLY`
2. **Create webhook endpoint:** `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`
3. **Enable Customer Portal:** Stripe Dashboard → Settings → Customer Portal → enable cancellation and plan switching
4. **Local dev:** `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Files to Create

### `src/app/api/stripe/checkout/route.ts`
`POST` — creates a Stripe Checkout session and returns `{ url }`.
- Auth check → 401
- Accept `{ interval: 'monthly' | 'yearly' }` — validate against the two known values, default to `'monthly'`
- Resolve the correct price ID from env server-side (never expose to client)
- If user has no `stripeCustomerId`, pass `customer_email` to Stripe and let Stripe create the customer — update `stripeCustomerId` via webhook after `checkout.session.completed` (simpler than creating the customer up front)
- `success_url`: `/settings?success=true`, `cancel_url`: `/settings`
- Store `userId` in both `checkout.session.metadata` and `subscription_data.metadata` — webhook relies on this

### `src/app/api/stripe/portal/route.ts`
`POST` — creates a Customer Portal session and returns `{ url }`.
- Auth check → 401
- Fetch user's `stripeCustomerId` from DB — 400 if missing
- `return_url`: `/settings`

### `src/app/api/stripe/webhook/route.ts`
`POST` — validates Stripe signature then handles three events:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Set `isPro=true`, store `stripeCustomerId` + `stripeSubscriptionId` using `metadata.userId` |
| `customer.subscription.updated` | Set `isPro = status === 'active' \|\| 'trialing'`, update `stripeSubscriptionId` using `metadata.userId` |
| `customer.subscription.deleted` | Set `isPro=false`, clear `stripeSubscriptionId` using `metadata.userId` |

- Verify signature with `stripe.webhooks.constructEvent` — 400 on failure
- Use `request.text()` for raw body (required for signature verification)
- Each handler guards on missing `metadata.userId` — unknown events are silently ignored

### `src/components/settings/SubscriptionSection.tsx`
`'use client'` component — props: `isPro: boolean`, `hasStripeCustomer: boolean`.

**Free state:** Show current plan box (50 items · 3 collections · no file uploads) and two upgrade buttons (monthly/yearly). Clicking either POSTs to `/api/stripe/checkout` then redirects to the returned URL.

**Pro state:** Show "DevStash Pro — Your subscription is active." and a "Manage billing" link that POSTs to `/api/stripe/portal` then redirects.

Handle loading state per-button. On missing `url` in the response, do not redirect (handle gracefully).

## Files to Modify

### `src/lib/db/profile.ts`
Add `isPro` and `stripeCustomerId` to the `select` in `getProfileData`. Update the return type and value to include both fields.

### `src/app/settings/page.tsx`
- Import `SubscriptionSection`
- The page already calls `getProfileData` — use the newly returned `isPro` and `stripeCustomerId`
- Add a Subscription section **above** the Editor Preferences section:
  ```tsx
  <section className="rounded-lg border border-border bg-card p-6 space-y-4">
    <div>
      <h2 className="text-sm font-semibold text-foreground">Subscription</h2>
      <p className="mt-1 text-sm text-muted-foreground">Manage your DevStash Pro subscription.</p>
    </div>
    <SubscriptionSection isPro={user.isPro} hasStripeCustomer={!!user.stripeCustomerId} />
  </section>
  ```
- Handle `?success=true` in the URL: show a "Welcome to DevStash Pro!" Sonner toast. Use a `'use client'` wrapper component or read the search param server-side and pass a flag to a toast-triggering child.

### `src/actions/items.ts` — `createItem`
After session check and Zod parse, before calling `dbCreateItem`:
```ts
if (!session.user.isPro) {
  if (typeName === 'file' || typeName === 'image') {
    return { success: false, error: 'File and image uploads require DevStash Pro.' };
  }
  const count = await getUserItemCount(session.user.id);
  if (count >= FREE_ITEM_LIMIT) {
    return { success: false, error: `Free plan is limited to ${FREE_ITEM_LIMIT} items. Upgrade to Pro for unlimited items.` };
  }
}
```

### `src/actions/collections.ts` — `createCollection`
After session check and Zod parse:
```ts
if (!session.user.isPro) {
  const count = await getUserCollectionCount(session.user.id);
  if (count >= FREE_COLLECTION_LIMIT) {
    return { success: false, error: `Free plan is limited to ${FREE_COLLECTION_LIMIT} collections. Upgrade to Pro for unlimited collections.` };
  }
}
```

### `src/app/api/upload/route.ts`
After the auth check, before processing the file:
```ts
if (!session.user.isPro) {
  return NextResponse.json({ error: 'File uploads require DevStash Pro.' }, { status: 403 });
}
```

## Unit Tests

Add to the existing test files:

### `src/actions/items.test.ts`
| Test | Assertion |
|------|-----------|
| `createItem` with `typeName='file'` and `isPro=false` | Returns `{ success: false, error: '...require DevStash Pro.' }` |
| `createItem` with `typeName='image'` and `isPro=false` | Same error |
| `createItem` when item count equals `FREE_ITEM_LIMIT` and `isPro=false` | Returns limit error |
| `createItem` when Pro user at item limit | Proceeds to create |
| `createItem` when Pro user uses file type | Proceeds to create |

### `src/actions/collections.test.ts`
| Test | Assertion |
|------|-----------|
| `createCollection` when count equals `FREE_COLLECTION_LIMIT` and `isPro=false` | Returns limit error |
| `createCollection` when Pro user at collection limit | Proceeds to create |

Mock `session.user.isPro` via the mocked `auth()` return value.

## Testing Checklist

### Stripe CLI local testing
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Note: copy the local signing secret to STRIPE_WEBHOOK_SECRET for dev
```

### Checkout flow
- [ ] Free user clicks "Upgrade — $8/mo" → redirected to Stripe Checkout
- [ ] Free user clicks "Upgrade — $72/yr" → redirected to Stripe Checkout
- [ ] Complete payment with card `4242 4242 4242 4242`
- [ ] Redirected to `/settings?success=true`
- [ ] "Welcome to DevStash Pro!" toast appears
- [ ] Subscription section now shows Pro state with "Manage billing"
- [ ] `isPro = true` in DB

### Session sync
- [ ] After webhook fires, reload page → `session.user.isPro` is `true` without signing out

### Customer Portal
- [ ] Pro user clicks "Manage billing" → redirected to Stripe Customer Portal
- [ ] Cancel subscription in portal → webhook fires → `isPro = false` in DB
- [ ] After cancellation, page reload shows Free plan UI

### Feature gating
- [ ] Free user at 50 items → "New Item" shows error toast with limit message
- [ ] Free user at 3 collections → "New Collection" shows error toast with limit message
- [ ] Free user selecting file/image type in Create Item dialog → error toast (server action rejects)
- [ ] Free user uploading via `/api/upload` → 403 response
- [ ] Pro user at 50+ items → creates successfully
- [ ] Pro user creates file/image → uploads successfully

### Webhook security
- [ ] Request without `stripe-signature` header → 400
- [ ] Request with invalid signature → 400
- [ ] Duplicate `checkout.session.completed` events → idempotent (`prisma.user.update` by ID is safe)

## Notes

- The webhook route must read the raw body with `request.text()` — do not use `request.json()`
- `userId` in webhook metadata is the source of truth for mapping events back to users — do not rely on email or `stripeCustomerId` alone
- Customer Portal must be enabled in the Stripe Dashboard before the portal API route will work
- The upload route Pro check uses `session.user.isPro` from the JWT (added in Phase 1) — no extra DB query needed there

## References

- `docs/stripe-integration-plan.md` — full plan with all code examples
- Stripe test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (declined)
