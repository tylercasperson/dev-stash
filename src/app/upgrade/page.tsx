import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import UpgradePage from '@/components/upgrade/UpgradePage';

export default async function UpgradeRoute() {
  const session = await auth();
  if (session?.user?.isPro) redirect('/dashboard');

  return <UpgradePage />;
}
