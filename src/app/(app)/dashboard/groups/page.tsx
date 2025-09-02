
'use client';

import DashboardGroupsView from '@/components/dashboard/dashboard-groups-view';
import { dashboards, dashboardGroups } from '@/lib/mock-data';
import { ViewMode } from '../page';

export default function GroupsPage({ viewMode }: { viewMode: ViewMode }) {
  return (
    <DashboardGroupsView
      dashboards={dashboards}
      groups={dashboardGroups}
      viewMode={viewMode}
    />
  );
}
