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

export default function SampleDataTable() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Fulfilled': return 'default';
      case 'Processing': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
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
              <TableCell className="font-medium font-code">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
              </TableCell>
              <TableCell className="text-right font-code">${order.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
