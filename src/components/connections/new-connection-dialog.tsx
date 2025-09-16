
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const supportedDbTypes = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'dynamodb', label: 'DynamoDB (Not yet supported)', disabled: true },
  { value: 'sqlserver', label: 'SQL Server (Not yet supported)', disabled: true },
] as const;

const connectionSchema = z.object({
  connectionName: z.string().min(1, 'Connection name is required'),
  dbType: z.enum(['postgresql', 'mysql']),
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().min(1, 'Port is required'),
  user: z.string().min(1, 'User is required'),
  password: z.string().optional(),
  database: z.string().min(1, 'Database name is required'),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

interface NewConnectionDialogProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function NewConnectionDialog({ children, open, onOpenChange }: NewConnectionDialogProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      connectionName: '',
      dbType: 'postgresql',
      host: '',
      port: 5432,
      user: '',
      password: '',
      database: '',
    },
  });

  const dbType = form.watch('dbType');

  const handleTestConnection = async (values: ConnectionFormValues) => {
    setIsTesting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTesting(false);
    // In a real app, you'd get success/error from the API call
    const success = Math.random() > 0.3; 
    toast({
        title: success ? 'Connection Successful' : 'Connection Failed',
        description: success ? `Successfully connected to ${values.host}.` : 'Could not connect to the database. Please check your settings.',
        variant: success ? 'default' : 'destructive'
    })
  };

  const onSubmit = async (values: ConnectionFormValues) => {
    setIsSaving(true);
     // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    onOpenChange(false);
    toast({
        title: 'Connection Saved',
        description: `The connection "${values.connectionName}" has been saved.`
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Connection</DialogTitle>
          <DialogDescription>
            Connect to your database to start querying your data.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="connectionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Production DB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dbType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database Type</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        if (value === 'postgresql') form.setValue('port', 5432);
                        if (value === 'mysql') form.setValue('port', 3306);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a database type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supportedDbTypes.map((type) => (
                           <SelectItem key={type.value} value={type.value} disabled={type.disabled}>
                                {type.label}
                           </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input placeholder="localhost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5432" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="database"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database</FormLabel>
                    <FormControl>
                      <Input placeholder="mydatabase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={form.handleSubmit(handleTestConnection)}
                disabled={isTesting || isSaving}
              >
                {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test Connection
              </Button>
              <Button type="submit" disabled={isTesting || isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Connection
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
