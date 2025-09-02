
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from './page';
import { usePathname } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Link from 'next/link';

const dashboardTabs = [
    { href: "/dashboard/my-dashboards", label: "My Dashboards" },
    { href: "/dashboard/favorites", label: "Favorites" },
    { href: "/dashboard/shared-with-me", label: "Shared with me" },
    { href: "/dashboard/groups", label: "Groups" },
];

const getPageTitle = (pathname: string) => {
    switch (pathname) {
        case '/dashboard/my-dashboards':
            return 'My Dashboards';
        case '/dashboard/favorites':
            return 'Favorite Dashboards';
        case '/dashboard/shared-with-me':
            return 'Shared With Me';
        case '/dashboard/groups':
            return 'Dashboard Groups';
        default:
            return 'Dashboards'
    }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const pathname = usePathname();

  const isGroupsPage = pathname === '/dashboard/groups';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and share your data dashboards.
          </p>
        </div>
        <div className="flex items-center gap-4">
            {!isGroupsPage && (
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
            )}
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Dashboard
            </Button>
        </div>
      </div>
      
      {/* Pass viewMode to children */}
      {React.cloneElement(children as React.ReactElement, { viewMode })}
    </div>
  );
}
