
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, X, Save, Pencil, Trash2 } from 'lucide-react';
import SampleBarChart from '@/components/dashboard/sample-bar-chart';
import SampleLineChart from '@/components/dashboard/sample-line-chart';
import SampleDataTable from '@/components/dashboard/sample-data-table';
import DashboardWidget from '@/components/dashboard/dashboard-widget';
import SamplePieChart from '@/components/dashboard/sample-pie-chart';
import { cn } from '@/lib/utils';
import GridLayout, { type Layout } from 'react-grid-layout';

type WidgetData = {
  id: string;
  title: string;
  component: React.ReactNode;
};

const initialWidgets: WidgetData[] = [
    { id: '1', title: 'Sales Over Time', component: <SampleLineChart /> },
    { id: '2', title: 'Sales by Category', component: <SampleBarChart /> },
    { id: '3', title: 'User Demographics', component: <SamplePieChart /> },
    { id: '4', title: 'Recent Orders', component: <SampleDataTable /> },
]

const initialLayouts: Layout[] = [
    { i: '1', x: 0, y: 0, w: 6, h: 2 },
    { i: '2', x: 6, y: 0, w: 3, h: 2 },
    { i: '3', x: 9, y: 0, w: 3, h: 2 },
    { i: '4', x: 0, y: 2, w: 12, h: 2 },
];


export default function DashboardPage({ params }: { params: { dashboardId: string }}) {
  const [refreshInterval] = useState(30); // in seconds
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [widgets, setWidgets] = useState(initialWidgets);
  const [layouts, setLayouts] = useState<Layout[]>(initialLayouts);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000); // Simulate network delay
  };

  useEffect(() => {
    if (refreshInterval > 0 && !isEditing) {
      const timer = setInterval(() => {
        handleRefresh();
      }, refreshInterval * 1000);
      return () => clearInterval(timer);
    }
  }, [refreshInterval, isEditing]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  }

  const handleCancel = () => {
    // Here you might want to reset widgets to their original state
    setLayouts(initialLayouts);
    setIsEditing(false);
  }

  const handleSave = () => {
    // Here you would save the new widget layout
    // For now, we just log it to the console
    console.log('Saving layout:', layouts);
    setIsEditing(false);
  }

  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    setLayouts(layouts.filter(l => l.i !== id));
  }

  const onLayoutChange = (newLayout: Layout[]) => {
    if (isEditing) {
        setLayouts(newLayout);
    }
  }
  
  const backgroundStyle: React.CSSProperties = isEditing ? {
    background: 'repeating-dotted-background',
    backgroundSize: '20px 20px',
    backgroundImage: 'radial-gradient(circle at center, hsl(var(--border)) 1px, transparent 1.5px)',
    backgroundPosition: '0 0',
  } : {};


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Dashboard {params.dashboardId}</h1>
          <p className="text-muted-foreground">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <Button variant="outline" onClick={handleCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </>
            ) : (
                <>
                    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={handleEditToggle}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Widget
                    </Button>
                </>
            )}
        </div>
      </div>
      <div className="relative -m-2">
        <GridLayout
            className={cn("layout", isEditing && 'editing')}
            layout={layouts}
            cols={12}
            rowHeight={150}
            width={1200}
            onLayoutChange={onLayoutChange}
            isDraggable={isEditing}
            isResizable={isEditing}
            style={backgroundStyle}
        >
            {widgets.map(widget => (
                <div key={widget.id} className={cn(isEditing && "group")}>
                    <DashboardWidget
                        title={widget.title}
                        className="h-full shadow-md"
                    >
                        {widget.component}
                    </DashboardWidget>
                     {isEditing && (
                        <div className="absolute top-2 right-2 flex gap-1 bg-card/80 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-grab">
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={() => handleDeleteWidget(widget.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                     )}
                </div>
            ))}
        </GridLayout>
         {isEditing && (
            <div className="absolute bottom-4 right-4">
                <Button variant="outline" className="h-full min-h-[150px] border-dashed border-2 flex-col gap-2 text-muted-foreground">
                    <PlusCircle className="h-6 w-6" />
                    <span>Add Widget</span>
                </Button>
            </div>
         )}
      </div>
    </div>
  );
}
