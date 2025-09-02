
'use client';

import { DashboardView } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function MyDashboardsPage() {
  const myDashboards = dashboards.filter(d => d.role === 'Owner');
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-headline">My Dashboards</h1>
        <p className="text-muted-foreground">Dashboards you have created or own.</p>
      </div>
      <DashboardView dashboards={myDashboards} />
    </div>
  );
}
