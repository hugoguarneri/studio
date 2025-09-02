
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import SampleBarChart from '@/components/dashboard/sample-bar-chart';
import SampleLineChart from '@/components/dashboard/sample-line-chart';
import SampleDataTable from '@/components/dashboard/sample-data-table';
import DashboardWidget from '@/components/dashboard/dashboard-widget';
import SamplePieChart from '@/components/dashboard/sample-pie-chart';

export default function DashboardPage({ params, viewMode }: { params: { dashboardId: string }, viewMode: any }) {
  const [refreshInterval] = useState(30); // in seconds
  const [, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    if (refreshInterval > 0) {
      const timer = setInterval(() => {
        handleRefresh();
      }, refreshInterval * 1000);
      return () => clearInterval(timer);
    }
  }, [refreshInterval]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
        {/* Breadcrumbs now handle the title */}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardWidget title="Sales Over Time" className="lg:col-span-2">
          <SampleLineChart />
        </DashboardWidget>
        <DashboardWidget title="Sales by Category">
          <SampleBarChart />
        </DashboardWidget>
        <DashboardWidget title="User Demographics">
          <SamplePieChart />
        </DashboardWidget>
        <DashboardWidget title="Recent Orders" className="lg:col-span-3">
          <SampleDataTable />
        </DashboardWidget>
      </div>
    </div>
  );
}
