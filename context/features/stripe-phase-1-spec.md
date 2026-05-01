# Stripe Phase 1 — Core Infrastructure

## Overview

Install Stripe, create the usage-limits module, and wire `isPro` into the NextAuth JWT/session. No Stripe API calls are made in this phase — everything can be implemented and tested locally without Stripe Dashboard setup or the Stripe CLI.

## Requirements

- Install `stripe` npm package
- Create `src/lib/stripe.ts` — Stripe singleton client
- Create `src/lib/subscription.ts` — free tier limit constants + count helpers
- Update `src/types/next-auth.d.ts` — add `isPro: boolean` to Session user and JWT
- Update `src/auth.ts` — always sync `isPro` from DB in `jwt` callback
- Write unit tests for `src/lib/subscription.ts`

## Files to Create

### `src/lib/stripe.ts`
Throw at module load if `STRIPE_SECRET_KEY` is missing. Use the `2025-01-27.acacia` API version.

### `src/lib/subscription.ts`
Export:
- `FREE_ITEM_LIMIT = 50`
- `FREE_COLLECTION_LIMIT = 3`
- `getUserItemCount(userId): Promise<number>` — `prisma.item.count`
- `getUserCollectionCount(userId): Promise<number>` — `prisma.collection.count`

## Files to Modify

### `src/types/next-auth.d.ts`
Add to `Session.user`:
```ts
isPro: boolean;
```
Add to `JWT`:
```ts
isPro?: boolean;
```

### `src/auth.ts`
The `jwt` callback currently only syncs `passwordChangedAt`. Extend it to also always fetch `isPro` on every session validation (not just on first sign-in):

```ts
// In the else-if (token.id) branch, extend the existing DB select:
select: { passwordChangedAt: true, isPro: true }

// After the passwordChangedAt check, add:
token.isPro = dbUser?.isPro ?? false;

// On first sign-in (user branch), also add isPro to the initial select and set token.isPro
```

Also extend the `session` callback:
```ts
session.user.isPro = token.isPro ?? false;
```

This adds one indexed primary-key DB query per session validation. The trade-off is acceptable: it guarantees `session.user.isPro` reflects webhook-driven DB changes on the next page load, without requiring `trigger === "update"` (which is unreliable for server-side changes). See `docs/stripe-integration-plan.md` §Notes for full reasoning.

## Unit Tests — `src/lib/subscription.test.ts`

Mock `@/lib/prisma`. Cover:

| Test | Assertion |
|------|-----------|
| `getUserItemCount` calls `prisma.item.count` with correct `userId` | Returns mocked count |
| `getUserCollectionCount` calls `prisma.collection.count` with correct `userId` | Returns mocked count |
| Constants have correct values | `FREE_ITEM_LIMIT === 50`, `FREE_COLLECTION_LIMIT === 3` |

Keep tests minimal — the functions are thin wrappers. The gating logic that consumes them is tested in Phase 2.

## Testing

1. `npm run build` — confirm no TypeScript errors on updated session types
2. Sign in → open DevTools → `session.user.isPro` is `false` for a normal user
3. Manually set `isPro = true` in DB for a test user → reload → `session.user.isPro` is `true` without signing out
4. `npm run test` — all tests pass including new subscription tests

## Notes

- Do not enforce any limits yet — that happens in Phase 2
- Do not create any Stripe API routes yet — those are Phase 2
- The `stripe` package is only imported in `src/lib/stripe.ts` in this phase; nothing calls it

## References

- `docs/stripe-integration-plan.md` — full plan
