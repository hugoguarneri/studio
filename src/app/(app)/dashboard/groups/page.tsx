
'use client';

import DashboardGroupsView from '@/components/dashboard/dashboard-groups-view';
import { dashboards, dashboardGroups } from '@/lib/mock-data';

export default function GroupsPage() {
  return (
    <DashboardGroupsView
      dashboards={dashboards}
      groups={dashboardGroups}
    />
  );
}
