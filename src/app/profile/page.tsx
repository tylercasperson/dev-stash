import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getProfileData } from '@/lib/db/profile';
import { ICON_MAP } from '@/lib/icon-map';
import UserAvatar from '@/components/ui/UserAvatar';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import DeleteAccountDialog from '@/components/profile/DeleteAccountDialog';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const { user, stats } = await getProfileData(session.user.id);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your account information and usage stats.</p>
        </div>

        {/* User info */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Account</h2>
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name ?? user.email} image={user.image} className="h-16 w-16 text-base" />
            <div className="space-y-1">
              {user.name && <p className="text-base font-medium text-foreground">{user.name}</p>}
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Joined {formatDate(user.createdAt)}</p>
            </div>
          </div>
        </section>

        {/* Usage stats */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Usage</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* Totals */}
            <div className="rounded-md border border-border bg-background p-4">
              <p className="text-2xl font-bold text-foreground">{stats.totalItems}</p>
              <p className="text-xs text-muted-foreground mt-1">Total items</p>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <p className="text-2xl font-bold text-foreground">{stats.totalCollections}</p>
              <p className="text-xs text-muted-foreground mt-1">Total collections</p>
            </div>
          </div>

          {/* Per-type breakdown */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">By type</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {stats.typeCounts.map((t) => {
                const Icon = ICON_MAP[t.icon];
                return (
                  <div
                    key={t.name}
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" style={{ color: t.color }} />}
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{t.name}s</p>
                      <p className="text-xs text-muted-foreground">{t.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
    </div>
  );
}
