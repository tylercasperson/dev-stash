import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getProfileData } from '@/lib/db/profile';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';
import DeleteAccountDialog from '@/components/settings/DeleteAccountDialog';
import EditorPreferencesForm from '@/components/settings/EditorPreferencesForm';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const { user } = await getProfileData(session.user.id);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings and security.</p>
      </div>

      {/* Editor preferences */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Editor preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">Customize the code editor appearance and behavior. Changes are saved automatically.</p>
        </div>
        <EditorPreferencesForm />
      </section>

      {/* Change password (email users only) */}
      {user.hasPassword && (
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Password</h2>
            <p className="mt-1 text-sm text-muted-foreground">Update the password for your account.</p>
          </div>
          <ChangePasswordForm />
        </section>
      )}

      {/* Danger zone */}
      <section className="rounded-lg border border-destructive/30 bg-card p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Permanently delete your account and all associated data.
          </p>
        </div>
        <DeleteAccountDialog />
      </section>

    </div>
  );
}
