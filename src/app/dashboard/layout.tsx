import DashboardShell from '@/components/layout/DashboardShell';
import { getSidebarData } from '@/lib/db/collections';
import { DEMO_USER_ID, DEMO_USER_NAME, DEMO_USER_EMAIL } from '@/lib/demo';

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
