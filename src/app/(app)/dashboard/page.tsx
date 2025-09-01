
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, LayoutGrid, List, Search } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboards, dashboardGroups } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { Input } from '@/components/ui/input';
import DashboardGroupsView from '@/components/dashboard/dashboard-groups-view';

const getRoleStyles = (role: string) => {
  switch (role) {
    case 'Owner':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Editor':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

export const DashboardCard = ({ dashboard }: { dashboard: (typeof dashboards)[0] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl">
            {dashboard.name}
          </CardTitle>
          <div
            className={`text-xs font-medium py-1 px-2 rounded-md border ${getRoleStyles(
              dashboard.role
            )}`}
          >
            {dashboard.role}
          </div>
        </div>
        <CardDescription className="truncate">{dashboard.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src={dashboard.owner.avatarUrl} alt={dashboard.owner.name} />
                <AvatarFallback>{dashboard.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Owned by {dashboard.owner.name}
            </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild className="w-full">
          <Link href={`/dashboard/${dashboard.id}`}>Open</Link>
        </Button>
        <Button variant="outline" disabled={dashboard.role !== 'Owner'}>
          <Users className="mr-2" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

const DashboardGrid = ({ dashboards }: { dashboards: (typeof dashboards) }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {dashboards.map(dashboard => (
      <DashboardCard key={dashboard.id} dashboard={dashboard} />
    ))}
  </div>
);

const DashboardListItem = ({ dashboard }: { dashboard: (typeof dashboards)[0] }) => (
  <TableRow>
    <TableCell>
      <div className="flex flex-col">
        <Link href={`/dashboard/${dashboard.id}`} className="font-medium font-headline text-base hover:underline">
          {dashboard.name}
        </Link>
        <span className="text-sm text-muted-foreground truncate">{dashboard.description}</span>
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={dashboard.owner.avatarUrl} alt={dashboard.owner.name} />
          <AvatarFallback>{dashboard.owner.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{dashboard.owner.name}</span>
      </div>
    </TableCell>
    <TableCell>
      <div
        className={`text-xs font-medium py-1 px-2 rounded-md border text-center w-fit ${getRoleStyles(
          dashboard.role
        )}`}
      >
        {dashboard.role}
      </div>
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/${dashboard.id}`}>Open</Link>
        </Button>
        <Button variant="ghost" size="sm" disabled={dashboard.role !== 'Owner'}>
          <Users className="mr-2" /> Share
        </Button>
      </div>
    </TableCell>
  </TableRow>
);


const DashboardList = ({ dashboards }: { dashboards: (typeof dashboards) }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dashboards.map(dashboard => (
          <DashboardListItem key={dashboard.id} dashboard={dashboard} />
        ))}
      </TableBody>
    </Table>
  </Card>
);

export type ViewMode = 'grid' | 'list';

const DashboardView = ({ dashboards, viewMode }: { dashboards: (typeof dashboards), viewMode: ViewMode }) => {
  const ITEMS_PER_PAGE = viewMode === 'list' ? 5 : 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDashboards = dashboards.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDashboards.length / ITEMS_PER_PAGE);
  const paginatedDashboards = filteredDashboards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to page 1 when dashboards, viewMode or searchTerm change
  useState(() => {
    setCurrentPage(1);
  });

  if (dashboards.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No dashboards found for this category.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search in this section..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDashboards.length === 0 ? (
         <div className="text-center text-muted-foreground py-12">
          No dashboards found matching your search.
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <DashboardList dashboards={paginatedDashboards} />
          ) : (
            <DashboardGrid dashboards={paginatedDashboards} />
          )}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};


export default function DashboardListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const favoriteDashboards = dashboards.filter(d => d.isFavorite);
  const myDashboards = dashboards.filter(d => d.role === 'Owner');
  const sharedWithMeDashboards = dashboards.filter(d => d.role !== 'Owner');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Dashboards
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and share your data dashboards.
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                >
                    <LayoutGrid className="h-5 w-5" />
                    <span className="sr-only">Grid View</span>
                </Button>
                <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                >
                    <List className="h-5 w-5" />
                    <span className="sr-only">List View</span>
                </Button>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Dashboard
            </Button>
        </div>
      </div>
      
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="my-dashboards">My Dashboards</TabsTrigger>
          <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="my-dashboards" className="mt-6">
            <DashboardView dashboards={myDashboards} viewMode={viewMode} />
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <DashboardView dashboards={favoriteDashboards} viewMode={viewMode} />
        </TabsContent>
        <TabsContent value="shared-with-me" className="mt-6">
          <DashboardView dashboards={sharedWithMeDashboards} viewMode={viewMode} />
        </TabsContent>
        <TabsContent value="groups" className="mt-6">
          <DashboardGroupsView
            dashboards={dashboards}
            groups={dashboardGroups}
            viewMode={viewMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
