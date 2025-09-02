
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
import { Resizable } from 'react-resizable';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import 'react-resizable/css/styles.css';

const ResizableHeader = ({ onResize, width, children, className }: { onResize: any, width: number, children: React.ReactNode, className?: string }) => (
  <Resizable
    width={width || 150}
    height={0}
    handle={<span className="absolute bottom-0 right-0 top-0 w-1 cursor-col-resize bg-border" />}
    onResize={onResize}
    draggableOpts={{ enableUserSelectHack: false }}
  >
    <TableHead style={{ width: `${width}px` }} className={cn("sticky top-0 z-10 bg-card", className)}>
        {children}
    </TableHead>
  </Resizable>
);

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
    const initialWidths = {
        id: 150,
        customer: 200,
        product: 200,
        quantity: 100,
        status: 120,
        amount: 150,
        country: 150,
    };
    const [widths, setWidths] = useState(initialWidths);

    const handleResize = (key: keyof typeof initialWidths) => (e: any, { size }: any) => {
        setWidths(prev => ({ ...prev, [key]: size.width }));
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
            <ScrollArea className="h-[350px] w-full mt-4 rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="sticky top-0 z-10 bg-card w-[50px]">Row</TableHead>
                        <ResizableHeader onResize={handleResize('id')} width={widths.id}>
                            Order ID
                        </ResizableHeader>
                        <ResizableHeader onResize={handleResize('customer')} width={widths.customer}>
                            Customer
                        </ResizableHeader>
                        <ResizableHeader onResize={handleResize('product')} width={widths.product}>
                            Product
                        </ResizableHeader>
                        <ResizableHeader onResize={handleResize('quantity')} width={widths.quantity} className="text-right">
                            Quantity
                        </ResizableHeader>
                        <ResizableHeader onResize={handleResize('status')} width={widths.status}>
                            Status
                        </ResizableHeader>
                        <ResizableHeader onResize={handleResize('amount')} width={widths.amount} className="text-right">
                           Amount
                        </ResizableHeader>
                         <ResizableHeader onResize={handleResize('country')} width={widths.country}>
                            Country
                        </ResizableHeader>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentOrders.map((order, index) => (
                        <TableRow key={order.id}>
                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
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
