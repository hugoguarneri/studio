
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
import { dashboards as allDashboards, dashboardGroups as allGroups } from '@/lib/mock-data';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const DASHBOARDS_PREVIEW_LIMIT_GRID = 3;
const DASHBOARDS_PREVIEW_LIMIT_LIST = 2;


const GroupContent = ({
  dashboards,
  viewMode,
}: {
  dashboards: (typeof allDashboards);
  viewMode: ViewMode;
}) => {
  const [showAll, setShowAll] = useState(false);
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
        <DashboardList dashboards={dashboardsToShow} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dashboardsToShow.map(dashboard => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} />
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
  viewMode,
}: {
  group: (typeof allGroups)[0];
  dashboards: (typeof allDashboards);
  viewMode: ViewMode;
}) => {
  return (
    <AccordionItem value={group.id} className="border-b-0">
      <Card className="overflow-hidden">
        <AccordionTrigger className="p-6 hover:no-underline data-[state=closed]:border-b-0">
            <h2 className="text-2xl font-bold font-headline">{group.name}</h2>
        </AccordionTrigger>
      </Card>
      <AccordionContent className="p-6">
          <GroupContent dashboards={dashboards} viewMode={viewMode} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default function DashboardGroupsView({
  dashboards,
  groups,
  viewMode,
}: {
  dashboards: (typeof allDashboards);
  groups: (typeof allGroups);
  viewMode: ViewMode;
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
        <Accordion type="multiple" defaultValue={defaultOpenItems} className="space-y-8">
          {filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              dashboards={group.dashboards}
              viewMode={viewMode}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
