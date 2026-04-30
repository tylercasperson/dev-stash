export async function startCheckout(interval: 'monthly' | 'yearly'): Promise<void> {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interval }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

export async function openPortal(): Promise<void> {
  const res = await fetch('/api/stripe/portal', { method: 'POST' });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}
