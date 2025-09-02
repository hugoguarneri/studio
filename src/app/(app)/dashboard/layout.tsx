
'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from './page';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get('view') as ViewMode) || 'grid';
  
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const isDashboardSubPage = /^\/dashboard\/(my-dashboards|favorites|shared-with-me|groups)$/.test(pathname);
  const isAllDashboardsPage = pathname === '/dashboard';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          {isAllDashboardsPage && (
            <div>
              <h1 className="text-2xl font-bold font-headline">Dashboards</h1>
              <p className="text-muted-foreground">
                Create, manage, and share your data dashboards.
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
            {(isDashboardSubPage || isAllDashboardsPage) && (
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        asChild
                    >
                        <Link href={`${pathname}?${createQueryString('view', 'grid')}`}>
                          <LayoutGrid className="h-5 w-5" />
                          <span className="sr-only">Grid View</span>
                        </Link>
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        asChild
                    >
                        <Link href={`${pathname}?${createQueryString('view', 'list')}`}>
                          <List className="h-5 w-5" />
                          <span className="sr-only">List View</span>
                        </Link>
                    </Button>
                </div>
            )}
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Dashboard
            </Button>
        </div>
      </div>
      
      {children}
    </div>
  );
}
