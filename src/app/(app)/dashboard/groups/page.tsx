
'use client';

import DashboardGroupsView from '@/components/dashboard/dashboard-groups-view';
import { dashboards, dashboardGroups } from '@/lib/mock-data';
import { useState } from 'react';

export default function GroupsPage() {
  const [dashboardsState, setDashboardsState] = useState(dashboards);

  const handleFavoriteToggle = (id: string) => {
    setDashboardsState(dashboardsState.map(d => 
      d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
    ));
  };

  const handleDelete = (id: string) => {
    setDashboardsState(dashboardsState.filter(d => d.id !== id));
  };

  const handleLeave = (id: string) => {
    setDashboardsState(dashboardsState.filter(d => d.id !== id));
  };

  const actionProps = {
    onFavoriteToggle: handleFavoriteToggle,
    onDelete: handleDelete,
    onLeave: handleLeave,
  };

  return (
    <DashboardGroupsView
      dashboards={dashboardsState}
      groups={dashboardGroups}
      actionProps={actionProps}
    />
  );
}
