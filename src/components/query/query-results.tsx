
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
import { recentOrders } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Settings, Table2 } from 'lucide-react';
import SampleBarChart from '../dashboard/sample-bar-chart';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

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
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Results</CardTitle>
        <CardDescription>
          The output of your query will be displayed here.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0">
        <Tabs defaultValue="data" className="flex flex-col flex-1">
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

          <TabsContent value="data" className="flex-1 flex flex-col mt-4 min-h-0">
            <ScrollArea className="flex-1 relative">
                <Table className="h-full">
                    <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                        <TableHead className="sticky left-0 bg-card w-[60px]">Row</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Country</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentOrders.map((order, index) => (
                        <TableRow key={order.id}>
                        <TableCell className="sticky left-0 bg-card text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium font-code">
                            {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell className="text-right font-code">{order.quantity}</TableCell>
                        <TableCell>
                           {order.status}
                        </TableCell>
                        <TableCell className="text-right font-code">
                            ${order.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{order.country}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
              <ScrollBar orientation="horizontal" />
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
