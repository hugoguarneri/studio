

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
import { Users, Search, User, Box, MoreVertical, Trash2, LogOut, Pencil, Link as LinkIcon, Star, Share2, Calendar, Folder, ArrowDownUp } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboards as allDashboards, type Dashboard, dashboardGroups } from '@/lib/mock-data';
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
import { useState, useEffect, useMemo } from 'react';
import DashboardSectionCard from '@/components/dashboard/dashboard-section-card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  onShare: (id: string) => void;
  onCopyLink: (id: string) => void;
  isListItem?: boolean;
};

const DashboardActions = ({ dashboard, onFavoriteToggle, onDelete, onLeave, onShare, onCopyLink, isListItem = false }: DashboardActionsProps) => {
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
  
  const handleCopyLink = () => {
    onCopyLink(dashboard.id);
  };
  
  const handleShare = () => {
    onShare(dashboard.id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(dashboard.id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isListItem && (
          <>
            <DropdownMenuItem onClick={handleFavorite}>
              <Star className={cn("mr-2 h-4 w-4", dashboard.isFavorite && "fill-amber-400 text-amber-500")} />
              {dashboard.isFavorite ? 'Unfavorite' : 'Favorite'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem disabled={dashboard.role !== 'Owner'}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="mr-2 h-4 w-4" /> Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {dashboard.role === 'Owner' ? (
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleLeave}>
            <LogOut className="mr-2 h-4 w-4" /> Leave
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
};


export const DashboardCard = ({ dashboard, onFavoriteToggle, onDelete, onLeave, onShare, onCopyLink }: DashboardActionsProps) => {
  const group = dashboard.groupId ? dashboardGroups.find(g => g.id === dashboard.groupId) : null;
  
  return (
    <Card className="flex flex-col relative">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl truncate pr-10">
            <Link href={`/dashboard/${dashboard.id}`} className="hover:underline">
              {dashboard.name}
            </Link>
          </CardTitle>
          <div
            className={`text-xs font-medium py-1 px-2 rounded-md border ${getRoleStyles(
              dashboard.role
            )}`}
          >
            {dashboard.role}
          </div>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">{dashboard.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src={dashboard.owner.avatarUrl} alt={dashboard.owner.name} />
                <AvatarFallback>{dashboard.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Owned by {dashboard.owner.name}
            </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>Updated {new Date(dashboard.lastUpdated).toLocaleDateString()}</span>
            </div>
            {group && (
                <div className="flex items-center gap-1.5">
                    <Folder className="h-3 w-3" />
                    <span>{group.name}</span>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-2 mt-auto">
        <Button asChild className="flex-1" size="sm">
          <Link href={`/dashboard/${dashboard.id}`}>Open</Link>
        </Button>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="w-9 h-9" onClick={() => onFavoriteToggle(dashboard.id)}>
                        <Star className={cn("h-4 w-4", dashboard.isFavorite && "fill-amber-400 text-amber-500")} />
                        <span className="sr-only">Favorite</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{dashboard.isFavorite ? 'Unfavorite' : 'Favorite'}</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="w-9 h-9" onClick={() => onShare(dashboard.id)}>
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Share</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <DashboardActions dashboard={dashboard} onFavoriteToggle={onFavoriteToggle} onDelete={onDelete} onLeave={onLeave} onShare={onShare} onCopyLink={() => onCopyLink(dashboard.id)} />
      </CardFooter>
    </Card>
  );
};

const DashboardGrid = ({ dashboards, ...actionProps }: { dashboards: Dashboard[] } & Omit<DashboardActionsProps, 'dashboard'>) => (
  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {dashboards.map(dashboard => (
      <DashboardCard key={dashboard.id} dashboard={dashboard} {...actionProps} />
    ))}
  </div>
);

const DashboardListItem = ({ dashboard, ...actionProps }: DashboardActionsProps) => {
    const group = dashboard.groupId ? dashboardGroups.find(g => g.id === dashboard.groupId) : null;
    return (
        <TableRow>
            <TableCell>
                <div className="flex justify-between items-center w-full gap-4">
                    <div className="flex-1 min-w-0">
                        <Link href={`/dashboard/${dashboard.id}`} className="font-medium font-headline text-base hover:underline truncate block">
                            {dashboard.name}
                        </Link>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">{dashboard.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                            <div className="flex items-center gap-1.5">
                                <Avatar className="h-4 w-4">
                                    <AvatarImage src={dashboard.owner.avatarUrl} alt={dashboard.owner.name} />
                                    <AvatarFallback>{dashboard.owner.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{dashboard.owner.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" />
                                <span>Updated {new Date(dashboard.lastUpdated).toLocaleDateString()}</span>
                            </div>
                            {group && (
                                <div className="flex items-center gap-1.5">
                                    <Folder className="h-3 w-3" />
                                    <span>{group.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <div className={`text-xs font-medium py-1 px-2 rounded-md border hidden sm:block ${getRoleStyles(dashboard.role)}`}>
                            {dashboard.role}
                        </div>
                        <div className="flex items-center gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => actionProps.onFavoriteToggle(dashboard.id)}>
                                            <Star className={cn("h-4 w-4", dashboard.isFavorite && "fill-amber-400 text-amber-500")} />
                                            <span className="sr-only">Favorite</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{dashboard.isFavorite ? 'Unfavorite' : 'Favorite'}</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => actionProps.onShare(dashboard.id)}>
                                            <Share2 className="h-4 w-4" />
                                            <span className="sr-only">Share</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Share</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DashboardActions dashboard={dashboard} {...actionProps} isListItem={true} />
                        </div>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
};


export const DashboardList = ({ dashboards, ...actionProps }: { dashboards: Dashboard[] } & Omit<DashboardActionsProps, 'dashboard'>) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dashboard Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dashboards.map(dashboard => (
          <DashboardListItem key={dashboard.id} dashboard={dashboard} {...actionProps} />
        ))}
      </TableBody>
    </Table>
  </Card>
);

export type ViewMode = 'grid' | 'list';

type SortKey = 'name' | 'lastUpdated';
type FavoriteFilter = 'all' | 'favorites';

export const DashboardView = ({ dashboards: initialDashboards }: { dashboards: Dashboard[] }) => {
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get('view') as ViewMode) || 'grid';
  
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdated');
  const [favoriteFilter, setFavoriteFilter] = useState<FavoriteFilter>('all');
  const { toast } = useToast();

  useEffect(() => {
    setDashboards(initialDashboards);
  }, [initialDashboards]);

  const onFavoriteToggle = (id: string) => {
    setDashboards(dashboards.map(d => 
      d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
    ));
    const dashboard = dashboards.find(d => d.id === id);
    if(dashboard){
        toast({
          title: dashboard.isFavorite ? "Removed from Favorites" : "Added to Favorites",
          description: `"${dashboard.name}" has been updated.`,
        });
    }
  };

  const onDelete = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
  };

  const onLeave = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
  };

  const onShare = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    toast({
      title: "Shared Dashboard",
      description: `"${dashboard?.name}" has been shared.`,
    });
  };

  const onCopyLink = (id: string) => {
    const url = `${window.location.origin}/dashboard/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Dashboard link copied to clipboard.",
    });
  };

  const actionProps = {
    onFavoriteToggle,
    onDelete,
    onLeave,
    onShare,
    onCopyLink,
  };

  const sortedAndFilteredDashboards = useMemo(() => {
    return dashboards
      .filter(d => {
        const group = d.groupId ? dashboardGroups.find(g => g.id === d.groupId) : null;
        const searchTermLower = searchTerm.toLowerCase();
        
        return (
          d.name.toLowerCase().includes(searchTermLower) ||
          d.owner.name.toLowerCase().includes(searchTermLower) ||
          (group && group.name.toLowerCase().includes(searchTermLower))
        );
      })
      .filter(d =>
        favoriteFilter === 'all' || (favoriteFilter === 'favorites' && d.isFavorite)
      )
      .sort((a, b) => {
        if (sortKey === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortKey === 'lastUpdated') {
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        }
        return 0;
      });
  }, [dashboards, searchTerm, favoriteFilter, sortKey]);

  const ITEMS_PER_PAGE = viewMode === 'list' ? 10 : 9;
  const totalPages = Math.ceil(sortedAndFilteredDashboards.length / ITEMS_PER_PAGE);
  const paginatedDashboards = sortedAndFilteredDashboards.slice(
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
  }, [dashboards, viewMode, searchTerm, favoriteFilter, sortKey]);

  if (initialDashboards.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No dashboards found for this category.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, owner, or group..." 
            className="pl-10 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-grow" />
        <div className="flex items-center gap-4">
          <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
            <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                    <ArrowDownUp className="h-4 w-4" />
                    <span className="hidden md:inline">Sort by</span>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="lastUpdated">Last Updated</SelectItem>
                <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center p-1 bg-muted rounded-md">
            <Button 
                variant={favoriteFilter === 'all' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="px-3"
                onClick={() => setFavoriteFilter('all')}
            >
                All
            </Button>
            <Button 
                variant={favoriteFilter === 'favorites' ? 'secondary' : 'ghost'} 
                size="sm"
                className="flex items-center gap-2 px-3"
                onClick={() => setFavoriteFilter('favorites')}
            >
                <Star className="h-4 w-4 text-amber-500" />
                <span className="hidden sm:inline">Favorites</span>
            </Button>
          </div>
        </div>
      </div>

      {sortedAndFilteredDashboards.length === 0 ? (
         <div className="text-center text-muted-foreground py-12">
          No dashboards found matching your criteria.
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline">All Dashboards</h1>
          <p className="text-muted-foreground">Create, manage, and share your data dashboards.</p>
        </div>
        <DashboardView dashboards={allDashboards} />
      </div>
    </div>
  )
}

    
