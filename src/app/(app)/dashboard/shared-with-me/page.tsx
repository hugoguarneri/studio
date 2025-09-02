
'use client';

import { DashboardView } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function SharedWithMePage() {
  const sharedWithMeDashboards = dashboards.filter(d => d.role !== 'Owner');
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-headline">Shared with me</h1>
        <p className="text-muted-foreground">Dashboards shared by other users.</p>
      </div>
      <DashboardView dashboards={sharedWithMeDashboards} />
    </div>
  );
}
