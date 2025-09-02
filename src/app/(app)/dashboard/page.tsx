

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
import { Users, Search, Star, User, Box, MoreVertical, Trash2, LogOut, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboards as allDashboards, type Dashboard } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import DashboardSectionCard from '@/components/dashboard/dashboard-section-card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

type DashboardActionsProps = {
  dashboard: Dashboard;
  onFavoriteToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onLeave: (id: string) => void;
};

const DashboardActions = ({ dashboard, onDelete, onLeave }: Omit<DashboardActionsProps, 'onFavoriteToggle'>) => {
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(dashboard.id);
    toast({
      title: "Dashboard Deleted",
      description: `"${dashboard.name}" has been permanently deleted.`,
      variant: "destructive"
    });
  }

  const handleLeave = () => {
    onLeave(dashboard.id);
    toast({
      title: "Left Dashboard",
      description: `You have left "${dashboard.name}".`,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={dashboard.role !== 'Owner'}>
          <Pencil className="mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {dashboard.role === 'Owner' ? (
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2" /> Delete
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleLeave}>
            <LogOut className="mr-2" /> Leave
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
};


export const DashboardCard = ({ dashboard, onFavoriteToggle, onDelete, onLeave }: DashboardActionsProps) => {
  const { toast } = useToast();
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(dashboard.id);
    toast({
      title: dashboard.isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `"${dashboard.name}" has been updated.`,
    });
  }

  return (
    <Card className="flex flex-col relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl truncate pr-2">
            <Link href={`/dashboard/${dashboard.id}`} className="hover:underline">
              {dashboard.name}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`text-xs font-medium py-1 px-2 rounded-md border ${getRoleStyles(
                dashboard.role
              )}`}
            >
              {dashboard.role}
            </div>
          </div>
        </div>
        <CardDescription className="truncate h-10">{dashboard.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
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
        <Button asChild className="w-full" size="sm">
          <Link href={`/dashboard/${dashboard.id}`}>Open</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleFavorite}>
          <Star className={cn("h-4 w-4", dashboard.isFavorite && "fill-amber-400 text-amber-500")} />
          <span className="sr-only">Favorite</span>
        </Button>
         <Button variant="outline" size="sm" disabled={dashboard.role !== 'Owner'}>
          <Users />
        </Button>
        <DashboardActions dashboard={dashboard} onDelete={onDelete} onLeave={onLeave} />
      </CardFooter>
    </Card>
  );
};

const DashboardGrid = ({ dashboards, onFavoriteToggle, onDelete, onLeave }: { dashboards: Dashboard[] } & Omit<DashboardActionsProps, 'dashboard'>) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {dashboards.map(dashboard => (
      <DashboardCard key={dashboard.id} dashboard={dashboard} onFavoriteToggle={onFavoriteToggle} onDelete={onDelete} onLeave={onLeave} />
    ))}
  </div>
);

const DashboardListItem = ({ dashboard, onFavoriteToggle, onDelete, onLeave }: DashboardActionsProps) => {
    const { toast } = useToast();
    
    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle(dashboard.id);
        toast({
          title: dashboard.isFavorite ? "Removed from Favorites" : "Added to Favorites",
          description: `"${dashboard.name}" has been updated.`,
        });
    }
    
    return (
      <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFavorite}>
                    <Star className={cn("h-4 w-4", dashboard.isFavorite && "fill-amber-400 text-amber-500")} />
                    <span className="sr-only">Favorite</span>
                </Button>
                <div className="flex flex-col">
                    <Link href={`/dashboard/${dashboard.id}`} className="font-medium font-headline text-base hover:underline truncate">
                    {dashboard.name}
                    </Link>
                    <span className="text-sm text-muted-foreground truncate">{dashboard.description}</span>
                </div>
            </div>
        </TableCell>
        <TableCell>
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
            <AvatarImage src={dashboard.owner.avatarUrl} alt={dashboard.owner.name} />
            <AvatarFallback>{dashboard.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{dashboard.owner.name}</span>
        </div>
        </TableCell>
        <TableCell>
        <div
            className={`text-xs font-medium py-1 px-2 rounded-md border text-center w-fit ${getRoleStyles(
            dashboard.role
            )}`}
        >
            {dashboard.role}
        </div>
        </TableCell>
        <TableCell className="text-right">
        <div className="flex justify-end items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/${dashboard.id}`}>Open</Link>
            </Button>
            <Button variant="outline" size="sm" disabled={dashboard.role !== 'Owner'}>
              <Users />
            </Button>
            <DashboardActions dashboard={dashboard} onDelete={onDelete} onLeave={onLeave} />
        </div>
        </TableCell>
      </TableRow>
    );
};


export const DashboardList = ({ dashboards, onFavoriteToggle, onDelete, onLeave }: { dashboards: Dashboard[] } & Omit<DashboardActionsProps, 'dashboard'>) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dashboards.map(dashboard => (
          <DashboardListItem key={dashboard.id} dashboard={dashboard} onFavoriteToggle={onFavoriteToggle} onDelete={onDelete} onLeave={onLeave} />
        ))}
      </TableBody>
    </Table>
  </Card>
);

export type ViewMode = 'grid' | 'list';

export const DashboardView = ({ dashboards: initialDashboards }: { dashboards: Dashboard[] }) => {
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get('view') as ViewMode) || 'grid';
  
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setDashboards(initialDashboards);
  }, [initialDashboards]);

  const handleFavoriteToggle = (id: string) => {
    setDashboards(dashboards.map(d => 
      d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
    ));
  };

  const handleDelete = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
  };

  const handleLeave = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
  };

  const filteredDashboards = dashboards.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = viewMode === 'list' ? 5 : 6;
  const totalPages = Math.ceil(filteredDashboards.length / ITEMS_PER_PAGE);
  const paginatedDashboards = filteredDashboards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [dashboards, viewMode, searchTerm]);

  if (initialDashboards.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No dashboards found for this category.
      </div>
    );
  }
  
  const actionProps = { onFavoriteToggle: handleFavoriteToggle, onDelete: handleDelete, onLeave: handleLeave };

  return (
    <div className="space-y-4">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search in this section..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDashboards.length === 0 ? (
         <div className="text-center text-muted-foreground py-12">
          No dashboards found matching your search.
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <DashboardList dashboards={paginatedDashboards} {...actionProps} />
          ) : (
            <DashboardGrid dashboards={paginatedDashboards} {...actionProps} />
          )}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};


const sections = [
  { icon: User, title: "My Dashboards", description: "Dashboards you have created or own.", href: "/dashboard/my-dashboards" },
  { icon: Star, title: "Favorites", description: "Your bookmarked dashboards.", href: "/dashboard/favorites" },
  { icon: Users, title: "Shared with me", description: "Dashboards shared by other users.", href: "/dashboard/shared-with-me" },
  { icon: Box, title: "Groups", description: "Organize dashboards into groups.", href: "/dashboard/groups" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(section => (
          <DashboardSectionCard key={section.href} {...section} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">All Dashboards</h2>
        <DashboardView dashboards={allDashboards} />
      </div>
    </div>
  )
}
