

'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from './page';
import { usePathname } from 'next/navigation';

const getPageTitle = (pathname: string) => {
    switch (pathname) {
        case '/dashboard':
            return 'Dashboards';
        case '/dashboard/my-dashboards':
            return 'My Dashboards';
        case '/dashboard/favorites':
            return 'Favorite Dashboards';
        case '/dashboard/shared-with-me':
            return 'Shared With Me';
        case '/dashboard/groups':
            return 'Dashboard Groups';
        default:
            if (pathname.startsWith('/dashboard/')) {
                return 'Dashboard';
            }
            return 'Dashboards';
    }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const pathname = usePathname();

  const pageTitle = getPageTitle(pathname);
  const isIndividualDashboard = pathname.match(/^\/dashboard\/(?!my-dashboards|favorites|shared-with-me|groups)[^/]+$/);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and share your data dashboards.
          </p>
        </div>
        <div className="flex items-center gap-4">
            {!isIndividualDashboard && (
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
      
      {React.cloneElement(children as React.ReactElement, { viewMode })}
    </div>
  );
}
