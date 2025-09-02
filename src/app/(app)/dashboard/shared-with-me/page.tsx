
'use client';

import { DashboardView } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function SharedWithMePage() {
  const sharedWithMeDashboards = dashboards.filter(d => d.role !== 'Owner');
  return (
    <DashboardView dashboards={sharedWithMeDashboards} />
  );
}
