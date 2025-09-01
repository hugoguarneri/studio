
'use client';

import DashboardGroupsView from '@/components/dashboard/dashboard-groups-view';
import { dashboards, dashboardGroups } from '@/lib/mock-data';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function GroupsPage() {
  const [dashboardsState, setDashboardsState] = useState(dashboards);
  const { toast } = useToast();

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

  const handleShare = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    toast({
      title: "Shared Dashboard",
      description: `"${dashboard?.name}" has been shared.`,
    });
  }

  const handleCopyLink = () => {
    // This is a placeholder. In a real app, you would copy the group link.
    toast({
      title: "Link Copied",
      description: "Group link copied to clipboard.",
    });
  };

  const actionProps = {
    onFavoriteToggle: handleFavoriteToggle,
    onDelete: handleDelete,
    onLeave: handleLeave,
    onShare: handleShare,
    onCopyLink: handleCopyLink,
  };

  return (
    <DashboardGroupsView
        dashboards={dashboardsState}
        groups={dashboardGroups}
        actionProps={actionProps}
    />
  );
}
