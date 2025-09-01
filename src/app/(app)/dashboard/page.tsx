
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
import { PlusCircle, Users, Star, History, Folder } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboards, dashboardGroups } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';

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

const DashboardCard = ({ dashboard }: { dashboard: (typeof dashboards)[0] }) => {
  return (
    <Card>
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
        {dashboard.role === 'Owner' && (
          <Button variant="outline">
            <Users className="mr-2" /> Share
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const DashboardSection = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <Icon className="size-6 text-muted-foreground" />
      <h2 className="text-2xl font-headline font-semibold">{title}</h2>
    </div>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  </div>
);


export default function DashboardListPage() {
  const favoriteDashboards = dashboards.filter(d => d.isFavorite);
  const recentDashboards = [...dashboards].sort((a, b) => b.lastViewed.getTime() - a.lastViewed.getTime()).slice(0, 3);
  const myDashboards = dashboards.filter(d => d.role === 'Owner' && !d.groupId);

  return (
    <div className="flex flex-col gap-10">
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
      
      {favoriteDashboards.length > 0 && (
        <DashboardSection title="Favorites" icon={Star}>
          {favoriteDashboards.map(dashboard => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} />
          ))}
        </DashboardSection>
      )}

      {recentDashboards.length > 0 && (
        <DashboardSection title="Recently Viewed" icon={History}>
          {recentDashboards.map(dashboard => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} />
          ))}
        </DashboardSection>
      )}

      <Separator />

      <div className="space-y-8">
        {dashboardGroups.map(group => {
          const groupDashboards = dashboards.filter(d => d.groupId === group.id);
          if (groupDashboards.length === 0) return null;
          return (
            <DashboardSection key={group.id} title={group.name} icon={Folder}>
              {groupDashboards.map(dashboard => (
                <DashboardCard key={dashboard.id} dashboard={dashboard} />
              ))}
            </DashboardSection>
          )
        })}

        {myDashboards.length > 0 && (
          <DashboardSection title="My Dashboards" icon={Folder}>
            {myDashboards.map(dashboard => (
              <DashboardCard key={dashboard.id} dashboard={dashboard} />
            ))}
          </DashboardSection>
        )}
      </div>

    </div>
  );
}
