
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
import { Badge } from '../ui/badge';

const schemaContent = [
    { 
        name: 'users', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'email', type: 'varchar(255)' },
            { name: 'signup_date', type: 'timestamp' },
            { name: 'last_login', type: 'timestamp' },
        ] 
    },
    { 
        name: 'orders', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'user_id', type: 'int', key: 'FK' },
            { name: 'amount', type: 'decimal(10, 2)' },
            { name: 'created_at', type: 'timestamp' },
            { name: 'status', type: 'varchar(50)' },
        ] 
    },
    { 
        name: 'products', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'price', type: 'decimal(10, 2)' },
            { name: 'category', type: 'varchar(100)' },
            { name: 'stock_quantity', type: 'int' },
        ] 
    },
    { 
        name: 'sessions', 
        columns: [
            { name: 'id', type: 'varchar(255)', key: 'PK' },
            { name: 'user_id', type: 'int', key: 'FK' },
            { name: 'start_time', type: 'timestamp' },
            { name: 'end_time', type: 'timestamp' },
            { name: 'ip_address', type: 'varchar(45)' },
        ] 
    },
    { 
        name: 'events', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'properties', type: 'json' },
            { name: 'timestamp', type: 'timestamp' },
        ] 
    },
    { 
        name: 'pageviews', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'path', type: 'varchar(255)' },
            { name: 'user_id', type: 'int', key: 'FK' },
            { name: 'timestamp', type: 'timestamp' },
            { name: 'referrer', type: 'varchar(255)' },
        ] 
    },
    { 
        name: 'employees', 
        columns: [
            { name: 'employee_id', type: 'int', key: 'PK' },
            { name: 'first_name', type: 'varchar(100)' },
            { name: 'last_name', type: 'varchar(100)' },
            { name: 'hire_date', type: 'date' },
            { name: 'department_id', type: 'int', key: 'FK' },
        ] 
    },
    { 
        name: 'departments', 
        columns: [
            { name: 'department_id', type: 'int', key: 'PK' },
            { name: 'department_name', type: 'varchar(100)' },
            { name: 'manager_id', type: 'int', key: 'FK' },
        ] 
    },
    { 
        name: 'customers', 
        columns: [
            { name: 'customer_id', type: 'varchar(10)', key: 'PK' },
            { name: 'company_name', type: 'varchar(255)' },
            { name: 'contact_name', type: 'varchar(255)' },
            { name: 'country', type: 'varchar(100)' },
        ] 
    },
    { 
        name: 'suppliers', 
        columns: [
            { name: 'supplier_id', type: 'int', key: 'PK' },
            { name: 'company_name', type: 'varchar(255)' },
            { name: 'contact_name', type: 'varchar(255)' },
            { name: 'city', type: 'varchar(100)' },
            { name: 'country', type: 'varchar(100)' },
        ] 
    },
    { 
        name: 'invoices', 
        columns: [
            { name: 'invoice_id', type: 'int', key: 'PK' },
            { name: 'customer_id', type: 'varchar(10)', key: 'FK' },
            { name: 'invoice_date', type: 'date' },
            { name: 'total_amount', type: 'decimal(10, 2)' },
        ] 
    },
    { 
        name: 'invoice_items', 
        columns: [
            { name: 'item_id', type: 'int', key: 'PK' },
            { name: 'invoice_id', type: 'int', key: 'FK' },
            { name: 'product_id', type: 'int', key: 'FK' },
            { name: 'quantity', type: 'int' },
            { name: 'unit_price', type: 'decimal(10, 2)' },
        ] 
    },
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
                                {schemaContent.map((table, index) => (
                                <AccordionItem key={table.name} value={table.name} className={index === schemaContent.length - 1 ? 'border-b-0' : ''}>
                                    <AccordionTrigger className="text-xs py-1.5 px-2 hover:bg-muted rounded-md">
                                        <div className='flex items-center gap-2'>
                                            <Table2Icon className="h-3 w-3" />
                                            {table.name}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4 pt-1 pb-0">
                                        <div className="flex flex-col gap-1.5">
                                            {table.columns.map(col => (
                                                <div key={col.name} className="text-xs text-muted-foreground py-1 px-2 flex items-center justify-between">
                                                    <span>
                                                        {col.name}({col.type})
                                                        {col.key && <span className="font-mono text-foreground/70"> - {col.key}</span>}
                                                    </span>
                                                </div>
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
