
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
    Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Database, Folder, RefreshCw, Search, Table2Icon } from 'lucide-react';
import { connections } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';

const schemaContent = [
    { name: 'users', columns: ['id', 'name', 'email', 'signup_date', 'last_login'] },
    { name: 'orders', columns: ['id', 'user_id', 'amount', 'created_at', 'status'] },
    { name: 'products', columns: ['id', 'name', 'price', 'category', 'stock_quantity'] },
    { name: 'sessions', columns: ['id', 'user_id', 'start_time', 'end_time', 'ip_address'] },
    { name: 'events', columns: ['id', 'name', 'properties', 'timestamp'] },
    { name: 'pageviews', columns: ['id', 'path', 'user_id', 'timestamp', 'referrer'] },
    { name: 'employees', columns: ['employee_id', 'first_name', 'last_name', 'hire_date', 'department_id'] },
    { name: 'departments', columns: ['department_id', 'department_name', 'manager_id'] },
    { name: 'customers', columns: ['customer_id', 'company_name', 'contact_name', 'country'] },
    { name: 'suppliers', columns: ['supplier_id', 'company_name', 'contact_name', 'city', 'country'] },
    { name: 'invoices', columns: ['invoice_id', 'customer_id', 'invoice_date', 'total_amount'] },
    { name: 'invoice_items', columns: ['item_id', 'invoice_id', 'product_id', 'quantity', 'unit_price'] },
];

export default function DatabaseSchema() {
  return (
    <Card className="flex flex-col h-full">
        <CardContent className="p-4 flex flex-col gap-4">
            <Select>
                <SelectTrigger id="connection">
                    <SelectValue placeholder="Select a database" />
                </SelectTrigger>
                <SelectContent>
                    {connections.map(conn => (
                        <SelectItem key={conn.id} value={conn.id}>{conn.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search schema..." className="pl-9" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8">
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>
            
            <ScrollArea className="flex-1 h-[240px]">
                <Accordion type="multiple" defaultValue={['tables']} className="pr-2">
                    <AccordionItem value="tables">
                        <AccordionTrigger className="text-sm font-semibold">
                            <div className='flex items-center gap-2'>
                                <Folder className="h-4 w-4" />
                                Tables
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="multiple" className="space-y-1">
                                {schemaContent.map(table => (
                                <AccordionItem key={table.name} value={table.name}>
                                    <AccordionTrigger className="text-xs py-1.5 px-2 hover:bg-muted rounded-md">
                                        <div className='flex items-center gap-2'>
                                            <Table2Icon className="h-3 w-3" />
                                            {table.name}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4 pt-1 pb-0">
                                        <div className="flex flex-col gap-1">
                                            {table.columns.map(col => (
                                                <div key={col} className="text-xs text-muted-foreground py-1 px-2">{col}</div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
