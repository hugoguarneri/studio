
'use client';

import { redirect, usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, LayoutGrid, List, Search, Star, User, Box, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboards as allDashboards, dashboardGroups } from '@/lib/mock-data';
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
import { useState, useEffect } from 'react';
import DashboardGroupsView from "@/components/dashboard/dashboard-groups-view";
import DashboardSectionCard from "@/components/dashboard/dashboard-section-card";

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

export const DashboardCard = ({ dashboard }: { dashboard: (typeof allDashboards)[0] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl truncate">
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

const DashboardGrid = ({ dashboards }: { dashboards: (typeof allDashboards) }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {dashboards.map(dashboard => (
      <DashboardCard key={dashboard.id} dashboard={dashboard} />
    ))}
  </div>
);

const DashboardListItem = ({ dashboard }: { dashboard: (typeof allDashboards)[0] }) => (
  <TableRow>
    <TableCell>
      <div className="flex flex-col">
        <Link href={`/dashboard/${dashboard.id}`} className="font-medium font-headline text-base hover:underline truncate">
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


export const DashboardList = ({ dashboards }: { dashboards: (typeof allDashboards) }) => (
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

export const DashboardView = ({ dashboards, viewMode }: { dashboards: (typeof allDashboards), viewMode: ViewMode }) => {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [dashboards, viewMode, searchTerm]);

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

const sections = [
  { 
    href: "/dashboard/my-dashboards", 
    icon: User,
    title: "My Dashboards", 
    description: "Dashboards you have created and own." 
  },
  { 
    href: "/dashboard/favorites", 
    icon: Star,
    title: "Favorites", 
    description: "Your collection of most-used dashboards." 
  },
  { 
    href: "/dashboard/shared-with-me", 
    icon: Users,
    title: "Shared with Me", 
    description: "Dashboards that others have shared with you." 
  },
  { 
    href: "/dashboard/groups", 
    icon: Box,
    title: "Groups", 
    description: "Collaborate with your team in shared spaces." 
  },
];


export default function DashboardListPage() {
  const pathname = usePathname();
  
  if (pathname !== '/dashboard') {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section) => (
        <DashboardSectionCard key={section.href} {...section} />
      ))}
    </div>
  )
}
