import DashboardShell from '@/components/layout/DashboardShell';
import { getSidebarData } from '@/lib/db/collections';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  const userId = user?.id ?? DEMO_USER_ID;
  const sidebarData = await getSidebarData(userId);

  return (
    <DashboardShell
      sidebarData={sidebarData}
      userName={user?.name ?? user?.email ?? 'User'}
      userEmail={user?.email ?? ''}
      userImage={user?.image}
    >
      {children}
    </DashboardShell>
  );
}
