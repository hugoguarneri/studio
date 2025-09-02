
'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const breadcrumbNameMap: { [key: string]: string } = {
  '/dashboard': 'Dashboards',
  '/dashboard/my-dashboards': 'My Dashboards',
  '/dashboard/favorites': 'Favorite Dashboards',
  '/dashboard/shared-with-me': 'Shared With Me',
  '/dashboard/groups': 'Dashboard Groups',
  '/queries': 'Query Editor',
  '/connections': 'Connections',
};

const getPageTitle = (pathname: string) => {
    const isIndividualDashboard = /^\/dashboard\/dash_[^/]+$/.test(pathname);
    if (isIndividualDashboard) {
        return `Dashboard ${pathname.split('/').pop()}`;
    }
    return breadcrumbNameMap[pathname] || null;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(i => i);
  const isDashboardRoute = pathSegments[0] === 'dashboard';

  let title = null;
  let description = 'Create, manage, and share your data dashboards.';

  if (isDashboardRoute) {
    title = getPageTitle(pathname);
    if (!title && pathSegments.length > 1) {
        title = `Dashboard ${pathSegments[1]}`;
        const lastUpdated = new Date();
        description = `Last updated: ${lastUpdated.toLocaleTimeString()}`
    } else if (!title) {
        title = "Dashboards";
    }
  } else {
    title = getPageTitle(pathname);
    if (pathname === '/queries') {
        description = "Craft, save, and manage your SQL queries."
    }
    if (pathname === '/connections') {
        description = "Manage your connections to Postgres and MySQL databases."
    }
  }


  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const name = breadcrumbNameMap[href] || segment.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    const isLast = index === pathSegments.length - 1;
    return { href, name, isLast };
  });

  return (
    <div>
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            {breadcrumbs.map(breadcrumb => (
            <React.Fragment key={breadcrumb.href}>
                <Link href={breadcrumb.href} className={breadcrumb.isLast ? 'text-foreground font-medium' : 'hover:underline'}>
                    {breadcrumb.name}
                </Link>
                {!breadcrumb.isLast && <ChevronRight className="h-4 w-4" />}
            </React.Fragment>
            ))}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
