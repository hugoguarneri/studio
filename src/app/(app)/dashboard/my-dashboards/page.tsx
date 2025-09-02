
'use client';

import { DashboardView } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function MyDashboardsPage() {
  const myDashboards = dashboards.filter(d => d.role === 'Owner');
  return <DashboardView dashboards={myDashboards} />;
}
