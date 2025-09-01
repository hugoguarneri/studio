
'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { dashboards } from '@/lib/mock-data';

const breadcrumbNameMap: { [key: string]: string } = {
  '/dashboard': 'Dashboards',
  '/dashboard/my-dashboards': 'My Dashboards',
  '/dashboard/favorites': 'Favorites',
  '/dashboard/shared-with-me': 'Shared With Me',
  '/dashboard/groups': 'Groups',
  '/queries': 'Query Editor',
  '/connections': 'Connections',
};

const getDashboardName = (id: string) => {
  const dashboard = dashboards.find(d => d.id === id);
  return dashboard?.name || id;
}


export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(i => i);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    let name = breadcrumbNameMap[href] || segment;
    if (pathSegments[0] === 'dashboard' && index === 1 && segment.startsWith('dash_')) {
      name = getDashboardName(segment);
    }
    
    const isLast = index === pathSegments.length - 1;

    return { href, name, isLast };
  });

  return (
    <div>
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.href}>
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                <Link href={breadcrumb.href} className={breadcrumb.isLast ? 'text-foreground font-medium' : 'hover:underline'}>
                    {breadcrumb.name}
                </Link>
            </React.Fragment>
            ))}
        </div>
    </div>
  );
}
