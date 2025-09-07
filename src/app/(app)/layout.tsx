
import AppShell from '@/components/layout/app-shell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
    </AppShell>
  );
}
