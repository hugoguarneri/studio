
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const dashboards = [
  {
    id: 'dash_1',
    name: 'Q3 Sales Performance',
    description: 'Deep dive into sales metrics for the third quarter.',
    role: 'Owner',
    owner: { name: 'You', avatarUrl: 'https://picsum.photos/id/237/32/32' },
  },
  {
    id: 'dash_2',
    name: 'Marketing Campaign Funnel',
    description: 'Shared by marketing@example.com',
    role: 'Editor',
    owner: { name: 'Marketing Team', avatarUrl: 'https://picsum.photos/id/1/32/32' },
  },
  {
    id: 'dash_3',
    name: 'Website Analytics Overview',
    description: 'Public read-only dashboard for company-wide visibility.',
    role: 'Viewer',
    owner: { name: 'Alex Doe', avatarUrl: 'https://picsum.photos/id/1005/32/32' },
  },
];

export default function DashboardListPage() {
  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Editor':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Dashboards
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and share your data dashboards.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dashboards.map(dashboard => (
          <Card key={dashboard.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="font-headline text-xl">
                  {dashboard.name}
                </CardTitle>
                <div
                  className={`text-xs font-medium py-1 px-2 rounded-md border ${getRoleStyles(
                    dashboard.role
                  )}`}
                >
                  {dashboard.role}
                </div>
              </div>
              <CardDescription>{dashboard.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                      <AvatarImage src={dashboard.owner.avatarUrl} alt={dashboard.owner.name} />
                      <AvatarFallback>{dashboard.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    Owned by {dashboard.owner.name}
                  </span>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button asChild className="w-full">
                <Link href={`/dashboard/${dashboard.id}`}>Open</Link>
              </Button>
              <Button variant="outline">
                <Users className="mr-2" /> Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
