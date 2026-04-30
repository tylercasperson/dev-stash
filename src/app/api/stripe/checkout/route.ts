import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/api-utils';
import { BASE_URL } from '@/lib/constants';

const VALID_INTERVALS = ['monthly', 'yearly'] as const;
type Interval = (typeof VALID_INTERVALS)[number];

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const body = await req.json().catch(() => ({}));
  const interval: Interval = VALID_INTERVALS.includes(body.interval) ? body.interval : 'monthly';

  const priceId =
    interval === 'yearly'
      ? process.env.STRIPE_PRICE_ID_YEARLY
      : process.env.STRIPE_PRICE_ID_MONTHLY;

  if (!priceId) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, stripeCustomerId: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: user.stripeCustomerId ?? undefined,
    customer_email: user.stripeCustomerId ? undefined : (user.email ?? undefined),
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${BASE_URL}/settings?success=true`,
    cancel_url: `${BASE_URL}/settings`,
    metadata: { userId: userId },
    subscription_data: { metadata: { userId: userId } },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
