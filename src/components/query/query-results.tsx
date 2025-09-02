
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { recentOrders } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Eye, Settings, Table2 } from 'lucide-react';
import SampleBarChart from '../dashboard/sample-bar-chart';
import { ScrollArea } from '../ui/scroll-area';

const ChartSettings = () => (
    <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">Chart settings placeholder</p>
        <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure
        </Button>
    </div>
)

export default function QueryResults() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Fulfilled':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Results</CardTitle>
        <CardDescription>
          The output of your query will be displayed here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="data">
          <div className="flex justify-between items-start">
            <TabsList>
              <TabsTrigger value="data">
                <Table2 className="mr-2 h-4 w-4" />
                Data
              </TabsTrigger>
              <TabsTrigger value="chart">
                <BarChart className="mr-2 h-4 w-4" />
                Chart
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-0">
                <ChartSettings />
            </TabsContent>
          </div>

          <TabsContent value="data">
            <ScrollArea className="h-[350px] w-full mt-4">
                <div className="w-full rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                        <TableCell className="font-medium font-code">
                            {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(order.status) as any}>
                            {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right font-code">
                            ${order.amount.toFixed(2)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="chart" className="h-[350px]">
            <SampleBarChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
