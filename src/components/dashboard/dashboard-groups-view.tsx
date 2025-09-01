


'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { DashboardCard, DashboardList, type ViewMode } from '@/app/(app)/dashboard/page';
import { dashboards as allDashboards, dashboardGroups as allGroups, type Dashboard } from '@/lib/mock-data';
import { Button } from '../ui/button';
import { useSearchParams } from 'next/navigation';

const DASHBOARDS_PREVIEW_LIMIT_GRID = 3;
const DASHBOARDS_PREVIEW_LIMIT_LIST = 2;

type DashboardActionsProps = {
    onFavoriteToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onLeave: (id: string) => void;
    onShare: (id: string) => void;
    onCopyLink: (id: string) => void;
};


const GroupContent = ({
  dashboards,
  actionProps,
}: {
  dashboards: (typeof allDashboards);
  actionProps: Omit<DashboardActionsProps, 'dashboard'>;
}) => {
  const [showAll, setShowAll] = useState(false);
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get('view') as ViewMode) || 'grid';
  const limit = viewMode === 'list' ? DASHBOARDS_PREVIEW_LIMIT_LIST : DASHBOARDS_PREVIEW_LIMIT_GRID;
  const dashboardsToShow = showAll ? dashboards : dashboards.slice(0, limit);

  if (dashboards.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No dashboards in this group.
      </div>
    );
  }

  return (
    <>
      {viewMode === 'list' ? (
        <DashboardList dashboards={dashboardsToShow} {...actionProps} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dashboardsToShow.map(dashboard => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} {...actionProps} />
          ))}
        </div>
      )}

      {dashboards.length > limit && (
        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : `Show All (${dashboards.length})`}
          </Button>
        </div>
      )}
    </>
  );
};


const GroupCard = ({
  group,
  dashboards,
  actionProps,
}: {
  group: (typeof allGroups)[0];
  dashboards: (typeof allDashboards);
  actionProps: Omit<DashboardActionsProps, 'dashboard'>;
}) => {
  return (
    <AccordionItem value={group.id} className="border-0">
      <AccordionTrigger className="py-2 px-4 hover:no-underline rounded-md bg-muted shadow-sm data-[state=closed]:border-b-0 flex items-center">
          <h2 className="text-xl font-bold font-headline">{group.name}</h2>
      </AccordionTrigger>
      <AccordionContent className="pt-6">
          <GroupContent dashboards={dashboards} actionProps={actionProps} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default function DashboardGroupsView({
  dashboards,
  groups,
  actionProps
}: {
  dashboards: Dashboard[];
  groups: (typeof allGroups);
  actionProps: Omit<DashboardActionsProps, 'dashboard'>;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups
    .map(group => {
      const dashboardsInGroup = dashboards.filter(
        d =>
          d.groupId === group.id &&
          d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...group, dashboards: dashboardsInGroup };
    })
    .filter(
      group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.dashboards.length > 0
    );

  const defaultOpenItems = filteredGroups.map(g => g.id);

  if (groups.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No groups found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by group or dashboard name..."
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No groups or dashboards found matching your search.
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={defaultOpenItems} className="space-y-4">
          {filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              dashboards={group.dashboards}
              actionProps={actionProps}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
