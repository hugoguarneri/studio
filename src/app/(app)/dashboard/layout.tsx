
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from './page';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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
      
      {/* Pass viewMode to children */}
      {children && typeof children === 'object' && 'type' in children && 
        (children as any).type.render?.({ viewMode })
      }
      {/* We need to render children manually if it's not a server component */}
      {!(children && typeof children === 'object' && 'type' in children) && 
        (children as any)?.({ viewMode })
      }
    </div>
  );
}

// Helper to pass props to children
const DashboardPageWrapper = (Page: any) => {
    return function DashboardPageWithViewMode(props: any) {
        return <Page {...props} />
    }
}
