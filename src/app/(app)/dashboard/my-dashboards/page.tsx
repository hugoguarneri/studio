
'use client';

import { DashboardView, ViewMode } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function MyDashboardsPage({ viewMode }: { viewMode: ViewMode }) {
  const myDashboards = dashboards.filter(d => d.role === 'Owner');
  return <DashboardView dashboards={myDashboards} viewMode={viewMode} />;
}
