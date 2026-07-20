import LogoutButton from './LogoutButton';
import AdminProviders from './providers';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <div className="min-h-screen bg-bg">
        <header className="border-b border-border-subtle bg-surface">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-black tracking-tight text-text-primary">Bitsbuffer Admin</p>
              <p className="text-xs text-text-muted">Blog panel</p>
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </AdminProviders>
  );
}
