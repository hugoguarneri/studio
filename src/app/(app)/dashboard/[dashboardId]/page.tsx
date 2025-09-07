
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, X, Save, Pencil, Trash2 } from 'lucide-react';
import SampleBarChart from '@/components/dashboard/sample-bar-chart';
import SampleLineChart from '@/components/dashboard/sample-line-chart';
import SampleDataTable from '@/components/dashboard/sample-data-table';
import DashboardWidget from '@/components/dashboard/dashboard-widget';
import SamplePieChart from '@/components/dashboard/sample-pie-chart';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { cn } from '@/lib/utils';

type WidgetData = {
  id: string;
  title: string;
  component: React.ReactNode;
  defaultSize: { width: string | number; height: string | number };
  colSpan?: number;
  rowSpan?: number;
};

const initialWidgets: WidgetData[] = [
    { id: '1', title: 'Sales Over Time', component: <SampleLineChart />, defaultSize: { width: '100%', height: 350 }, colSpan: 2 },
    { id: '2', title: 'Sales by Category', component: <SampleBarChart />, defaultSize: { width: '100%', height: 350 } },
    { id: '3', title: 'User Demographics', component: <SamplePieChart />, defaultSize: { width: '100%', height: 350 } },
    { id: '4', title: 'Recent Orders', component: <SampleDataTable />, defaultSize: { width: '100%', height: 400 }, colSpan: 3 },
]

export default function DashboardPage({ params }: { params: { dashboardId: string }}) {
  const [refreshInterval] = useState(30); // in seconds
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [widgets, setWidgets] = useState(initialWidgets);

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
    setIsEditing(false);
  }

  const handleSave = () => {
    // Here you would save the new widget layout
    setIsEditing(false);
  }

  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  }

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
      <div className={cn("grid gap-6 auto-rows-min", isEditing ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3")}>
        {widgets.map(widget => (
          <div key={widget.id} className={cn(!isEditing && `lg:col-span-${widget.colSpan || 1}`)}>
            {isEditing ? (
                <ResizableBox 
                    width={Infinity} 
                    height={widget.defaultSize.height as number} 
                    className="relative bg-card shadow-md rounded-lg border-2 border-dashed border-primary/50 p-1"
                    minConstraints={[150, 150]}
                >
                    <DashboardWidget 
                        title={widget.title}
                        className="shadow-none border-none h-full"
                    >
                        {widget.component}
                    </DashboardWidget>
                     <div className="absolute top-2 right-2 flex gap-1 bg-card/80 p-1 rounded-md">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={() => handleDeleteWidget(widget.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </ResizableBox>
            ) : (
                <DashboardWidget title={widget.title} className={cn('h-full', `lg:col-span-${widget.colSpan}`)}>
                    {widget.component}
                </DashboardWidget>
            )}
          </div>
        ))}
         {isEditing && (
            <Button variant="outline" className="h-full min-h-[150px] border-dashed border-2 flex-col gap-2 text-muted-foreground">
                <PlusCircle className="h-6 w-6" />
                <span>Add Widget</span>
            </Button>
         )}
      </div>
    </div>
  );
}
