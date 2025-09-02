
'use client';

import { DashboardView, ViewMode } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function SharedWithMePage({ viewMode }: { viewMode: ViewMode }) {
  const sharedWithMeDashboards = dashboards.filter(d => d.role !== 'Owner');
  return <DashboardView dashboards={sharedWithMeDashboards} viewMode={viewMode} />;
}
