import DashboardShell from '@/components/layout/DashboardShell';
import { getSidebarData } from '@/lib/db/collections';

// TODO: Replace with session user once auth is wired up
const DEMO_USER_ID = '8f50ae2c-e297-4e77-a03f-661ddf5f40bd';
const DEMO_USER_NAME = 'John Doe';
const DEMO_USER_EMAIL = 'demo@dev-stash.io';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarData = await getSidebarData(DEMO_USER_ID);

  const userInitials = DEMO_USER_NAME.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <DashboardShell
      sidebarData={sidebarData}
      userInitials={userInitials}
      userName={DEMO_USER_NAME}
      userEmail={DEMO_USER_EMAIL}
    >
      {children}
    </DashboardShell>
  );
}
