import DashboardShell from '@/components/layout/DashboardShell';
import { getSidebarData } from '@/lib/db/collections';
import { getEditorPreferences } from '@/lib/db/profile';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  const userId = user?.id ?? DEMO_USER_ID;
  const [sidebarData, editorPreferences] = await Promise.all([
    getSidebarData(userId),
    getEditorPreferences(userId),
  ]);

  return (
    <DashboardShell
      sidebarData={sidebarData}
      userName={user?.name ?? user?.email ?? 'User'}
      userEmail={user?.email ?? ''}
      userImage={user?.image}
      initialEditorPreferences={editorPreferences}
    >
      {children}
    </DashboardShell>
  );
}
